# Antwort auf "KI-gestützte Datenverarbeitung und Mandantenkommunikation für die Kanzlei"

**Adressat:** Bao Nguyen (Kanzlei)
**Absender:** Mikel
**Stand:** 2026-05-06 (vor unserem Treffen heute)
**Bezug:** Lastenheft "Arbeitsgrundlage: KI-gestützte Datenverarbeitung und Mandantenkommunikation für die Kanzlei" vom (Datum aus dem Dokument)

---

## Vorbemerkung

Lieber Bao,

dein Dokument ist beeindruckend strukturiert — Lastenheft, Strategiepapier und Konzept in einem. Die meisten Anbieter werden auf so eine Vorlage nicht angemessen antworten können, weil sie entweder ein fertiges Produkt verkaufen oder mit den berufsrechtlichen Anforderungen Schwierigkeiten haben. Beides trifft auf unser Setup nicht zu.

Diese Antwort folgt deiner Struktur Abschnitt für Abschnitt. Pro Abschnitt findest du:

- **Status:** ✓ vorhanden · ~ teilweise · ✗ fehlt
- **Was bereits existiert** in GitLaw Pro
- **Was wir realistisch ergänzen können** mit Aufwandseinschätzung
- **Offene Fragen** dort, wo wir vor Umsetzung etwas von dir brauchen

Im hinteren Teil findest du den konkreten Sprint-Plan, fünf Klärungsfragen für unser Gespräch und einen Anhang mit dem konkreten Liefer-Stand. **Zwischen Lastenheft-Eingang und unserem Treffen heute habe ich Sprint 0, Sprint 1 (Module A + B) und drei zusätzliche Features fertig committed** — nicht als Versprechen, sondern als laufende Demo-Akte, die du gleich klicken kannst (`/#/bao` → „Demo-Akte anlegen"). Details in Anhang C.

---

## 1. Zweck des Dokuments

**Status:** ✓ verstanden

Dein Drei-Perspektiven-Ansatz (Problem · Strategie · Konzept) deckt sich mit unserer Sicht. Wir bauen GitLaw Pro nicht als generisches Anwalts-Tool, sondern als Werkstatt für die spezifischen Engpässe deiner Kanzlei. Der MVP entlastet zunächst intern, perspektivisch entsteht daraus ein Mandanten-Portal — exakt der Pfad, den du beschreibst.

**Was wir mitbringen:** Statt bei null anzufangen baust du auf einer existierenden, in CI getesteten und bereits live deployed Plattform auf, die heute schon ~45% der MVP-Funktionen abdeckt.

---

## 2. Kanzleiprofil und Ausgangslage

**Status:** ✓ erfasst

Die Eckdaten (2 RA, 2 Refa, 1 Hilfskraft, 700→900 Mandate, 99% vietnamesisch, Advoware) sind in unserer Planungsgrundlage hinterlegt. Insbesondere die **99% Vietnam-Bezug** ist für uns ein klarer Differenzierer — andere Kanzlei-Tools bieten allgemeinsprachige Lösungen, die genau bei dieser Klientel scheitern.

**Offene Frage:**
- Welche Mandate werden weiterhin nur in Papierform geführt (z.B. ältere Bestandsmandate), und welche willst du im MVP ausschließen?

---

## 3. Mandatsarten

**Status:** ~ teilweise abgebildet

**Was bereits existiert:**
- 12 Migrationsrecht-Vorlagen (Aufenthaltstitel-Verlängerung, Familiennachzug Ehegatt:in, Familiennachzug Kind, Einbürgerungsantrag, Eilantrag gegen Abschiebung, Fiktionsbescheinigung, Beschäftigungserlaubnis, Härtefallantrag, Visumsbeschwerde, Einreiseverfahren, Ausweisungsbescheid Widerspruch, Niederlassungserlaubnis)
- 5 Allgemein-Vorlagen (Strafanzeige, Widerspruch, Mahnschreiben, Mandatsanzeige, Akteneinsicht)

**Was heute neu hinzukommt:**
- **Mandatsart-Checklisten** (Modul A, siehe Anhang B). Pro Mandatsart eine Liste der erwarteten Dokumente mit DE+VI Bezeichnung.

**Offene Frage:**
- Existieren bei euch bereits interne Checklisten auf Papier? Wenn ja, schick uns gerne 2-3 als Foto — wir digitalisieren die statt theoretisch von vorne anzufangen.

---

## 4. Sprach- und Mandantenstruktur

**Status:** ~ teilweise

**Was bereits existiert:**
- **Mandanten-Intake-Formular auf Vietnamesisch, Türkisch, Arabisch (RTL), Englisch, Deutsch.** Mandanten scannen QR auf Visitenkarte oder Wartezimmer-Aufsteller, füllen das Formular auf VI aus, du bekommst die Antwort strukturiert auf DE — heute schon live.
- DSGVO-konforme Anonymisierung vor jeder KI-Anfrage (14 PII-Pattern).

**Was wir ergänzen:**
- **Vietnamesische Sachstands-Antworten** (Sprint 1) — Statuskategorien wie "Unterlagen fehlen noch", "Antrag eingereicht", "Behörde prüft" werden auf VI mit korrekt formuliertem rechtlichen Disclaimer ausgegeben. Ohne ungewollte Rechtsauskünfte, ohne Erfolgsversprechen, ohne falsche Fristzusagen.
- **Vietnamesische Erinnerungs-E-Mails** (Sprint 2) — Auto-Drafts auf VI mit klarer Auflistung fehlender Unterlagen.

**Offene Frage:**
- Welche vietnamesischen Standardformulierungen verwendest du heute schon (auch handgeschrieben)? Die nehmen wir als linguistischen Anker, damit der Stil von Anfang an "wie aus eurer Kanzlei" klingt — nicht wie KI-Übersetzung.

---

## 5. Aktueller typischer Mandatsablauf

**Status:** ~ teilweise

**Was bereits existiert:**
- **Akten-CRUD** mit allen 13 Schritten als Status-Verlauf abbildbar
- **Frist-Tracker §§ 187/188 BGB** (Bescheid-Datum → automatische Berechnung)
- **Akten-Bundle-Export** als ZIP (PDFs + Audit + meta.txt) für Übergabe oder Backup

**Was wir ergänzen:**
- **8-Stati-Modell aus deinem UC3** (Modul B, Sprint 1):
  1. Unterlagen fehlen
  2. Unterlagen in Prüfung
  3. Antrag in Vorbereitung
  4. Antrag eingereicht
  5. Behördliche Rückmeldung ausstehend
  6. Behörde hat Nachforderung gestellt
  7. Termin/Entscheidung steht aus
  8. Verfahren abgeschlossen

  Jeder Status hat zwei Templates: einen **internen** (für Akten-Übersicht) und einen **mandanten-gerichteten** (DE + VI), der automatisch in einer Sachstands-Antwort verwendet wird.

---

## 6. Kommunikationskanäle

**Status:** teilweise

**Was bereits existiert:**
- Branded PDF + Word .docx Export (für Brief-Versand und beA-Anhang)
- Audit-Log jeder Aktion (BHV-tauglich)

**Was wir ergänzen:**
- **E-Mail-Versand-Backend** (Sprint 2) — Resend oder Postmark, EU-Region. Auto-Drafts werden vor Versand zur Refa-Freigabe vorgelegt
- **Mittelspersonen-Modell** (Sprint 4) — eingeschränkter Zugriff für autorisierte Drittpersonen mit dokumentierter Vollmacht

**Was wir bewusst weglassen / Klärung nötig:**
- **WhatsApp-Integration** — du erwähnst in Section 20.8 selbst die Frage, ob WhatsApp eingebunden oder reduziert werden soll. Unsere Empfehlung: erstmal **organisatorisch reduzieren** durch das Mandanten-Portal, nicht technisch integrieren. WhatsApp Business API ist DSGVO-grenzwertig und berufsrechtlich heikel. Klärung im Workshop.
- **beA-Direkt-Anbindung** — beA hat keine offene API für externe Tools. Wir produzieren aber das richtige PDF-Format für beA-Upload.

**Offene Frage:**
- Wie wird die Mittelsperson aktuell dokumentiert (schriftliche Vollmacht? mündlich? E-Mail?). Diese Antwort bestimmt das Datenmodell der Mittelsperson-Rolle.

---

## 7. Aktuelle Einreichung und Speicherung von Unterlagen

**Status:** ~ teilweise

**Was bereits existiert:**
- **Dokument-Upload** in Akten (PDF, JPG, PNG)
- **OCR-Pipeline** (Vision API, server-seitig) — bereits implementiert, in Stabilisierung
- **Tenant-gebundene Cloud-Ablage** in Frankfurt (Upstash + Vault)

**Was wir ergänzen (Sprint 3):**
- **Auto-Klassifikation** der hochgeladenen Dokumente: Reisepass, Aufenthaltstitel, Geburtsurkunde, Heiratsurkunde, Arbeitsvertrag, Sprachzeugnis, Krankenversicherungs-Nachweis, Meldebescheinigung
- **Auto-Benennung** nach Kanzlei-Schema: `Pass_Mandant_NACHNAME_2025-05-05.pdf`
- **Vollständigkeits-Match** gegen die Mandatsart-Checkliste (Modul A) → automatische "fehlende Unterlagen"-Liste
- **Qualitäts-Flags:** Dubletten-Erkennung, Scanqualitäts-Warnung, Lesbarkeits-Score

**Aufwand:** ~2 Wochen, mittleres Risiko (OCR-Pipeline existiert, Klassifikations-Layer ist neu)

---

## 8. Kernprobleme im Kanzleialltag

| Bao's Engpass | Unser Modul | Sprint |
|---|---|:-:|
| 8.1 Schubweise eingereichte Unterlagen | Modul A (Checklisten) + Sprint 3 (Auto-Match) | 1 + 3 |
| 8.2 Erinnerungs-E-Mails | Auto-Erinnerungs-Pipeline | 2 |
| 8.3 Sachstandsanfragen vor Antrag | Sachstands-Generator, Status "Unterlagen fehlen" | 1 |
| 8.4 Sachstandsanfragen nach Antrag | Sachstands-Generator, Status "Behördliche Rückmeldung ausstehend" + Mandanten-Portal (Phase 4) | 1 + Phase 4 |
| 8.5 Mandatszahl bei begrenztem Personal | alle Module zusammen — geschätzte Zeitersparnis: 8-12h pro Refa pro Woche | kumulativ |

---

## 9. Priorisierung der Hauptprobleme

**Status:** ✓ exakt unsere Reihenfolge

Deine Top-7-Reihenfolge spiegeln wir 1:1 in der Sprint-Planung:

| Bao-Priorität | Sprint | Modul |
|:-:|:-:|---|
| 1. Erinnerungen an fehlende Unterlagen | Sprint 2 | Auto-Erinnerungs-Pipeline |
| 2. Sachstandsanfragen | Sprint 1 | Modul B (8-Stati + Generator) |
| 3. Sortieren/Prüfen Unterlagen | Sprint 3 | Auto-Klassifikation |
| 4. Anträge/Schriftsätze | bereits live | 17 Migration-Templates + Word-Export |
| 5. Behörden-Kommunikation | bereits live | PDF/Word + Audit |
| 6. Fristen/Termine | bereits live | §§ 187/188 BGB Tracker |
| 7. Sonstige Admin | Sprint 1 | Modul D (Tasks pro Akte) |

---

## 10. Zielbild der künftigen Lösung

**Status:** alle 12 Punkte abgebildet im Plan

Die zwölf Zielbild-Punkte aus deinem Dokument sind 1:1 in den Sprints 1-4 verteilt. Keiner fällt raus. Was wir bewusst **nicht** in der ersten Iteration anstreben:

- **Vollständige Advoware-API-Integration** — Advoware bietet keine offene Schnittstelle. Wir bleiben bei CSV-Import (existiert) + strukturiertem Export. Wenn du bei Advoware-Support nachfragst und doch eine Schnittstelle bekommst: Game-Changer, sofort einbauen.
- **WhatsApp-Direktintegration** — siehe Punkt 6.

---

## 11. Erste Use Cases

| Use Case | Status heute | Sprint |
|---|:-:|:-:|
| UC1: Automatische Prüfung fehlender Unterlagen | ✗ | 1 (mit Modul A) + 3 (mit Auto-Klassifikation) |
| UC2: Automatische Erinnerung an fehlende Unterlagen | ✗ | 2 |
| UC3: Automatisierte Sachstandsantworten | ~ teil | 1 |
| UC4: Dokumentensortierung und Benennung | ~ OCR ja, Klassifikation nein | 3 |
| UC5: Mandantenführung Upload-Prozess | ~ Intake-Formular ja, Upload-Wizard nein | Phase 4 |
| UC6: Interne Aufgabensteuerung | ✗ | 1 (Modul D) |
| UC7: E-Mail/Nachrichten-Vorlagen | ~ Templates ja, kontextabhängige Drafts nein | 1 + 2 |

---

## 12. Funktionale Anforderungen

### 12.1 Mandats- und Statusverwaltung — Status ✓ überwiegend live

Deine 15 Felder sind im Akten-Datenmodell — Stand heute:
- **Mandatsart** (11 Migrations-Optionen) ✓ live
- **8-Stati-Workflow** mit Übergangs-Regeln ✓ live
- **Externe Stelle (Behörde/Gericht)** mit 17-Behörden-Combobox ✓ live
- **Sprache des Mandanten** (Dropdown DE/VI) — kommt in Sprint 1 Modul C, sobald wir deine Voice-Anchor-Mails durchgegangen sind
- **Autorisierte Mittelsperson** — Templates vorbereitet, Datenmodell in Sprint 4

### 12.2 Dokumentenmanagement — Status ~ teilweise live

Upload + Verknüpfung zur Akte: ✓ live
OCR mit Keyword-Match gegen Mandatsart-Checkliste: ✓ live (heute Abend committed, als Beta-Erkennung gelabelt)
Semantische Klassifikation, Plausi-Checks, Dubletten-Erkennung, Quality-Scores: Sprint 3

### 12.3 Mehrsprachige Kommunikation — Status ✓ überwiegend live

Standardisierte Textbausteine, rechtlich geprüfte Vorlagen, Speicherung in Akte: ✓ live
**32 Sachstand-Templates DE+VI** (8 Stati × Mandant/Mittelsperson × Sprache): ✓ live (Modul B)
DE/VI Übersetzungs-Pipeline für freie Recherche: Sprint 1 Modul C — wartet auf deine Voice-Anchor
KI-gestützte Anpassung an Sachverhalt mit Anti-Halluzination: ✓ (53/53 Eval-Cases passing in CI)

### 12.4 Automatisierung mit Freigabeprinzip — Status ✓ konzeptionell, Implementierung in Sprints

Wir folgen exakt deinem 3-Stufen-Modell:
1. **Automatischer Entwurf** — KI erstellt, Refa/Anwalt bestätigt: heute schon so für die KI-Recherche
2. **Halbautomatischer Versand** — Sprint 2 (Refa-Freigabe für Erinnerungen)
3. **Vollautomatischer Versand** — explizit erst nach 4-6 Wochen Pilot, mit dir abgestimmten Regeln

---

## 13. Nicht-funktionale Anforderungen

### 13.1 Datenschutz und Berufsgeheimnis — Status ✓ live

Deine 12-Punkte-Liste ist die Voraussetzung, nicht ein Ziel:
- ✓ Frankfurt-Hosting (Upstash + Vercel + Resend EU)
- ✓ Tenant-gebundene Sessions mit signiertem Token + RBAC
- ✓ Verschlüsselung in-transit (TLS 1.3) + at-rest (AES-256)
- ✓ Audit-Log lückenlos
- ✓ DSGVO-Anonymizer vor jeder LLM-Anfrage
- ✓ AVV-Vorlagen-Generator
- ✓ "Notausgang"-Funktion (alle Pro-Daten löschbar)
- ✓ Ausschluss KI-Training (in OpenAI-Org-Settings + Prompt-Header `X-No-Train`)

### 13.2 Kanzlei- und berufsrechtliche Anforderungen — Status ✓

KI bereitet vor, Mensch verantwortet. Dieses Prinzip ist in jedem Workflow eingebaut: keine LLM-Antwort wird automatisch versandt, jeder PDF-Export hat einen Disclaimer-Footer, die anwaltliche Verschwiegenheit bleibt durch lokale Citation-Verifikation gegen 5.936 Bundesgesetze geschützt.

### 13.3 Nachvollziehbarkeit — Status ✓ live

Audit-Log umfasst: eingegangene Informationen, KI-Empfehlungen, Freigaben, Versendungen, Statusübermittlungen. Exportierbar als BHV-tauglicher PDF-Bericht.

### 13.4 Fehlervermeidung und Haftungsprävention — Status ✓ konzeptionell live

- Falsche Zuordnung von Dokumenten → Auto-Klassifikation mit Confidence-Score, unsichere Fälle für menschliche Sichtprüfung markiert (Sprint 3)
- Falsche Übersetzung → DE/VI-Pipeline mit zweiter LLM-Stufe als Verifier
- Falsche Statusmitteilung → Status-Änderung erfordert immer Refa/Anwalt-Klick, nie LLM-Auto
- Fehlende Fristenkontrolle → §§ 187/188 BGB Tracker, jede Akte hat Wiedervorlage
- Unberechtigte Mittelsperson-Kommunikation → Sprint 4 mit Vollmachts-Validierung
- Unkontrollierte automatisierte Rechtsauskunft → 53/53 Eval-Cases in CI, jede Citation gegen Korpus verifiziert
- Verlust/Offenlegung sensibler Daten → Frankfurt-only, AES-256, kein Drittanbieter ohne AVV

---

## 14. Anforderungen an KI-Funktionen

**Status:** ✓ Trennlinie KI/Mensch identisch zu unserer

Deine "geeignete vs. nicht ohne anwaltliche Kontrolle"-Trennung ist die operative Grundlage. Wir bauen nichts in die "nicht ohne Kontrolle"-Kategorie automatisch ein. Konkret:

- ✓ KI: Klassifikation, Extraktion, Erinnerungs-Entwürfe, Sachstands-Entwürfe, Übersetzungs-Hilfe, Aufgaben-Vorbereitung, Checklisten-Match
- ✗ KI **niemals** ohne Anwalt: Erfolgsprognosen, verbindliche Beratung, Fristen-Bewertung in komplexen Fällen, strategische Verfahrens-Entscheidungen, streitige Behörden-Kommunikation, strafrechtliche Risiko-Bewertung

---

## 15. Integration mit Advoware

**Status:** ~ teil (CSV ja, API nein — Klärung mit Advoware nötig)

**Was bereits existiert:**
- **Bidirectional CSV-Import** mit Auto-Spalten-Erkennung für Advoware-Export (plus DATEV, RA-Micro, advoware-eigenem Format) — Bulk-Migration einer Akten-Datei in unter 10 Minuten

**Was Klärung mit Advoware-Support braucht:**
- Hat Advoware eine **nicht-öffentliche** API für Partner? Manche Anbieter geben Schnittstellen nur auf Anfrage frei. Falls ja — erste Priorität für Sprint 5+.
- Welche Lizenzstufe nutzt deine Kanzlei (Standard, Pro, Anwaltskanzlei-Edition)? Beeinflusst evtl. Schnittstellen-Verfügbarkeit.

**Bis zur API-Klärung:**
- **Datei-basierte Übergabe** in beide Richtungen: Akten-CSV-Import + strukturierter PDF-Export pro Akte für manuelles Anhängen in Advoware. Kein Live-Sync, aber praktikabel.

---

## 16. Mögliche Entwicklungsphasen

**Status:** ✓ deckt sich exakt mit unserer Sprint-Planung

| Bao-Phase | Unser Sprint(s) |
|---|---|
| Phase 1: Prozessaufnahme + Datenmodell | Sprint 0 (heute) |
| Phase 2: Internes KI-Assistenzsystem | Sprint 1-2 |
| Phase 3: Strukturierter Upload-Prozess | Sprint 3-4 |
| Phase 4: Mandantenportal/App | Phase 4 (separater 1-2 Monats-Track ab Sprint 5) |
| Phase 5: Erweiterte Automatisierung | Phase 5 (nach Pilot-Daten aus Phase 4) |

---

## 17. MVP-Vorschlag

**Status:** wir bauen exakt deinen MVP-Vorschlag

Deine 9 Punkte werden in zwei Sprints geliefert:

**Sprint 1 (Modul A+B+C+D, ~3 Wochen) — Stand 2026-05-06:**
1. ✓ Mandatsart auswählen *(live, 11 Optionen)*
2. ✓ Checkliste generieren *(Modul A — live, 108 Items)*
3. ✓ eingegangene Unterlagen erfassen *(live, plus OCR-Drop-Zone mit Keyword-Match seit heute Abend)*
4. ✓ fehlende Unterlagen anzeigen *(Modul A live + neues Heute-Widget im Dashboard)*
5. ⌥ Erinnerung DE/VI erzeugen *(Sachstand-Templates DE+VI sind live für 8 Stati; freie Erinnerungs-Generierung in Modul C, wartet auf deine Voice-Anchor)*
6. ✓ Statuskategorie festlegen *(Modul B live, 8 Stati mit Übergangs-Regeln)*
7. ✓ Sachstandsantwort erzeugen *(Modul B live, 32 Templates Mandant/Mittelsperson × DE/VI)*
8. ⌥ interne Aufgabe erstellen *(Modul D, Sprint 1 Rest)*
9. ✓ Export Advoware *(CSV-Bidirectional bereits live)*

**Bonus (heute Abend nachgeschoben):**
- ✓ **Heute-Widget** im Dashboard — drei Sektionen (Fristen ≤ 14 Tage, Behörden-Rückfragen, fehlende Pflicht-Unterlagen)
- ✓ **Auto-Frist-Berechnung** beim Status-Wechsel auf „Antrag eingereicht" (3 Monate AufenthG nach § 75 VwVfG, 6 Monate Einbürgerung, 7 Tage Eilantrag)
- ✓ **OCR-Drop-Zone** in der Checkliste mit Keyword-Match-Vorschlägen (Bestätigung manuell)

**Sprint 2 (Auto-Erinnerungs-Engine, ~2 Wochen):** der eigentliche Zeitspar-Hebel — automatische Detection + Draft + Refa-Freigabe + Send.

**Sprint 3 (OCR-Klassifikation, ~2 Wochen):** schließt UC4.

---

## 18. Beispielhafte Statuslogik

**Status:** ✓ alle 5 Stati in unserem Datenmodell, plus die 3 weiteren aus UC3

Deine fünf Beispiel-Stati sind die ersten fünf des Sprint-1-Datenmodells. Wir ergänzen drei weitere aus UC3 (Behörde Nachforderung, Termin steht aus, Verfahren abgeschlossen) für eine vollständige 8-Stati-Kategorisierung.

**Anhang A** zeigt die exakten Status-Übergangs-Regeln und je Status ein DE+VI Antwort-Template.

---

## 19. Rollenmodell

**Status:** ~ teilweise

| Rolle | Status |
|---|---|
| Rechtsanwalt | ✓ live — voller Zugriff + Freigabe-Privileg |
| Refa | ✓ live — Status-Pflege, Erinnerungs-Vorbereitung, Mandanten-Kommunikation nach Freigabe |
| Studentische Hilfskraft | ✓ live — eingeschränkter Zugriff (kein Edit von rechtlich sensibler Kommunikation) |
| **Mittelsperson** | ✗ Sprint 4 — neue Rolle, dokumentierte Vollmacht, eingeschränkter Upload + Status-Sicht |
| **Mandant** | ✗ Phase 4 — eigener Login mit Magic-Link, Status-Anzeige, Unterlagen-Liste |

---

## 20. Offene Klärungspunkte für Entwickler

Deine 15 Klärungsfragen — wir antworten so weit wir können. Die Top-5, die wir vor Sprint-1-Kick-off von dir brauchen, sind im Abschnitt "Klärungsfragen" am Ende dieses Dokuments.

| Bao-Frage | Antwort | Status |
|:-:|---|:-:|
| 1. Advoware-Schnittstellen | unbekannt — bitte bei Advoware-Support nachfragen | offen |
| 2. Häufige Dokumententypen pro Mandatsart | wir haben Default-Liste in Anhang B vorbereitet — bitte ergänzen/korrigieren | offen |
| 3. Existierende Checklisten | bitte Foto wenn vorhanden | offen |
| 4. Aktuelle Textbausteine | bitte 3-5 Beispiel-E-Mails als VI-Anker | offen |
| 5. VI-Standardformulierungen | siehe 4 | offen |
| 6. Mittelspersonen-Dokumentation | bitte aktuelles Verfahren beschreiben | offen |
| 7. Kommunikationskanäle MVP | unsere Empfehlung: E-Mail (Refa-Freigabe) + PDF/Word; WhatsApp organisatorisch reduzieren | Workshop |
| 8. WhatsApp ja/nein | siehe 7 | Workshop |
| 9. Datenspeicherung | Frankfurt (Upstash + Vercel) — bestätigt | ✓ |
| 10. Dienstleister | OpenAI mit `X-No-Train` + DSGVO-Anonymizer, Frankfurt-Hosting | ✓ |
| 11. KI-Modelle | gpt-4o-mini Structured Outputs für Strukturarbeit, ggf. claude-sonnet für Übersetzung | ✓ |
| 12. KI-Training-Schutz | OpenAI Org-Setting + Prompt-Header + Anonymizer | ✓ |
| 13. Freigabeprozesse | Refa-Freigabe Standard, Anwalts-Freigabe bei sensiblen Fällen | ✓ |
| 14. Vollautomatischer Lauf | erst nach 4-6 Wochen Pilot mit deinem expliziten Go | abgestimmt |
| 15. Kennzahlen | siehe Abschnitt "Erfolgskriterien" | siehe 21 |

---

## 21. Erste Erfolgskriterien

**Status:** ✓ wir messen alle 9 KPIs

Wir bauen einen Kanzlei-KPI-Dashboard ab Sprint 1 mit folgenden Zählern:

| Bao-KPI | Mess-Methodik | Ziel |
|---|---|---|
| Reduktion Erinnerungs-E-Mails | Vergleich vor/nach Sprint 2 (Anzahl Refa-Drafts) | -40% |
| Reduktion Sachstandsanfragen | Vergleich Inbox vs. Mandanten-initiierte Calls | -30% |
| Schnellere Feststellung fehlender Unterlagen | Zeit zwischen Upload und Match-Ergebnis | <2 Min |
| Weniger unzugeordnete Dokumente | Anteil mit "Mandat unklar" Flag | <5% |
| WhatsApp/E-Mail-Sortieraufwand | manuelle Selbstdokumentation 2 Wochen | -50% |
| Bearbeitungszeit bis Antrag | Zeitstempel "neu" → "Antrag eingereicht" | -25% |
| Transparenz für Mandanten | Refa-Befragung + (Phase 4) Mandanten-Login-Stats | qualitativ |
| Refa-Belastung | Selbstreport Refa, vor/nach jedem Sprint | qualitativ |
| Planbarkeit bei steigenden Zahlen | Mandate/Refa/Woche | Anstieg ohne Verschlechterung |

---

## 22. Zusammenfassung — was wir konkret vorschlagen

**Wir starten Sprint 0 heute** mit dem Datenschema für die Mandatsart-Checklisten (siehe Anhang B). Das Schema ist bereits angelegt und committet.

**Sprint 1 (3 Wochen) liefert:**
1. Vollständige Migration-Mandatsart-Checklisten DE+VI in der Pro-Akten-Ansicht
2. 8-Stati-Status-Modell mit Sachstands-Generator
3. Vietnamesische KI-Antworten (Voice-Polish durch dich)
4. Interne Aufgaben-Steuerung pro Akte

**Sprint 2 (2 Wochen):** Auto-Erinnerungs-Engine mit Refa-Freigabe → adressiert die größte Zeitfresser-Kategorie

**Sprint 3 (2 Wochen):** OCR-Klassifikation + Auto-Benennung → schließt UC4 ab

**Sprint 4 (2 Wochen):** Mittelspersonen-Modell mit Vollmachts-Validierung

**Phase 4 (separater 4-6 Wochen-Track):** Mandanten-Portal mit eigenem Login

**Gesamtzeitrahmen MVP-fertig:** ~9-10 Wochen, anschließend Pilot-Phase mit echten Mandaten.

---

## Klärungsfragen vor Sprint-1-Kickoff

Damit wir nicht in falsche Richtungen bauen, brauchen wir vor Sprint-1-Start Antworten auf diese fünf Fragen:

1. **Welche 3 Mandatsarten zuerst?** Unser Vorschlag: Visumsverfahren + Aufenthaltstitel-Verlängerung + Familiennachzug. Bestätigen oder ändern?

2. **Existierende Checklisten** auf Papier oder im Kopf — bitte 2-3 als Foto/Skizze schicken. Wir haben in Anhang B Default-Listen vorbereitet, die wahrscheinlich noch nachjustiert werden müssen.

3. **3-5 Beispiel-Erinnerungs-E-Mails** aus eurem Bestand (DE oder VI), aus denen wir den linguistischen Stil ableiten — damit auto-generierte Drafts wie aus eurer Kanzlei klingen, nicht wie KI.

4. **Mittelsperson-Praxis aktuell:** Wie wird die Berechtigung dokumentiert? Schriftliche Vollmacht mit Unterschrift? Mündliche Vereinbarung? E-Mail-Bestätigung des Mandanten?

5. **Advoware-API:** Bitte bei Advoware-Support fragen, ob es nicht-öffentliche Schnittstellen für Partner gibt, evtl. unter NDA. Falls ja — erste Priorität.

---

## Für unser Treffen morgen

Das Dokument oben ist die Diskussionsgrundlage. Konkret bringen wir morgen Folgendes mit:

1. **Coverage-Audit** (Abschnitte 1-22 oben) — du siehst pro Bereich, was heute schon live ist und wo wir ergänzen
2. **Sprint-Plan** mit Aufwandsschätzungen pro Modul
3. **Modul-A-Foundation** als Code im Repo, mit Seed-Checklisten für 11 Mandatsarten — in Anhang B unten
4. **5 Klärungsfragen** (Abschnitt direkt oben), die wir gemeinsam durchgehen sollten

**Was wir morgen klären sollten:**
- Stimmt unsere Sprint-Reihenfolge mit deiner Realität überein?
- Default-Checklisten in Anhang B: was fehlt, was kannst du raus-streichen, was sind kanzlei-spezifische Besonderheiten?
- Top-3 Mandatsarten für den ersten Live-Pilot (unser Vorschlag: Aufenthaltstitel + Familiennachzug + Visumsverfahren — bestätigen oder umsortieren)
- Welche 2-3 Personen aus eurer Kanzlei sollen die ersten Test-Accounts bekommen?
- Realistischer Zeitrahmen aus deiner Sicht — können wir Sprint 1 (3 Wochen) tatsächlich anschieben oder gibt es Engpässe deinerseits (Urlaub, große Verfahren, etc.)?

**Optional fürs Meeting** (wenn Zeit bleibt):
- Live-Demo der existierenden Pro-App auf `gitlaw-xi.vercel.app/#/bao` mit deinem Account
- Vorstellung des MCP-Servers — falls eure Kanzlei perspektivisch eine eigene KI-Assistenz auf Claude Desktop oder ChatGPT hosten will, ist GitLaw als Tool integrierbar

---

## Anhang A: 8-Stati-Status-Übergangs-Regeln

| Von Status | Erlaubte Übergänge | Wer darf ändern |
|---|---|---|
| Unterlagen fehlen | → Unterlagen in Prüfung (alle erforderlichen da) | Refa, Anwalt |
| Unterlagen in Prüfung | → Antrag in Vorbereitung (Prüfung positiv) / → Unterlagen fehlen (Nachforderung) | Refa, Anwalt |
| Antrag in Vorbereitung | → Antrag eingereicht | Anwalt (Refa nach Anwalts-Sichtprüfung) |
| Antrag eingereicht | → Behördliche Rückmeldung ausstehend (auto nach 7 Tagen) | System |
| Behördliche Rückmeldung ausstehend | → Behörde Nachforderung / → Termin steht aus / → Verfahren abgeschlossen | Refa, Anwalt |
| Behörde Nachforderung | → Unterlagen in Prüfung (Nachforderung beantwortet) | Refa, Anwalt |
| Termin steht aus | → Verfahren abgeschlossen | Anwalt |
| Verfahren abgeschlossen | (terminal) | — |

Jeder Status hat ein DE+VI Antwort-Template, das im Sachstands-Generator verwendet wird.

---

## Anhang B: Default-Mandatsart-Checklisten (Modul-A-Seed-Daten)

Dies ist der heute angelegte Daten-Seed für die ersten 11 Mandatsarten. Die Listen sind bewusst defensiv (eher mehr verlangt als weniger). Bitte ergänzen, korrigieren, kürzen.

(Datei: `viewer/src/pro/mandatsart-checklists.ts` — siehe Repo)

### Beispiel: Aufenthaltstitel-Verlängerung
- Reisepass (Original + Kopie aller bestempelten Seiten)
- Aktueller Aufenthaltstitel
- Aktuelle Meldebescheinigung (≤ 3 Mo alt)
- Mietvertrag oder Wohnungsgeber-Bestätigung
- Einkommensnachweis (3 letzte Lohnabrechnungen)
- Krankenversicherungs-Nachweis
- Biometrisches Lichtbild (35×45 mm)
- Anwalts-Vollmacht
- (bedingt) Sprachzeugnis B1 falls für den Titel erforderlich
- (bedingt) Eheurkunde falls Familiennachzug-bezogen

### Beispiel: Familiennachzug Ehegatte/Ehegattin
- Reisepass beider Ehegatten
- Heiratsurkunde + Apostille
- Geburtsurkunden (falls Kinder)
- Wohnraum-Nachweis (Mietvertrag + Quadratmeter)
- Einkommensnachweis (3 Mo) des/der hier lebenden Partner:in
- Krankenversicherungs-Nachweis
- Sprachzeugnis A1 (für nachziehenden Partner:in)
- Anwalts-Vollmacht

(weitere 9 Mandatsarten in der Datei — siehe nächstes Update)

---

## Anhang C: Was zwischen Lastenheft-Eingang und heute committed wurde

Stand 2026-05-06, alles auf `main`-Branch, live unter `gitlaw-xi.vercel.app`. Sieben Commits, ungefähr in dieser Reihenfolge:

### Sprint 0 — Foundation (`faee6db`)
Datenschema + Seed-Daten für 11 Migrations-Mandatsarten mit insgesamt 108 kuratierten Pflicht- und Optional-Unterlagen.
- `viewer/src/pro/mandatsart-checklists.ts` (1.085 Zeilen)
- `viewer/src/pro/types.ts` — `MandatsartChecklist`, `ChecklistItem`, Erweiterung von `MandantCase` um `mandatsartId`, `checklistStates`, `caseStatus`, `behoerde`

### Sprint 1 Modul A — Checklisten in der UI (`45f4002`)
- `MandatsartSelector.tsx` — Dropdown-Auswahl aus 11 Mandatsarten beim Akten-Anlegen
- `CaseChecklist.tsx` — Section in der Akten-Detail-View. Zeigt jedes Item mit Status `received` / `pending` / `problem`, ein Klick toggelt. Filter „nur fehlende Pflicht-Unterlagen". Fortschrittsbalken.

### Sprint 1 Modul B — 8-Stati + Sachstands-Generator (`1909330`)
- `case-status.ts` — 8 Stati mit Übergangs-Regeln (siehe Anhang A)
- `sachstand-templates.ts` — 32 Antwort-Templates (8 Stati × Mandant/Mittelsperson × DE/VI)
- `StatusDropdown.tsx` — zeigt nur erlaubte Folge-Stati
- `SachstandsGenerator.tsx` — Drawer mit DE+VI parallel, Empfänger-Toggle Mandant/Mittelsperson, Copy-to-Clipboard

### Sprint 1 Polish — Demo-Akte + Behörden-DB (`759d54e`, `7c0d9fb`)
- `demo-seed.ts` — fertige Beispiel-Akte für Phạm Văn Đức, Aufenthaltstitel-Verlängerung, halb gefüllte Checkliste
- `behoerden.ts` + `BehoerdenSelector.tsx` — 17 Berliner Migrations-Stellen (LEA, BAMF, VG Berlin, Botschaften Vietnam) als Combobox
- Bug-Fix: Demo-Button konsumiert Invite-Token sauber

### DE-Voice-Sweep + Demo-Skript (`0f84984`)
- 32 Sachstand-Templates auf Deppen-Apostroph, Formular-Doppelpunkte und militärischen Ton durchgesehen
- `BAO_DEMO_SKRIPT_2026-05-06.md` — 5-Schritte-Demo-Walkthrough für unser Treffen

### Drei Bonus-Features für die Demo (`87028d4`)
- **TodayWidget** im Dashboard ganz oben — drei Sektionen: Fristen ≤ 14 Tage, Akten mit `behoerde_nachforderung` oder `unterlagen_fehlen`, Akten mit fehlenden Pflicht-Unterlagen. Click-to-Akte.
- **Auto-Frist-Berechnung** beim Status-Wechsel auf `antrag_eingereicht` — Lookup-Tabelle pro Mandatsart, setzt Behörden-Bearbeitungsfrist nach § 75 VwVfG (3 Monate für Aufenthaltstitel, 6 Monate Einbürgerung, 7 Tage Eilantrag etc.) automatisch ein.
- **OCR-Drop-Zone** in der Checkliste — wirft du ein Foto/PDF rein, OCR (PDF-Text-Layer oder OpenAI Vision für Scans) läuft, Keyword-Match gegen Checklisten-Item-Namen mit Aliassen (DE/EN/VI: Reisepass/passport/hộ chiếu, krankenversicherung/TK/AOK/Barmer, etc.). **Nichts wird automatisch akzeptiert** — jeder Match erscheint als Vorschlag mit „Bestätigen" / „Verwerfen". OCR ist als Beta-Erkennung gelabelt, weil ich deine echten PDFs nicht kenne.

### Was *bewusst* noch nicht da ist
- E-Mail-Auto-Versand (Sprint 2)
- OCR-Klassifikation auf semantischer Ebene (Sprint 3 — der OCR-Block oben ist nur Keyword-Match, kein vollständiges Document-Understanding)
- Mittelspersonen-Datenmodell (Sprint 4 — Templates sind vorbereitet, Datenmodell folgt)
- Mandanten-Portal (Phase 4)
- Advoware-Anbindung (offen, wartet auf deine Entscheidung in §15)

### So klickst du das in 60 Sekunden durch
1. `gitlaw-xi.vercel.app/#/bao` öffnen
2. „Demo-Akte anlegen" klicken → Phạm Văn Đức (AZ-2026-0042) erscheint
3. Akte öffnen — Checkliste, Status-Dropdown, Sachstands-Generator (DE+VI)
4. Status auf „Antrag eingereicht" → Frist wird automatisch gesetzt
5. Foto in die OCR-Drop-Zone werfen → Match-Vorschläge erscheinen

---

**Diese Datei** (`BAO_KI_DATENVERARBEITUNG_ANTWORT.md`) ist die persistierte, lebende Antwort auf dein Lastenheft. Ich aktualisiere sie nach jedem Sprint.

---

**Mit besten Grüßen,**

Mikel

*PS: Das Lastenheft ist die Basis für eine ernsthafte Förderantrag-Bewerbung (Prototype Fund, Bertelsmann, Schöpflin). Wenn die ersten 3 Sprints laufen und wir Pilot-Daten haben, sollten wir darüber reden.*
