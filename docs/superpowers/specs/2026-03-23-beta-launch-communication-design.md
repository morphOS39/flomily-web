# Beta-Launch-Kommunikation — Design Spec

> **ERSETZT** durch `family-hub/docs/superpowers/specs/2026-03-24-beta-go-to-market-design.md` (kombinierte Spec)

## Kontext

Flomily hat 15 Family-&-Friends-Kontakte, die die Landing Page gesehen und positives Feedback gegeben haben (3 davon bereits auf der Waitlist). Alle 15 werden Beta-Tester. Ziel ist ein kontrollierter, zweistufiger Launch: erst den inneren Kreis (15 Tester, Phase A), dann Ausweitung auf 20-30 durch Empfehlungen (Phase B).

## Strategie: 3-Stufen-Funnel + Phase B

### Uebersicht

| Stufe | Ziel | Timing | Kanaele |
|-------|------|--------|---------|
| 1: Teaser | Neugier wecken | ~1 Woche vor Beta-Start | Persoenlich (WhatsApp) + E-Mail |
| 2: Sneak Peek | Vorfreude steigern | 3-5 Tage nach Stufe 1 | Persoenlich + E-Mail + Beta-Seite |
| 3: Go | Beta starten | 2-3 Tage nach Stufe 2 | Persoenlich + E-Mail (mit Code) + Telegram-Bot |
| Phase B | Ausweiten auf 20-30 | 2-3 Wochen nach Beta-Start | Empfehlungen + Einladungscodes |

### Kanaele

- **Persoenlich (WhatsApp/direkt):** Ward schreibt den 15 einzeln oder in Kleingruppen
- **E-Mail:** Offizielle Flomily-Nachrichten via Resend (flomily.de Domain). Ward hat E-Mail-Adressen der 15 aus persoenlichem Kontakt (nicht nur Waitlist).
- **Telegram:** Erst ab Stufe 3 nutzbar — User muessen zuerst einen Chat mit dem Bot starten. In Stufe 1+2 kein Telegram-Kanal.
- **Beta-Seite:** `flomily.de/beta` — zentrale Anlaufstelle, wird mit jeder Stufe aktualisiert

---

## Stufe 1: Teaser ("Es passiert was")

**Timing:** ~1 Woche vor Beta-Start

### Persoenlich (WhatsApp/direkt)
- Ward schreibt den 15 einzeln oder in Kleingruppen
- Ton: beilaeufig, persoenlich — "Hey, erinnerst du dich an Flomily? Da tut sich was..."

### Flomily offiziell (E-Mail)
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

### Flomily offiziell (E-Mail)
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
- Tester schicken den Link zu `flomily.de/beta` an ihre Kontakte

### Onboarding neue Tester
- Interessierte melden sich ueber Formular auf `flomily.de/beta` an (Name + E-Mail)
- Formular via Formspree (gleicher Anbieter wie Waitlist auf Landing Page)
- Ward generiert den individuellen Aktivierungscode und schickt die Einladungsmail via Resend

---

## Rechtliches & Datenschutz

Referenz: family-hub Issue #90. Alles in diesem Abschnitt muss **vor Stufe 1** (Teaser) bzw. **vor Stufe 3** (Go) erledigt sein — siehe Checkliste am Ende.

### 1. Impressum (TMG §5) — vor Stufe 1

Gesetzliche Pflicht fuer jede kommerzielle deutsche Webpraesenz.

- **Wo:** `flomily.de/impressum` (eigene Seite oder Abschnitt im Footer)
- **Betreiber:** Privatperson / Einzelunternehmer (keine Firma noetig)
- **Inhalt Beta-Phase:** Name (Marc Schlipphak), E-Mail (info@flomily.de) — Minimalversion fuer geschlossene F&F-Beta
- **Spaeter (Public Launch):** Vollstaendiges Impressum mit ladungsfaehiger Anschrift nachrüsten (Impressums-Service oder Privatadresse). Pflicht sobald oeffentlich zugaenglich.
- **Auch auf:** Beta-Seite (`flomily.de/beta`) und in jeder E-Mail (Footer)
- **Bereits geplant:** flomily-web Issue #2

### 2. Datenschutzerklaerung (DSGVO Art. 13/14) — vor Stufe 1

Muss verfuegbar sein, BEVOR personenbezogene Daten verarbeitet werden (d.h. vor der ersten E-Mail).

**Wo:** `flomily.de/datenschutz`

**Inhalt (Mindestanforderungen):**

a) **Verantwortlicher:** Marc Schlipphak, info@flomily.de (Privatperson/Einzelunternehmer, Anschrift wird bei Public Launch ergaenzt)

b) **Welche Daten werden verarbeitet:**
   - Waitlist/Formular: Name, E-Mail-Adresse
   - Telegram-Bot: Telegram-ID, Telegram-Username, Nachrichteninhalte (Text, Fotos, Dokumente)
   - ICS-Empfaenger: Name, E-Mail-Adresse
   - Website: IP-Adresse, Browser-Daten (via Cloudflare)

c) **Zweck und Rechtsgrundlage:**
   - Waitlist-Anmeldung: Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)
   - Termin-Erstellung und ICS-Versand: Vertragsdurchfuehrung (Art. 6 Abs. 1 lit. b)
   - Beta-Einladungs-E-Mails an F&F: Berechtigtes Interesse (Art. 6 Abs. 1 lit. f) — persoenliche Einladung, kein Massen-Marketing
   - KI-Verarbeitung: Einwilligung (Art. 6 Abs. 1 lit. a) — gesonderte Einwilligung noetig

d) **KI-Verarbeitung / Anthropic-Disclosure (WICHTIG):**
   - Nachrichten werden an die Claude API (Anthropic, USA) gesendet zur Termin-Erkennung
   - Anthropic ist Auftragsverarbeiter (Data Processor)
   - Internationale Datenuebermittlung in die USA auf Basis von Standard Contractual Clauses (SCCs)
   - Anthropic DPA: Ward muss Anthropic's Data Processing Agreement akzeptieren/unterzeichnen
   - Klarer Hinweis: "Deine Nachrichten werden von einer kuenstlichen Intelligenz (Claude, Anthropic) verarbeitet, um Termine zu erkennen. Die Verarbeitung erfolgt auf Servern in den USA."

e) **Auftragsverarbeiter (alle auflisten):**
   | Dienst | Anbieter | Zweck | Standort |
   |--------|----------|-------|----------|
   | Claude API | Anthropic, USA | KI-Termin-Erkennung | USA |
   | Resend | Resend Inc., USA | Transaktionaler E-Mail-Versand | USA |
   | Cloudflare | Cloudflare Inc., USA | Website-Hosting, DNS, CDN | Global |
   | Formspree | Formspree Inc., USA | Formular-Verarbeitung (Waitlist, Phase B) | USA |
   | Telegram | Telegram FZ-LLC, Dubai | Bot-Kommunikation | Global |

f) **Speicherdauer:**
   - Account-Daten: Solange Account aktiv, danach Loeschung innerhalb 30 Tagen
   - Nachrichteninhalte: Werden nach Termin-Erkennung nicht dauerhaft gespeichert (Beta v1: keine Termin-Speicherung)
   - Termin-Speicherung (kuenftig): Siehe gesonderte Einwilligung bei Onboarding
   - E-Mail-Adressen (Waitlist): Bis Widerruf

g) **Betroffenenrechte:**
   - Auskunft, Berichtigung, Loeschung, Einschraenkung, Datenportabilitaet, Widerspruch
   - Beschwerderecht bei Aufsichtsbehoerde (LfDI Baden-Wuerttemberg)
   - Kontakt: info@flomily.de

### Bekannte Limitationen (Beta)

- **1 Telegram-Account = 1 flomily-Account = 1 Familie.** Die Telegram-ID ist der eindeutige Identifier. Ein User kann nicht in mehreren Familien gleichzeitig sein (z.B. Patchwork). Wenn ein bereits aktivierter User einen zweiten Code eingibt, wird dieser abgelehnt ("Du bist bereits aktiviert"). Der Code bleibt fuer jemand anderen gueltig. Multi-Family-Support ist ein spaeteres Feature (family-hub #129).

### 3. Beta-Nutzungsbedingungen — vor Stufe 3

Keine vollstaendigen AGB, aber eine leichtgewichtige Vereinbarung fuer die Beta-Phase.

**Wo:** `flomily.de/beta/nutzungsbedingungen` (oder Abschnitt auf Beta-Seite)

**Inhalt:**
- Beta = Testversion, keine Garantie auf Verfuegbarkeit oder Fehlerfreiheit
- Service kann jederzeit eingestellt werden
- **Keine Haftung fuer verpasste, falsche oder doppelte Termine** (vgl. flomily-web#7)
- Termine werden als ICS-Datei verschickt — die Verantwortung fuer den Kalender liegt beim Empfaenger
- Feedback darf anonymisiert zur Produktverbesserung verwendet werden
- flomily behaelt sich vor, Beta-Zugang bei Missbrauch zu sperren

### 4. Einwilligungen (Consent) — im Onboarding-Flow

Zentral: An welcher Stelle im Prozess wird welche Einwilligung eingeholt?

| Zeitpunkt | Einwilligung | Wie |
|-----------|-------------|-----|
| **Stufe 3: Go-E-Mail** | Hinweis auf Datenschutz + Nutzungsbedingungen | Link in der E-Mail: "Mit der Aktivierung stimmst du den [Nutzungsbedingungen] und der [Datenschutzerklaerung] zu." |
| **Bot: /start + Code-Eingabe** | Explizite Zustimmung zu: (1) KI-Verarbeitung von Nachrichten, (2) ICS-Versand an angegebene E-Mail-Adressen, (3) kuenftige Termin-Speicherung | Bot zeigt Consent-Text, User muss mit Button bestaetigen bevor Aktivierung abgeschlossen wird |
| **Bot: E-Mail-Adresse hinzufuegen** | Hinweis: "Stelle sicher, dass diese Person einverstanden ist, Termin-Mails von flomily zu erhalten." | Bot-Nachricht bei `/add`-Befehl. Optional: Bestaetigungs-Mail an den Empfaenger |
| **Phase B: Anmeldeformular** | DSGVO-Einwilligungs-Checkbox | Auf dem Formular: "Ich stimme der [Datenschutzerklaerung] zu" |

#### Consent-Text im Bot (bei Aktivierung)

Der Bot zeigt bei Code-Eingabe folgenden Text (oder sinngemäß):

> "Bevor es losgeht, ein paar wichtige Infos:
>
> - Deine Nachrichten werden von einer KI (Claude, Anthropic) verarbeitet, um Termine zu erkennen. Die Verarbeitung erfolgt auf Servern in den USA.
> - Erkannte Termine werden als Kalendereinladung (ICS) per E-Mail verschickt.
> - Wir speichern deine Termine kuenftig auch in flomily, damit du sie spaeter abrufen, durchsuchen und verwalten kannst. Du kannst dem jederzeit widersprechen.
> - Alle Details: [Datenschutzerklaerung] | [Nutzungsbedingungen]
>
> Mit 'Einverstanden' stimmst du zu und aktivierst deinen Zugang."
>
> [Einverstanden] [Abbrechen]

**Wichtig:** Die Einwilligung zur kuenftigen Termin-Speicherung wird hier proaktiv eingeholt, obwohl Beta v1 noch keine Termine speichert. So ist die Rechtsgrundlage fuer Folgephasen bereits vorhanden.

### 5. Opt-In fuer ICS-Empfaenger — im Bot-Flow

Wenn ein Admin eine E-Mail-Adresse eines Familienmitglieds hinzufuegt, erhaelt diese Person unaufgefordert ICS-Mails. Das ist datenschutzrechtlich kritisch.

**Loesung (gestuft):**

a) **Beta (pragmatisch):** Bot weist den Admin darauf hin, dass er die Person vorher fragen muss:
   > "Ich werde Termin-Einladungen an diese Adresse schicken. Bitte stelle sicher, dass [Name] damit einverstanden ist."

b) **Spaeter (robust):** Bestaetigungs-Mail an den Empfaenger (Double-Opt-In):
   > "Hallo [Name], [Admin] moechte dir Familientermine ueber flomily schicken. Bist du einverstanden? [Ja, Termine empfangen] [Nein danke]"

### 6. Opt-Out — in jeder E-Mail + Bot

Jeder muss jederzeit aussteigen koennen.

- **ICS-Empfaenger:** Jede ICS-Mail enthaelt einen Unsubscribe-Link im Footer: "Du moechtest keine Termine mehr erhalten? [Abmelden]"
- **Bot-Mitglieder:** `/stop`-Befehl im Telegram-Bot deaktiviert den Account
- **Admin:** Kann Empfaenger ueber `/remove` entfernen
- **Datenloeschung:** Auf Anfrage per E-Mail (info@flomily.de) — in Beta manuell, spaeter automatisiert

### 7. E-Mail-Compliance — in allen E-Mails

Jede E-Mail (Teaser, Sneak Peek, Go, ICS) muss enthalten:
- Absender: flomily / info@flomily.de (bzw. kalender@flomily.de fuer ICS)
- Impressum (oder Link darauf) im Footer
- Unsubscribe-Moeglichkeit (Link oder Hinweis)
- Datenschutz-Link

### 8. Minderjährigenschutz

Falls Kinder den Bot nutzen (z.B. Kalender lesen ueber Dashboard):
- Unter 16 Jahren: Einwilligung der Erziehungsberechtigten erforderlich (DSGVO Art. 8)
- Fuer Beta: Kein Problem, da Eltern die Admins sind und Kinder keinen eigenen Bot-Zugang haben
- Spaeter (Dashboard, Kinder-Lesezeitung): Elterliche Zustimmung im Onboarding einbauen

### 9. Auftragsverarbeitungsvertraege (AVVs)

Ward muss mit allen Auftragsverarbeitern Vertraege haben (DSGVO Art. 28):

| Dienst | AVV/DPA vorhanden? | Aktion |
|--------|---------------------|--------|
| Anthropic | Ja (DPA auf Website) | Ward muss akzeptieren |
| Resend | Ja (DPA auf Website) | Bei Account-Erstellung akzeptieren |
| Cloudflare | Ja (DPA im Dashboard) | Pruefen ob bereits akzeptiert |
| Formspree | Ja (DPA auf Website) | Pruefen/akzeptieren |
| Telegram | Kein klassischer AVV | Telegram ist Plattform, kein Auftragsverarbeiter — in Datenschutzerklaerung erwaehnen |

### 10. Verzeichnis der Verarbeitungstaetigkeiten (DSGVO Art. 30)

Pflicht fuer jeden Verantwortlichen. Internes Dokument (nicht oeffentlich), aber muss existieren.

**Empfehlung:** Einfache Tabelle im Repo (`docs/legal/verarbeitungsverzeichnis.md`):

| Taetigkeit | Betroffene | Daten | Rechtsgrundlage | Speicherdauer | Empfaenger |
|------------|-----------|-------|-----------------|---------------|------------|
| Waitlist | Interessenten | Name, E-Mail | Einwilligung | Bis Widerruf | Formspree, Resend |
| Termin-Erkennung | Bot-Nutzer | Nachrichten, Telegram-ID | Einwilligung | Verarbeitungsdauer | Anthropic |
| ICS-Versand | Familienmitglieder | Name, E-Mail, Termindaten | Vertrag | Account-Dauer | Resend |
| Website | Besucher | IP, Browser-Daten | Berechtigtes Interesse | Cloudflare-Standard | Cloudflare |

---

### Rechtliche Checkliste (nach Stufe)

| Was | Wann fertig | Wo |
|-----|-------------|-----|
| Impressum | Vor Stufe 1 | flomily.de + Footer aller E-Mails |
| Datenschutzerklaerung | Vor Stufe 1 | flomily.de/datenschutz |
| Anthropic DPA akzeptieren | Vor Stufe 3 | Anthropic Dashboard |
| Resend DPA akzeptieren | Vor Stufe 1 | Bei Account-Erstellung |
| Cloudflare DPA pruefen | Vor Stufe 1 | Cloudflare Dashboard |
| Formspree DPA pruefen | Vor Phase B | Formspree Dashboard |
| Beta-Nutzungsbedingungen | Vor Stufe 3 | flomily.de/beta/nutzungsbedingungen |
| Consent-Flow im Bot | Vor Stufe 3 | Bot-Code (family-hub Repo) |
| Unsubscribe in ICS-Mails | Vor Stufe 3 | E-Mail-Template (family-hub Repo) |
| ICS-Empfaenger Opt-In Hinweis | Vor Stufe 3 | Bot-Code (family-hub Repo) |
| Verarbeitungsverzeichnis | Vor Stufe 3 | docs/legal/ (internes Dokument) |

---

## Implementierungs-Scope (flomily-web)

Was muss auf der Webseite gebaut/geaendert werden:

1. **Neue Seite: `beta.html`** (erreichbar unter `flomily.de/beta`)
   - 3 Zustaende (Teaser → Sneak Peek → Go), manuell umschaltbar per Deploy (kein JS-Datumslogik)
   - Responsive, gleiches Design wie Landing Page
2. **E-Mail-Templates** (3 Stueck: Teaser, Sneak Peek, Go-mit-Code)
   - Koennen als HTML-Dateien im Repo liegen oder als Markdown-Vorlagen
3. **Telegram-Nachricht** (1 Stueck: Willkommen-nach-Aktivierung — wird im Bot-Code definiert, nicht in flomily-web)
4. **Phase-B-Erweiterung der Beta-Seite:** Anmeldeformular (Name + E-Mail) via Formspree

### Ausserhalb Scope (flomily-web)
- Code-Generierung und -Validierung im Telegram-Bot (family-hub Repo, Issue TBD)
- E-Mail-Versand via Resend (family-hub Repo oder separates Script, Issue TBD)
- Telegram-Bot-Onboarding-Flow inkl. Willkommensnachricht (family-hub Repo)

### Abhaengigkeiten und Voraussetzungen

| Stufe | Voraussetzung |
|-------|---------------|
| 1 | Resend-Account eingerichtet, Beta-Seite deployed, E-Mail-Template fertig, **Impressum + Datenschutzerklaerung online**, Resend/Cloudflare DPAs akzeptiert |
| 2 | Bot funktioniert im Test (fuer Screenshots/Screenrecording) |
| 3 | Code-Generierung implementiert, Bot-Aktivierung per Code funktioniert, Einladungsmail-Template fertig, **Consent-Flow im Bot implementiert**, **Beta-Nutzungsbedingungen online**, **Anthropic DPA akzeptiert**, **Unsubscribe in ICS-Mails**, **Verarbeitungsverzeichnis erstellt** |
| Phase B | Formular auf Beta-Seite mit DSGVO-Checkbox, Formspree DPA akzeptiert, mindestens 10 von 15 haben aktiviert |

### Hinweis zu GMX
E-Mail-Versand laeuft NICHT ueber GMX, sondern ueber Resend (transaktional, flomily.de Domain). GMX-Sendelimit ist damit kein Problem.
