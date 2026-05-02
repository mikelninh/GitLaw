# GitLaw Agent Evaluation Matrix

## Ziel

Diese Matrix bewertet GitLaw nicht nach "cooler KI", sondern nach belastbarer Kanzlei-Nuetzlichkeit.

Jeder Testfall braucht:

- klares Szenario
- pass/fail Kriterien
- zuständige Agenten
- Messwert oder Review-Frage

## Bewertungslogik

### Status

- `PASS` = heute belastbar testbar und ausreichend fuer Pilotnutzung
- `BETA` = testbar, aber mit erkennbarem Stub / manueller Hilfe / eingeschraenkter Sicherheit
- `FAIL` = heute nicht sinnvoll oder nicht vertrauenswuerdig

### Bewertungsskala

Pro Testfall:

- `0` = fail
- `1` = beta
- `2` = pass

Gesamt:

- `0-5` kritisch
- `6-9` fruehe Beta
- `10-13` pilotierbar
- `14+` stark fuer bezahlte Piloten

## Matrix

| # | Testfall | Agenten | Pass-Kriterien | Status heute |
|---|---|---|---|---|
| 1 | Mehrsprachiger Intake wird strukturiert uebernommen | Intake Agent | Sprache, Dringlichkeit, Fristsignal und Falldaten landen sauber im Eingang und koennen in eine Akte uebernommen werden | `PASS` |
| 2 | Dokument-Upload wird benannt und der Akte zugeordnet | Document Agent | interner Dateiname, Kategorie, Sprache, Fallzuordnung und Upload-Event vorhanden | `PASS` |
| 3 | Dokument landet bevorzugt im serverseitigen Vault | Document Agent, Upload Layer | bei verfuegbarem Backend wird `server_vault` gesetzt und `serverDocumentId` gespeichert; Fallback ist kontrolliert | `BETA` |
| 4 | OCR-Job erzeugt verwertbaren Textpfad | OCR Agent | Job wird angelegt, kann ausgefuehrt werden, OCR-Text landet am Dokument | `BETA` |
| 5 | DE-Arbeitsfassung kann erzeugt und freigegeben werden | Translation Agent | Uebersetzungsjob, Textfassung, Review-Flag und Audit-Event funktionieren | `BETA` |
| 6 | Recherche liefert strukturierte Antwort mit Zitaten | Research Agent | Antwort als strukturierter Output, keine freie Formatdrift, serverseitige Session erforderlich | `PASS` |
| 7 | Freigegebene Recherche verbessert Folgefrage | Memory Agent, Research Agent | approved memory wird gespeichert und in neue Pro-Research-Anfrage uebergeben | `BETA` |
| 8 | Zitate sind maschinenpruefbar statt nur Fliesstext | Citation Verification Layer | Zitate liegen getrennt mit `paragraph`, `gesetz`, `bedeutung` vor | `PASS` |
| 9 | Erster Entwurf entsteht aus Akte + Vorlage | Drafting Agent | Entwurf wird erstellt, gespeichert und bleibt reviewbar | `PASS` |
| 10 | Unberechtigte Rolle wird an API geblockt | Trust Layer | ohne Session = 401, mit zu niedriger Rolle = 403 | `PASS` |
| 11 | Tenant-fremde Sync-/Dokumentzugriffe sind blockiert | Trust Layer | Sync und Vault nutzen Session-tenant statt guessable key | `PASS` |
| 12 | Next-best-step Empfehlung kommt aus Fallstatus | Workflow Recommendation Agent | System empfiehlt naechsten Schritt aus Frist-, Dokument-, Review- und Fallstatus | `FAIL` |

## Heutiger Gesamtstand

### Numerischer Stand

- PASS = 7
- BETA = 4
- FAIL = 1

Score:

- `7*2 + 4*1 + 1*0 = 18`

Einordnung:

- `pilotierbar mit klarer weiterer Ausbaupflicht`

## Wo wir schon stark sind

1. Intake -> Dokument -> Recherche -> Draft als echter Produktfluss
2. Session-, Rollen- und Tenant-Schutz
3. Strukturierte Research-Outputs statt Chat-Matsch
4. Approved Memory als echter Start eines Kanzlei-Lerneffekts

## Wo wir noch nicht stark genug sind

1. echter OCR-/Translation-Provider
2. Workflow Recommendation Agent
3. tiefere Citation Verification gegen belastbare Quellen
4. serverseitige Persistenz als Primaerspeicher

## Empfehlung fuer Pilot-Readiness

### Sofort messen

- Zeit von Intake bis erste Akte
- Zeit von Dokument bis erste lesbare Fassung
- Zeit von Recherche bis erster Entwurf
- Anteil Outputs, die mit wenig Korrektur freigegeben werden

### Nächste harte Schwelle

Bevor wir von "interessante Beta" zu "starker Pilot" gehen, brauchen wir:

1. echten OCR-/Translation-Worker
2. serverseitige Persistenz der Kernobjekte
3. ersten Recommendation-Agent aus Fallstatus
