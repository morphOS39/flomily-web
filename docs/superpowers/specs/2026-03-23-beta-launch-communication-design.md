# Beta-Launch-Kommunikation — Design Spec

## Kontext

Flomily hat 15 Family-&-Friends-Kontakte, die die Landing Page gesehen und positives Feedback gegeben haben (3 davon bereits auf der Waitlist). Alle 15 werden Beta-Tester. Ziel ist ein kontrollierter, zweistufiger Launch: erst den inneren Kreis (15 Tester, Phase A), dann Ausweitung auf 20-30 durch Empfehlungen (Phase B).

## Strategie: 3-Stufen-Funnel + Phase B

### Uebersicht

| Stufe | Ziel | Timing | Kanaele |
|-------|------|--------|---------|
| 1: Teaser | Neugier wecken | ~1 Woche vor Beta-Start | Persoenlich (WhatsApp) + E-Mail + Telegram |
| 2: Sneak Peek | Vorfreude steigern | 3-5 Tage nach Stufe 1 | Persoenlich + E-Mail + Telegram + Beta-Seite |
| 3: Go | Beta starten | 2-3 Tage nach Stufe 2 | Persoenlich + E-Mail (mit Code) + Telegram-Bot |
| Phase B | Ausweiten auf 20-30 | 2-3 Wochen nach Beta-Start | Empfehlungen + Einladungscodes |

### Kanaele

- **Persoenlich (WhatsApp/direkt):** Ward schreibt den 15 einzeln oder in Kleingruppen
- **E-Mail:** Offizielle Flomily-Nachrichten an die Kontakte (ueber Waitlist-Adressen bzw. direkt)
- **Telegram:** Offizielle Nachrichten ueber den Flomily-Kanal/Bot
- **Beta-Seite:** `flomily.de/beta` — zentrale Anlaufstelle, wird mit jeder Stufe aktualisiert

---

## Stufe 1: Teaser ("Es passiert was")

**Timing:** ~1 Woche vor Beta-Start

### Persoenlich (WhatsApp/direkt)
- Ward schreibt den 15 einzeln oder in Kleingruppen
- Ton: beilaeufig, persoenlich — "Hey, erinnerst du dich an Flomily? Da tut sich was..."

### Flomily offiziell (E-Mail + Telegram)
- Kurze Nachricht, maximal 5 Saetze
- Kernbotschaft: "Wir bauen etwas fuer euch. Ihr seid die Ersten."
- Kein konkretes Datum, kein Feature-Dump
- Link auf `flomily.de/beta`

### Beta-Seite (Stufe 1)
- Headline: "Etwas braut sich zusammen..."
- Kurzer Text: Ihr gehoert zu den Ersten
- Kein Anmeldeformular, kein Detail — nur Spannung

---

## Stufe 2: Sneak Peek ("Schaut mal was kommt")

**Timing:** 3-5 Tage nach Stufe 1

### Persoenlich (WhatsApp/direkt)
- "Schau mal, so wird das aussehen" — mit Link auf die Beta-Seite
- Optional: kurzes Screenrecording oder Screenshot vom echten Bot in Aktion

### Flomily offiziell (E-Mail + Telegram)
- Konkreter Einblick: 1-2 echte Beispiele (z.B. "WhatsApp-Nachricht rein → Termin im Kalender")
- Ton: "Das koennt ihr bald" — nicht "Das kann Flomily"
- Hinweis: "In wenigen Tagen geht's los — haltet euren Telegram bereit"
- Link auf aktualisierte Beta-Seite

### Beta-Seite (Stufe 2)
- Countdown konkreter (z.B. "Diese Woche")
- 2-3 animierte Beispiele oder Screenshots vom echten Flow
- Kurze Erklaerung: Was ist die Beta, was kann man erwarten
- Kein Anmeldeformular — die Einladung kommt persoenlich in Stufe 3

---

## Stufe 3: Go ("Los geht's")

**Timing:** 2-3 Tage nach Stufe 2

### Persoenlich (WhatsApp/direkt)
- "Es ist soweit! Schau in deine Mails — da ist dein persoenlicher Code"
- Hilft bei Fragen zum Onboarding

### Flomily offiziell (E-Mail)
- Persoenliche Einladungsmail an jeden einzeln
- Enthaelt: **individueller Aktivierungscode** fuer den Telegram-Bot
- Schritt-fuer-Schritt Onboarding:
  1. Telegram-Bot oeffnen
  2. Code eingeben
  3. Ersten Termin schicken
- Ton: "Du bist dabei. Hier ist dein Schluessel."
- Link auf aktualisierte Beta-Seite (mit Onboarding-Anleitung)

### Flomily offiziell (Telegram)
- Willkommensnachricht im Bot selbst nach Aktivierung mit Code
- Kein Code ueber Telegram — der kommt ausschliesslich per E-Mail (saubere Trennung)

### Beta-Seite (Stufe 3)
- "Die Beta ist live"
- Onboarding-Anleitung (mit Screenshots)
- FAQ: Was kann ich, was noch nicht, wie gebe ich Feedback
- Teilbar fuer Phase B: "Kennst du jemanden der das auch braucht?"

---

## Phase B: Ausweitung (20-30 Tester)

**Timing:** 2-3 Wochen nach Beta-Start

### Organisch
- Thomas (F11) und Hr. Bayer (F23) haben Weiterempfehlung angekuendigt — laufen lassen
- Beta-Seite ist teilbar, enthaelt ab Stufe 3 einen Hinweis: "Kennst du jemanden?"

### Aktiv nachhelfen (nach 2-3 Wochen)
- Persoenliche Nachricht an die aktivsten Beta-Tester: "Magst du jemanden einladen?"
- Jeder Beta-Tester bekommt 1-2 Einladungscodes zum Weitergeben
- Einladungscodes ueber gleichen Mechanismus wie Stufe 3 (individuelle Codes per E-Mail)

### Onboarding neue Tester
- Bestehende Beta-Tester schicken den Link zu `flomily.de/beta`
- Dort: kurzes Anmeldeformular (Name + E-Mail) — nur fuer Phase B sichtbar
- Ward generiert den Code und schickt die Einladungsmail

---

## Implementierungs-Scope (flomily-web)

Was muss auf der Webseite gebaut/geaendert werden:

1. **Neue Seite: `beta.html`** (erreichbar unter `flomily.de/beta`)
   - 3 Zustaende (Teaser → Sneak Peek → Go), manuell umschaltbar oder per Datum
   - Responsive, gleiches Design wie Landing Page
2. **E-Mail-Templates** (3 Stueck: Teaser, Sneak Peek, Go-mit-Code)
   - Koennen als HTML-Dateien im Repo liegen oder als Markdown-Vorlagen
3. **Telegram-Nachrichten** (3 Stueck: Teaser, Sneak Peek, Willkommen-nach-Aktivierung)
4. **Phase-B-Erweiterung der Beta-Seite:** Anmeldeformular (Name + E-Mail)

### Ausserhalb Scope (flomily-web)
- Code-Generierung und -Validierung im Telegram-Bot (family-hub Repo)
- E-Mail-Versand-Infrastruktur (Resend o.ae.)
- Telegram-Bot-Onboarding-Flow (family-hub Repo)
