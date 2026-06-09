(function () {
    'use strict';

    var API = 'https://mail.flomily.de/api/pwa';

    // ── State ──────────────────────────────────────────────────────────────────
    var state = {
        user: null,          // { email, username, credits, events_this_month }
        pendingEvents: [],   // events awaiting confirm/discard
        mediaRec: null,      // MediaRecorder instance
        recognition: null,   // SpeechRecognition instance
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
        c.scrollTop = c.scrollHeight;
    }

    function fmtDate(iso) {
        if (!iso) return '';
        try {
            var d = new Date(iso);
            return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch (e) { return iso; }
    }

    function fmtTime(iso) {
        if (!iso) return '';
        try {
            var d = new Date(iso);
            return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        } catch (e) { return iso; }
    }

    // ── Auth ───────────────────────────────────────────────────────────────────
    function checkSession() {
        api('/me').then(function (data) {
            state.user = data;
            onLoggedIn();
        }).catch(function () {
            // Check for magic-link token in URL
            var params = new URLSearchParams(window.location.search);
            var token = params.get('token');
            if (token) {
                api('/auth/verify', { method: 'POST', body: { token: token } }).then(function (data) {
                    state.user = data;
                    // Clean URL
                    history.replaceState({}, '', '/app/');
                    onLoggedIn();
                }).catch(function (err) {
                    showScreen('login');
                    addBotMsg('Login-Link ungültig oder abgelaufen. Bitte neu anmelden.');
                });
            } else {
                showScreen('login');
            }
        });
    }

    window.doLogin = function () {
        var email = document.getElementById('login-email').value.trim();
        if (!email) return;
        api('/auth/login', { method: 'POST', body: { email: email } }).then(function () {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('login-sent').style.display = 'block';
        }).catch(function (err) {
            alert('Fehler: ' + err.message);
        });
    };

    window.doLogout = function () {
        api('/auth/logout', { method: 'POST' }).catch(function () {}).finally(function () {
            state.user = null;
            state.pendingEvents = [];
            document.getElementById('chat-messages').innerHTML = '';
            showScreen('login');
        });
    };

    function onLoggedIn() {
        updateCreditsDisplay();
        showScreen('chat');
        if (!document.getElementById('chat-messages').children.length) {
            addBotMsg('Hallo ' + (state.user.username || state.user.email.split('@')[0]) + '! 👋\nSchick mir einfach einen Termin – als Text, Foto oder Sprachnachricht.');
        }
        registerSW();
    }

    // ── Service Worker ─────────────────────────────────────────────────────────
    function registerSW() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/app/sw.js').catch(function (e) {
                console.warn('SW registration failed', e);
            });
        }
    }

    // ── Screen navigation ──────────────────────────────────────────────────────
    window.showScreen = function (name) {
        document.querySelectorAll('.screen').forEach(function (s) { s.classList.remove('active'); });
        document.getElementById('screen-' + name).classList.add('active');
        if (name === 'history') loadHistory();
        if (name === 'profile') loadProfile();
    };

    // ── Credits display ────────────────────────────────────────────────────────
    function updateCreditsDisplay() {
        if (!state.user) return;
        var el = document.getElementById('credits-display');
        if (el) el.textContent = state.user.credits !== undefined ? state.user.credits + ' Credits' : '';
    }

    // ── Chat messages ──────────────────────────────────────────────────────────
    function addUserMsg(text) {
        var div = document.createElement('div');
        div.className = 'msg msg-user';
        div.textContent = text;
        document.getElementById('chat-messages').appendChild(div);
        scrollBottom();
        return div;
    }

    function addBotMsg(text) {
        var div = document.createElement('div');
        div.className = 'msg msg-bot';
        div.textContent = text;
        document.getElementById('chat-messages').appendChild(div);
        scrollBottom();
        return div;
    }

    function addLoading() {
        var div = document.createElement('div');
        div.className = 'loading';
        div.innerHTML = '<span>flomily denkt nach</span><span class="loading-dots"></span>';
        div.id = 'loading-indicator';
        document.getElementById('chat-messages').appendChild(div);
        scrollBottom();
        return div;
    }

    function removeLoading() {
        var el = document.getElementById('loading-indicator');
        if (el) el.remove();
    }

    // ── Event cards ────────────────────────────────────────────────────────────
    function renderEventCard(ev, index) {
        var card = document.createElement('div');
        card.className = 'event-card';
        card.dataset.index = index;

        var title = document.createElement('h3');
        title.textContent = ev.title || 'Termin';
        card.appendChild(title);

        if (ev.start) {
            var dateMeta = document.createElement('div');
            dateMeta.className = 'meta';
            dateMeta.textContent = '📅 ' + fmtDate(ev.start) + (ev.end && ev.start !== ev.end ? ' – ' + fmtDate(ev.end) : '') +
                (fmtTime(ev.start) ? '  ' + fmtTime(ev.start) : '');
            card.appendChild(dateMeta);
        }

        if (ev.location) {
            var locMeta = document.createElement('div');
            locMeta.className = 'meta';
            locMeta.textContent = '📍 ' + ev.location;
            card.appendChild(locMeta);
        }

        if (ev.description) {
            var descMeta = document.createElement('div');
            descMeta.className = 'meta';
            descMeta.textContent = ev.description;
            card.appendChild(descMeta);
        }

        var actions = document.createElement('div');
        actions.className = 'actions';

        var btnConfirm = document.createElement('button');
        btnConfirm.className = 'btn-confirm';
        btnConfirm.textContent = 'Eintragen';
        btnConfirm.onclick = function () { confirmEvent(index, card); };

        var btnDiscard = document.createElement('button');
        btnDiscard.className = 'btn-discard';
        btnDiscard.textContent = 'Ignorieren';
        btnDiscard.onclick = function () { discardEvent(index, card); };

        actions.appendChild(btnConfirm);
        actions.appendChild(btnDiscard);
        card.appendChild(actions);

        document.getElementById('chat-messages').appendChild(card);
        scrollBottom();
        return card;
    }

    function renderEventCards(events) {
        state.pendingEvents = events.slice();
        events.forEach(function (ev, i) { renderEventCard(ev, i); });

        if (events.length > 1) {
            var batch = document.createElement('div');
            batch.className = 'batch-actions';
            batch.id = 'batch-actions';

            var btnAll = document.createElement('button');
            btnAll.className = 'btn-batch';
            btnAll.textContent = 'Alle eintragen';
            btnAll.onclick = confirmAllEvents;

            var btnNone = document.createElement('button');
            btnNone.className = 'btn-batch';
            btnNone.style.background = 'none';
            btnNone.style.border = '1px solid var(--border)';
            btnNone.style.color = 'var(--muted)';
            btnNone.textContent = 'Alle ignorieren';
            btnNone.onclick = discardAllEvents;

            batch.appendChild(btnAll);
            batch.appendChild(btnNone);
            document.getElementById('chat-messages').appendChild(batch);
            scrollBottom();
        }
    }

    function confirmEvent(index, card) {
        var ev = state.pendingEvents[index];
        if (!ev) return;
        api('/events/confirm', { method: 'POST', body: ev }).then(function (data) {
            card.classList.add('confirmed');
            if (data.credits !== undefined) {
                state.user.credits = data.credits;
                updateCreditsDisplay();
            }
            removeBatchIfDone();
        }).catch(function (err) {
            addBotMsg('Fehler beim Eintragen: ' + err.message);
        });
        state.pendingEvents[index] = null;
    }

    function discardEvent(index, card) {
        card.classList.add('confirmed');
        card.querySelector('.actions').style.display = 'none';
        // override ::after for discard
        var discardNote = document.createElement('div');
        discardNote.style.marginTop = '8px';
        discardNote.style.color = 'var(--muted)';
        discardNote.style.fontSize = '0.85rem';
        discardNote.textContent = '✗ Ignoriert';
        card.appendChild(discardNote);
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
        var cards = document.querySelectorAll('.event-card');
        state.pendingEvents.forEach(function (ev, i) {
            if (ev) confirmEvent(i, cards[i]);
        });
    }

    function discardAllEvents() {
        var cards = document.querySelectorAll('.event-card');
        state.pendingEvents.forEach(function (ev, i) {
            if (ev) discardEvent(i, cards[i]);
        });
    }

    // ── Send text message ──────────────────────────────────────────────────────
    window.sendMessage = function () {
        var input = document.getElementById('chat-input');
        var text = input.value.trim();
        if (!text) return;
        input.value = '';
        addUserMsg(text);
        var loading = addLoading();
        api('/chat', { method: 'POST', body: { text: text } }).then(function (data) {
            removeLoading();
            if (data.reply) addBotMsg(data.reply);
            if (data.events && data.events.length) {
                renderEventCards(data.events);
            }
            if (data.credits !== undefined && state.user) {
                state.user.credits = data.credits;
                updateCreditsDisplay();
            }
        }).catch(function (err) {
            removeLoading();
            addBotMsg('Fehler: ' + err.message);
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
        var loading = addLoading();
        var fd = new FormData();
        fd.append('photo', file);
        api('/chat/photo', { method: 'POST', body: fd }).then(function (data) {
            removeLoading();
            if (data.reply) addBotMsg(data.reply);
            if (data.events && data.events.length) {
                renderEventCards(data.events);
            }
            if (data.credits !== undefined && state.user) {
                state.user.credits = data.credits;
                updateCreditsDisplay();
            }
        }).catch(function (err) {
            removeLoading();
            addBotMsg('Fehler beim Verarbeiten des Fotos: ' + err.message);
        });
        // Reset so same file can be selected again
        input.value = '';
    };

    // ── Voice (Web Speech API) ─────────────────────────────────────────────────
    window.startMic = function (e) {
        if (e) e.preventDefault();
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            addBotMsg('Spracherkennung wird von diesem Browser nicht unterstützt.');
            return;
        }
        if (state.isRecording) return;
        state.isRecording = true;
        var btn = document.getElementById('btn-mic');
        btn.classList.add('recording');

        var rec = new SpeechRecognition();
        rec.lang = 'de-DE';
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        state.recognition = rec;

        rec.onresult = function (event) {
            var transcript = event.results[0][0].transcript;
            document.getElementById('chat-input').value = transcript;
        };

        rec.onerror = function (event) {
            console.warn('Speech recognition error', event.error);
        };

        rec.onend = function () {
            state.isRecording = false;
            btn.classList.remove('recording');
            state.recognition = null;
            // Auto-send if we got a result
            var val = document.getElementById('chat-input').value.trim();
            if (val) window.sendMessage();
        };

        rec.start();
    };

    window.stopMic = function (e) {
        if (e) e.preventDefault();
        if (state.recognition) {
            state.recognition.stop();
        }
    };

    // ── History ────────────────────────────────────────────────────────────────
    function loadHistory() {
        var list = document.getElementById('history-list');
        list.innerHTML = '<div class="loading"><span>Lade Termine</span><span class="loading-dots"></span></div>';
        api('/events').then(function (data) {
            list.innerHTML = '';
            var events = data.events || [];
            if (!events.length) {
                list.innerHTML = '<div style="color:var(--muted);padding:16px 0;">Noch keine Termine eingetragen.</div>';
                return;
            }
            events.forEach(function (ev) {
                var item = document.createElement('div');
                item.className = 'history-item';

                var left = document.createElement('div');
                var titleEl = document.createElement('div');
                titleEl.className = 'history-title';
                titleEl.textContent = ev.title || 'Termin';
                left.appendChild(titleEl);

                if (ev.location) {
                    var locEl = document.createElement('div');
                    locEl.style.fontSize = '0.82rem';
                    locEl.style.color = 'var(--muted)';
                    locEl.textContent = ev.location;
                    left.appendChild(locEl);
                }

                var right = document.createElement('div');
                right.style.textAlign = 'right';
                var dateEl = document.createElement('div');
                dateEl.className = 'history-date';
                dateEl.textContent = fmtDate(ev.start);
                right.appendChild(dateEl);
                if (fmtTime(ev.start)) {
                    var timeEl = document.createElement('div');
                    timeEl.className = 'history-date';
                    timeEl.textContent = fmtTime(ev.start);
                    right.appendChild(timeEl);
                }

                item.appendChild(left);
                item.appendChild(right);
                list.appendChild(item);
            });
        }).catch(function (err) {
            list.innerHTML = '<div style="color:var(--muted);padding:16px 0;">Fehler beim Laden: ' + err.message + '</div>';
        });
    }

    // ── Profile ────────────────────────────────────────────────────────────────
    function loadProfile() {
        if (!state.user) return;
        api('/me').then(function (data) {
            state.user = data;
            updateCreditsDisplay();
            document.getElementById('profile-email').textContent = data.email || '';
            document.getElementById('profile-credits').textContent = (data.credits !== undefined ? data.credits : '–') + ' Credits';
            document.getElementById('profile-events').textContent = (data.events_this_month !== undefined ? data.events_this_month : '–');
        }).catch(function () {
            document.getElementById('profile-email').textContent = state.user.email || '';
        });
    }

    // ── Sports catalog (quick shortcuts) ──────────────────────────────────────
    // Reserved for future quick-add sports-event templates (Phase 2)
    // var SPORTS = [ ... ];

    // ── Boot ───────────────────────────────────────────────────────────────────
    checkSession();

}());
