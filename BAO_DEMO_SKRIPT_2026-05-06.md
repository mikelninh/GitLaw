# Bao-Demo — Skript für morgen, 2026-05-06

**Setup:** Browser auf `gitlaw-xi.vercel.app/#/bao` öffnen, ein zweites Tab mit `BAO_KI_DATENVERARBEITUNG_ANTWORT.md` für die fachliche Diskussion.

**Zeitziel:** ≤15 Minuten reine Demo, dann offen ins Gespräch.

---

## 1 · Demo-Akte in einem Klick (1 Min)

> *"Bao, du musst nichts eintippen. Ich hab eine Demo-Akte vorbereitet, die genau eurem Alltag entspricht — Phạm Văn Đức, Aufenthaltstitel-Verlängerung, halb gefüllte Checkliste."*

- Auf `/bao` → **„Demo-Akte anlegen"** klicken
- → Akten-Übersicht öffnet sich mit `AZ-2026-0042` ganz oben

**Was Bao hier sieht:** Mandantenname mit vietnamesischen Diakritika, 17 Tage Frist (Fiktionsbescheinigung), Behörde „Ausländerbehörde Berlin Mitte".

**Lastenheft-Bezug:** §1 + §3 (Aktenanlage), §6 (Mandantendaten).

---

## 2 · Mandatsart-Checkliste (3 Min)

> *"Das ist Modul A aus deinem Lastenheft — die elf Mandatsarten mit den Pflicht-Unterlagen pro Verfahren. Sprint 0 hat das Schema, Sprint 1 die UI."*

- Akte öffnen → Section **„Unterlagen-Checkliste"**
- Zeigen: 6 ✓ erhalten, 1 ⚠ Problem, 3 ⏳ ausstehend
- **Nur fehlende Pflicht-Unterlagen** togglen → Liste schrumpft
- Ein Item klicken → Status wechselt pending → received → problem

**Was Bao hier sieht:** Sofort erkennbar, was fehlt. Kein Excel-Geblätter mehr.

**Lastenheft-Bezug:** §4 (Unterlagenprüfung), §11 (Mandatsart-Logik).

---

## 3 · Status-Workflow (2 Min)

> *"Acht Stati, klar definierte Übergänge. Du kannst nicht versehentlich von „Antrag eingereicht" zurück zu „Unterlagen fehlen" springen — das verhindert die Übergangs-Regel."*

- Status-Dropdown öffnen → nur erlaubte Folge-Stati werden angezeigt
- Auf **„Antrag eingereicht"** wechseln (mit Datum)

**Lastenheft-Bezug:** §7 (Status-Modell), §8 (Workflow-Regeln).

---

## 4 · Sachstands-Generator DE+VI (4 Min) — der Kern

> *"Das ist der Punkt, wegen dem ich diese Funktion zuerst gebaut habe. Du klickst, kriegst zwei copy-paste-fertige Texte, einer auf Deutsch für deine Akte, einer auf Vietnamesisch für die Mandantschaft."*

- **„Sachstand generieren"**-Button klicken
- Drawer öffnet sich → links DE, rechts VI, beide mit dem konkreten Mandantennamen + Behörde + Aktenzeichen
- Empfänger-Toggle: **Mandant** ↔ **Mittelsperson** → Templates ändern sich entsprechend
- Copy DE → in echte E-Mail einfügen

**Wichtig zu sagen:** *„Die VI-Templates sind als TODO markiert — ich brauche dich für den Voice-Polish. Sie sind grammatikalisch korrekt, aber ob der Ton stimmt, weißt nur du."*

**Lastenheft-Bezug:** §9 (Sachstands-Mitteilung), §15 (Bilingualität), §17 (Mittelspersonen — vorbereitet, Modul folgt Sprint 4).

---

## 5 · Was kommt als Nächstes (2 Min)

> *"Sprint 1 läuft noch zwei Wochen. Was heute fehlt:"*

- **Modul C** — VI-Antworten in der Recherche (KI auf VI). Brauche dafür **5 deiner echten E-Mails** als Voice-Anchor.
- **Modul D** — Tasks pro Akte (Auto-Erinnerungen bei Status-Wechsel)
- **Sprint 2** — Auto-Versand der Sachstands-Antworten (E-Mail-Backend)
- **Sprint 4** — Mittelspersonen-Datenmodell (heute nur Templates vorbereitet)
- **OCR/Klassifikation** der Eingangs-PDFs — Sprint 3

> *"Was möchtest du in welcher Reihenfolge?"*

---

## Was ich von Bao morgen brauche

1. **Top-3 Mandatsarten bestätigen** — habe ich die richtigen Pflicht-Unterlagen pro Mandatsart? Reisepass-Kopie auch bei Familiennachzug-Kind?
2. **Voice-Anchor-Mails** — 5 echte (anonymisierte) Sachstands-Antworten von ihm, DE und/oder VI, damit ich seinen Stil in die KI-Templates backe
3. **Mittelsperson-Praxis** — wie häufig schreibt er an Familienmitglieder/Dolmetscher statt direkt an Mandanten? (Beeinflusst Sprint-4-Priorität)
4. **Behörden-Liste prüfen** — fehlen welche, die er häufig hat? (Datei: `viewer/src/pro/behoerden.ts`, 17 Berliner)
5. **5 Klärungsfragen** aus `BAO_KI_DATENVERARBEITUNG_ANTWORT.md` Anhang A durchgehen

---

## Wenn etwas live nicht funktioniert

- **Demo-Button macht nichts:** Hard-Refresh (Cmd-Shift-R), localStorage in DevTools → Application leeren, nochmal klicken
- **Diakritika kaputt:** sollte nicht passieren (UTF-8 durchgängig), wenn doch → Browser-Default-Encoding prüfen
- **Sachstands-Drawer leer:** Mandatsart muss gesetzt sein, Status muss gesetzt sein
- **Behörde fehlt:** in Akte rein, Behörden-Selector benutzen, dann Sachstand neu generieren

---

**Letzte Erinnerung an mich:** ruhig bleiben, Bao führt mit seinen Fragen, ich antworte mit der App.
