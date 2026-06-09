(function () {
    'use strict';

    var API = 'https://mail.flomily.de/api/pwa';

    var state = {
        user: null,
        pendingEvents: [],
        recognition: null,
        isRecording: false
    };

    // ── Helpers ────────────────────────────────────────────────────────────────
    function api(path, opts) {
        opts = opts || {};
        opts.credentials = 'include';
        opts.headers = opts.headers || {};
        if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
            opts.headers['Content-Type'] = 'application/json';
            opts.body = JSON.stringify(opts.body);
        }
        return fetch(API + path, opts).then(function (r) {
            if (!r.ok) return r.json().catch(function () { return {}; }).then(function (d) { throw new Error(d.error || 'HTTP ' + r.status); });
            return r.json();
        });
    }

    function scrollBottom() {
        var c = document.getElementById('chat-messages');
        if (c) c.scrollTop = c.scrollHeight;
    }

    function formatEventDate(ev) {
        if (!ev.date) return '';
        var parts = ev.date.split('-');
        var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
        var days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
        var months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
        var result = days[d.getDay()] + ', ' + d.getDate() + '. ' + months[d.getMonth()] + ' ' + d.getFullYear();
        if (ev.start_time) result += ' · ' + ev.start_time + ' Uhr';
        if (ev.end_time) result += ' – ' + ev.end_time + ' Uhr';
        if (ev.end_date && ev.end_date !== ev.date) {
            var ep = ev.end_date.split('-');
            var ed = new Date(+ep[0], +ep[1] - 1, +ep[2]);
            result += ' bis ' + days[ed.getDay()] + ', ' + ed.getDate() + '. ' + months[ed.getMonth()];
        }
        return result;
    }

    function remainingCredits() {
        if (!state.user) return 100;
        return (state.user.events_limit || 100) - (state.user.events_count || 0);
    }

    // ── Auth ───────────────────────────────────────────────────────────────────
    function checkSession() {
        var params = new URLSearchParams(window.location.search);
        var token = params.get('token');
        var email = params.get('email');
        if (token && email) {
            api('/auth/verify', { method: 'POST', body: { email: email, token: token } }).then(function (data) {
                state.user = data.user || data;
                history.replaceState({}, '', '/app/');
                onLoggedIn();
            }).catch(function () {
                showScreen('login');
                addBotMsg('Login-Link ungültig oder abgelaufen. Bitte neu anmelden.');
            });
        } else {
            api('/auth/check').then(function (data) {
                if (data.ok) { state.user = data.user; onLoggedIn(); }
                else { showScreen('login'); }
            }).catch(function () { showScreen('login'); });
        }
    }

    window.doLogin = function () {
        var email = document.getElementById('login-email').value.trim();
        if (!email) return;
        api('/auth/login', { method: 'POST', body: { email: email } }).then(function () {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('login-sent').style.display = 'block';
        }).catch(function () {
            alert('Fehler beim Senden. Bitte versuche es erneut.');
        });
    };

    window.doLogout = function () {
        api('/auth/logout', { method: 'POST' }).catch(function () { }).finally(function () {
            state.user = null;
            state.pendingEvents = [];
            document.getElementById('chat-messages').innerHTML = '';
            showScreen('login');
            document.getElementById('login-form').style.display = 'block';
            document.getElementById('login-sent').style.display = 'none';
        });
    };

    function onLoggedIn() {
        updateCreditsDisplay();
        showScreen('chat');
        if (!document.getElementById('chat-messages').children.length) {
            var name = (state.user.name || state.user.email || '').split('@')[0];
            addBotMsg('Hallo ' + name + '! 👋\nSchick mir einen Termin — als Text, Foto oder Sprachnachricht.\n\nDu kannst auch "WM 2026" oder "F1" tippen für Sporttermine.');
        }
        checkLimitWarning();
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/app/sw.js').catch(function () { });
        }
    }

    function checkLimitWarning() {
        var remaining = remainingCredits();
        var limit = state.user ? (state.user.events_limit || 100) : 100;
        if (remaining <= 0) {
            addBotMsg('⚠️ Dein Event-Limit ist erreicht (' + limit + '/' + limit + '). Bitte kontaktiere uns für mehr Credits.');
        } else if (remaining <= Math.round(limit * 0.2)) {
            addBotMsg('💡 Noch ' + remaining + ' von ' + limit + ' Credits übrig.');
        }
    }

    // ── Screens ────────────────────────────────────────────────────────────────
    window.showScreen = function (name) {
        document.querySelectorAll('.screen').forEach(function (s) { s.classList.remove('active'); });
        document.getElementById('screen-' + name).classList.add('active');
        // Update nav button states
        document.querySelectorAll('.header-btn').forEach(function (b) { b.classList.remove('active'); });
        var activeBtn = document.querySelector('.header-btn[title="' + ({ chat: 'Chat', history: 'Historie', profile: 'Profil' }[name] || '') + '"]');
        if (activeBtn) activeBtn.classList.add('active');
        if (name === 'history') loadHistory();
        if (name === 'profile') loadProfile();
    };

    function updateCreditsDisplay() {
        var el = document.getElementById('credits-display');
        if (el) el.textContent = remainingCredits() + ' Credits';
    }

    // ── Chat messages ──────────────────────────────────────────────────────────
    function addUserMsg(text) {
        var div = document.createElement('div');
        div.className = 'msg msg-user';
        div.textContent = text;
        document.getElementById('chat-messages').appendChild(div);
        scrollBottom();
    }

    function addBotMsg(text) {
        var div = document.createElement('div');
        div.className = 'msg msg-bot';
        div.style.whiteSpace = 'pre-line';
        div.textContent = text;
        document.getElementById('chat-messages').appendChild(div);
        scrollBottom();
    }

    function addLoading() {
        var div = document.createElement('div');
        div.className = 'loading';
        div.innerHTML = '<span>flomily denkt nach</span><span class="loading-dots"></span>';
        div.id = 'loading-indicator';
        document.getElementById('chat-messages').appendChild(div);
        scrollBottom();
    }

    function removeLoading() {
        var el = document.getElementById('loading-indicator');
        if (el) el.remove();
    }

    // ── Event cards ────────────────────────────────────────────────────────────
    function renderEventCard(ev, index) {
        var card = document.createElement('div');
        card.className = 'event-card';
        card.id = 'event-card-' + index;

        var title = document.createElement('h3');
        title.textContent = ev.title || 'Termin';
        card.appendChild(title);

        var dateStr = formatEventDate(ev);
        if (dateStr) {
            var dateMeta = document.createElement('div');
            dateMeta.className = 'meta';
            dateMeta.textContent = '📅 ' + dateStr;
            card.appendChild(dateMeta);
        }

        if (ev.location) {
            var locMeta = document.createElement('div');
            locMeta.className = 'meta';
            locMeta.textContent = '📍 ' + ev.location;
            card.appendChild(locMeta);
        }

        if (ev.category) {
            var catMeta = document.createElement('div');
            catMeta.className = 'meta';
            catMeta.textContent = '🏷️ ' + ev.category;
            card.appendChild(catMeta);
        }

        if (ev.notes) {
            var notesMeta = document.createElement('div');
            notesMeta.className = 'meta';
            notesMeta.textContent = '📝 ' + ev.notes;
            card.appendChild(notesMeta);
        }

        var actions = document.createElement('div');
        actions.className = 'actions';

        var btnConfirm = document.createElement('button');
        btnConfirm.className = 'btn-confirm';
        btnConfirm.textContent = 'Eintragen';
        btnConfirm.onclick = function () { confirmEvent(index); };

        var btnEdit = document.createElement('button');
        btnEdit.className = 'btn-discard';
        btnEdit.textContent = 'Bearbeiten';
        btnEdit.onclick = function () { editEvent(index); };

        var btnDiscard = document.createElement('button');
        btnDiscard.className = 'btn-discard';
        btnDiscard.textContent = 'Verwerfen';
        btnDiscard.onclick = function () { discardEvent(index); };

        actions.appendChild(btnConfirm);
        actions.appendChild(btnEdit);
        actions.appendChild(btnDiscard);
        card.appendChild(actions);

        document.getElementById('chat-messages').appendChild(card);
        scrollBottom();
    }

    function renderEventCards(events) {
        state.pendingEvents = events.slice();
        var count = events.length;
        if (count === 1) {
            addBotMsg('Ich habe folgenden Termin erkannt:');
        } else {
            addBotMsg('Ich habe ' + count + ' Termine erkannt:');
        }
        events.forEach(function (ev, i) { renderEventCard(ev, i); });

        if (count > 1) {
            var batch = document.createElement('div');
            batch.className = 'batch-actions';
            batch.id = 'batch-actions';

            var btnAll = document.createElement('button');
            btnAll.className = 'btn-batch';
            btnAll.textContent = 'Alle eintragen (' + count + ')';
            btnAll.onclick = confirmAllEvents;

            var btnNone = document.createElement('button');
            btnNone.className = 'btn-batch';
            btnNone.style.background = 'none';
            btnNone.style.border = '1px solid var(--border)';
            btnNone.style.color = 'var(--muted)';
            btnNone.textContent = 'Alle verwerfen';
            btnNone.onclick = discardAllEvents;

            batch.appendChild(btnAll);
            batch.appendChild(btnNone);
            document.getElementById('chat-messages').appendChild(batch);
            scrollBottom();
        }
    }

    function confirmEvent(index) {
        var ev = state.pendingEvents[index];
        if (!ev || !ev.pending_id) return;
        var card = document.getElementById('event-card-' + index);
        if (card) card.querySelector('.btn-confirm').textContent = '...';

        api('/events/confirm', { method: 'POST', body: { event_id: ev.pending_id } }).then(function (data) {
            if (card) {
                card.classList.add('confirmed');
                var recipients = data.recipients || [state.user.email];
                var note = document.createElement('div');
                note.style.cssText = 'margin-top:8px;color:var(--primary);font-weight:700;font-size:0.85rem;';
                note.textContent = '✓ Versendet an ' + recipients.join(', ');
                card.appendChild(note);
            }
            if (state.user) {
                state.user.events_count = (state.user.events_count || 0) + 1;
                updateCreditsDisplay();
            }
            removeBatchIfDone();
        }).catch(function () {
            addBotMsg('Fehler beim Eintragen. Bitte versuche es erneut.');
            if (card) card.querySelector('.btn-confirm').textContent = 'Eintragen';
        });
        state.pendingEvents[index] = null;
    }

    function editEvent(index) {
        var ev = state.pendingEvents[index];
        if (!ev) return;
        var card = document.getElementById('event-card-' + index);
        if (!card) return;

        card.querySelector('.actions').style.display = 'none';

        var form = document.createElement('div');
        form.className = 'edit-form';
        form.style.cssText = 'margin-top:10px;display:flex;flex-direction:column;gap:6px;';

        function addField(label, key, val) {
            var row = document.createElement('div');
            row.style.cssText = 'display:flex;gap:6px;align-items:center;';
            var lbl = document.createElement('span');
            lbl.style.cssText = 'font-size:0.8rem;color:var(--muted);min-width:50px;';
            lbl.textContent = label;
            var inp = document.createElement('input');
            inp.style.cssText = 'flex:1;padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:0.85rem;';
            inp.value = val || '';
            inp.dataset.key = key;
            row.appendChild(lbl);
            row.appendChild(inp);
            form.appendChild(row);
        }

        addField('Titel', 'title', ev.title);
        addField('Datum', 'date', ev.date);
        addField('Von', 'start_time', ev.start_time);
        addField('Bis', 'end_time', ev.end_time);
        addField('Ort', 'location', ev.location);

        var btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex;gap:6px;margin-top:6px;';

        var btnSave = document.createElement('button');
        btnSave.className = 'btn-confirm';
        btnSave.textContent = 'Speichern';
        btnSave.onclick = function () {
            var updates = {};
            form.querySelectorAll('input').forEach(function (inp) {
                updates[inp.dataset.key] = inp.value;
            });
            api('/events/edit', { method: 'POST', body: { event_id: ev.pending_id, updates: updates } }).then(function (data) {
                state.pendingEvents[index] = data.event;
                card.remove();
                renderEventCard(data.event, index);
            }).catch(function () {
                addBotMsg('Fehler beim Speichern.');
            });
        };

        var btnCancel = document.createElement('button');
        btnCancel.className = 'btn-discard';
        btnCancel.textContent = 'Abbrechen';
        btnCancel.onclick = function () {
            form.remove();
            card.querySelector('.actions').style.display = 'flex';
        };

        btnRow.appendChild(btnSave);
        btnRow.appendChild(btnCancel);
        form.appendChild(btnRow);
        card.appendChild(form);
        scrollBottom();
    }

    function discardEvent(index) {
        var ev = state.pendingEvents[index];
        var card = document.getElementById('event-card-' + index);
        if (ev && ev.pending_id) {
            api('/events/discard', { method: 'POST', body: { event_id: ev.pending_id } });
        }
        if (card) {
            card.classList.add('confirmed');
            card.querySelector('.actions').style.display = 'none';
            var note = document.createElement('div');
            note.style.cssText = 'margin-top:8px;color:var(--muted);font-size:0.85rem;';
            note.textContent = '✗ Verworfen';
            card.appendChild(note);
        }
        state.pendingEvents[index] = null;
        removeBatchIfDone();
    }

    function removeBatchIfDone() {
        var remaining = state.pendingEvents.filter(function (e) { return e !== null; });
        if (remaining.length === 0) {
            var b = document.getElementById('batch-actions');
            if (b) b.remove();
        }
    }

    function confirmAllEvents() {
        var ids = [];
        state.pendingEvents.forEach(function (ev) {
            if (ev && ev.pending_id) ids.push(ev.pending_id);
        });
        if (!ids.length) return;

        addLoading();
        api('/events/confirm-all', { method: 'POST', body: { event_ids: ids } }).then(function (data) {
            removeLoading();
            var ok = 0;
            (data.results || []).forEach(function (r, i) {
                if (r.ok) {
                    ok++;
                    var card = document.getElementById('event-card-' + i);
                    if (card) card.classList.add('confirmed');
                }
            });
            if (state.user) {
                state.user.events_count = (state.user.events_count || 0) + ok;
                updateCreditsDisplay();
            }
            var recipients = state.user ? [state.user.email] : [];
            addBotMsg('✓ ' + ok + ' Termine versendet an ' + (recipients.join(', ') || 'deine E-Mail') + '.');
            state.pendingEvents = [];
            var b = document.getElementById('batch-actions');
            if (b) b.remove();
        }).catch(function () {
            removeLoading();
            addBotMsg('Fehler beim Versenden.');
        });
    }

    function discardAllEvents() {
        state.pendingEvents.forEach(function (ev, i) {
            if (ev) discardEvent(i);
        });
    }

    // ── Sport keywords ─────────────────────────────────────────────────────────
    function detectSportKeyword(text) {
        var t = text.toLowerCase();
        if (t.indexOf('wm 2026') >= 0 || t.indexOf('wm2026') >= 0 || t.indexOf('world cup') >= 0 || t.indexOf('weltmeisterschaft') >= 0) return 'wm2026';
        if (t.indexOf('f1') >= 0 || t.indexOf('formel 1') >= 0 || t.indexOf('formula') >= 0) return 'f1';
        return null;
    }

    function loadSportCatalog(sport) {
        addLoading();
        api('/sports/' + sport).then(function (d) {
            removeLoading();
            if (d.options) {
                addBotMsg('Welche Termine möchtest du?');
                var card = document.createElement('div');
                card.className = 'event-card';
                d.options.forEach(function (o) {
                    var btn = document.createElement('button');
                    btn.className = 'btn-confirm';
                    btn.style.cssText = 'margin:4px 0;width:100%;text-align:left;';
                    btn.textContent = o.label + ' (' + o.count + ' Termine)';
                    btn.onclick = function () { selectSport(sport, o.id); card.remove(); };
                    card.appendChild(btn);
                });
                document.getElementById('chat-messages').appendChild(card);
                scrollBottom();
            }
        }).catch(function () { removeLoading(); addBotMsg('Sport-Daten konnten nicht geladen werden.'); });
    }

    function selectSport(sport, option) {
        addLoading();
        api('/sports/' + sport + '/select', { method: 'POST', body: { option: option } }).then(function (d) {
            removeLoading();
            if (d.events && d.events.length > 0) {
                renderEventCards(d.events);
            } else {
                addBotMsg('Keine Termine gefunden.');
            }
        }).catch(function () { removeLoading(); addBotMsg('Fehler beim Laden der Termine.'); });
    }

    // ── Send message ───────────────────────────────────────────────────────────
    window.sendMessage = function () {
        var input = document.getElementById('chat-input');
        var text = input.value.trim();
        if (!text) return;
        input.value = '';
        addUserMsg(text);

        // Check sport keywords first
        var sport = detectSportKeyword(text);
        if (sport) {
            loadSportCatalog(sport);
            return;
        }

        // Check credit limit
        if (remainingCredits() <= 0) {
            addBotMsg('⚠️ Dein Event-Limit ist erreicht. Bitte kontaktiere uns für mehr Credits.');
            return;
        }

        addLoading();
        api('/events/parse', { method: 'POST', body: { text: text } }).then(function (data) {
            removeLoading();
            if (data.events && data.events.length) {
                renderEventCards(data.events);
            } else {
                addBotMsg('Ich konnte keinen Termin erkennen. Versuche es mit konkreterem Text, z.B. "Zahnarzt Freitag 14 Uhr".');
            }
        }).catch(function (err) {
            removeLoading();
            if (err.message === 'limit_reached') {
                addBotMsg('⚠️ Dein Event-Limit ist erreicht.');
            } else {
                addBotMsg('Fehler beim Verarbeiten. Bitte versuche es erneut.');
            }
        });
    };

    // ── Photo ──────────────────────────────────────────────────────────────────
    window.takePhoto = function () {
        document.getElementById('photo-input').click();
    };

    window.handlePhoto = function (input) {
        var file = input.files[0];
        if (!file) return;
        addUserMsg('📷 Foto gesendet');
        addLoading();
        var reader = new FileReader();
        reader.onload = function (e) {
            var base64 = e.target.result.split(',')[1];
            var mediaType = file.type || 'image/jpeg';
            api('/events/parse', { method: 'POST', body: { image: base64, media_type: mediaType } }).then(function (data) {
                removeLoading();
                if (data.events && data.events.length) {
                    renderEventCards(data.events);
                } else {
                    addBotMsg('Ich konnte keine Termine im Bild erkennen.');
                }
            }).catch(function () {
                removeLoading();
                addBotMsg('Fehler beim Verarbeiten des Fotos.');
            });
        };
        reader.readAsDataURL(file);
        input.value = '';
    };

    // ── Voice ──────────────────────────────────────────────────────────────────
    window.startMic = function (e) {
        if (e) e.preventDefault();
        var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            addBotMsg('Spracherkennung wird von diesem Browser nicht unterstützt.');
            return;
        }
        if (state.isRecording) return;
        state.isRecording = true;
        document.getElementById('btn-mic').classList.add('recording');

        var rec = new SR();
        rec.lang = 'de-DE';
        rec.interimResults = false;
        state.recognition = rec;

        rec.onresult = function (event) {
            var text = event.results[0][0].transcript;
            document.getElementById('chat-input').value = text;
        };
        rec.onerror = function () { };
        rec.onend = function () {
            state.isRecording = false;
            document.getElementById('btn-mic').classList.remove('recording');
            state.recognition = null;
            var val = document.getElementById('chat-input').value.trim();
            if (val) window.sendMessage();
        };
        rec.start();
    };

    window.stopMic = function (e) {
        if (e) e.preventDefault();
        if (state.recognition) state.recognition.stop();
    };

    // ── History ────────────────────────────────────────────────────────────────
    function loadHistory() {
        var list = document.getElementById('history-list');
        list.innerHTML = '<div class="loading"><span>Lade Termine</span><span class="loading-dots"></span></div>';
        api('/events/history').then(function (data) {
            list.innerHTML = '';
            var events = data.events || [];
            if (!events.length) {
                list.innerHTML = '<div style="color:var(--muted);padding:40px;text-align:center;">Noch keine Termine eingetragen.</div>';
                return;
            }
            events.forEach(function (ev) {
                var item = document.createElement('div');
                item.className = 'history-item';
                var left = document.createElement('div');
                var t = document.createElement('div');
                t.className = 'history-title';
                t.textContent = ev.title || 'Termin';
                left.appendChild(t);
                if (ev.location) {
                    var l = document.createElement('div');
                    l.className = 'history-date';
                    l.textContent = '📍 ' + ev.location;
                    left.appendChild(l);
                }
                var right = document.createElement('div');
                right.style.textAlign = 'right';
                var dateEl = document.createElement('div');
                dateEl.className = 'history-date';
                dateEl.textContent = ev.event_date || '';
                right.appendChild(dateEl);
                if (ev.event_time) {
                    var timeEl = document.createElement('div');
                    timeEl.className = 'history-date';
                    timeEl.textContent = ev.event_time + ' Uhr';
                    right.appendChild(timeEl);
                }
                item.appendChild(left);
                item.appendChild(right);
                list.appendChild(item);
            });
        }).catch(function () {
            list.innerHTML = '<div style="color:var(--muted);padding:16px;">Fehler beim Laden.</div>';
        });
    }

    // ── Profile ────────────────────────────────────────────────────────────────
    function loadProfile() {
        if (!state.user) return;
        api('/user/profile').then(function (data) {
            state.user = data;
            updateCreditsDisplay();
            document.getElementById('profile-email').textContent = data.email || '';
            var remaining = (data.events_limit || 100) - (data.events_count || 0);
            document.getElementById('profile-credits').textContent = remaining + ' von ' + (data.events_limit || 100);
            document.getElementById('profile-events').textContent = data.events_count || 0;
        }).catch(function () {
            document.getElementById('profile-email').textContent = state.user.email || '';
        });
    }

    // ── Boot ───────────────────────────────────────────────────────────────────
    checkSession();

}());
