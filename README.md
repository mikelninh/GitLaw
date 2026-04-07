# GitLaw ⚖️

**Alle 5.936 deutschen Bundesgesetze als durchsuchbares, transparentes Markdown-Archiv.**

1.303.451 Zeilen. 107.715 Paragraphen. Open Source. Automatisch aktuell.

> "Sunlight is the best disinfectant." — Louis Brandeis

**[Live Viewer →](https://mikelninh.github.io/gitlaw/)**

## Was ist GitLaw?

Gesetze werden hinter verschlossenen Türen geändert. Niemand weiß, wer welche Klausel eingefügt hat. GitLaw macht die gesamte deutsche Bundesgesetzgebung durchsuchbar, lesbar und transparent — mit derselben Technologie, die 100 Millionen Entwickler für Software nutzen.

### Features

- **Alle Bundesgesetze durchsuchbar** — Fuzzy-Suche über 5.936 Gesetze
- **AI-Erklärung** — "Einfach erklären" Button: GPT-4o-mini erklärt jeden Paragraphen in 3 Sätzen für einen 16-Jährigen
- **Reform-Diffs** — Zeigt Vorher/Nachher was sich im Gesetzestext ändert wenn eine Reform umgesetzt wird (Verbindung zu [Deutschland 2030](https://github.com/mikelninh/deutschland-2030))
- **Wöchentlich aktualisiert** — Jeden Montag 6:00 UTC parst ein GitHub Action automatisch alle Gesetze neu. Änderungen werden als Git-Diff sichtbar.
- **100% Open Source** — MIT Lizenz. Fork it, improve it.

## Zahlen

| Metrik | Stand |
|--------|-------|
| Gesetze | **5.936** |
| Paragraphen | **107.715** |
| Zeilen | **1.303.451** |
| Abdeckung | **86%** aller Bundesgesetze |
| Aktualisierung | **Automatisch wöchentlich** |
| Zuletzt geändert 2025/2026 | **508 Gesetze** |

## Schlüsselgesetze

| Gesetz | Datei | Beschreibung |
|--------|-------|-------------|
| 🏛️ Grundgesetz | [`laws/gg.md`](laws/gg.md) | Die Verfassung |
| ⚖️ Strafgesetzbuch | [`laws/stgb.md`](laws/stgb.md) | Strafrecht |
| 📋 Bürgerliches Gesetzbuch | [`laws/bgb.md`](laws/bgb.md) | Zivilrecht (17.896 Zeilen) |
| 🏦 SGB V | [`laws/sgb_5.md`](laws/sgb_5.md) | Krankenversicherung |
| 🏦 SGB VI | [`laws/sgb_6.md`](laws/sgb_6.md) | Rentenrecht |
| 🌐 NetzDG | [`laws/netzdg.md`](laws/netzdg.md) | Plattform-Regulierung |
| 🐾 Tierschutzgesetz | [`laws/tierschg.md`](laws/tierschg.md) | Tierschutz |
| 💶 Einkommensteuergesetz | [`laws/estg.md`](laws/estg.md) | Einkommensteuer |
| 🛂 Aufenthaltsgesetz | [`laws/aufenthg_2004.md`](laws/aufenthg_2004.md) | Aufenthaltsrecht |

## Reform-Diffs: Was sich ändern würde

GitLaw zeigt Gesetze wie sie **sind**. [Deutschland 2030](https://github.com/mikelninh/deutschland-2030) zeigt wie sie sein **könnten**. Die Reform-Diffs zeigen den **Weg dazwischen**.

Beispiel — **Rentenreform §36 SGB VI**:

```diff
- Versicherte haben Anspruch auf Altersrente, wenn sie das
- 67. Lebensjahr vollendet und die Wartezeit von 35 Jahren
- erfüllt haben.
+ Nach 45 Beitragsjahren besteht Anspruch auf abschlagsfreie
+ Altersrente, frühestens ab Vollendung des 63. Lebensjahres.
+ Versicherte mit 20+ Jahren körperlicher Belastung erhalten
+ einen Zuschlag von 12 Monaten.
```

**→ [Alle Reform-Diffs im Viewer ansehen](https://mikelninh.github.io/gitlaw/)**

## Web Viewer

```bash
cd viewer
npm install
npm run dev    # http://localhost:5175/gitlaw/
```

Braucht `VITE_OPENAI_API_KEY` in `viewer/.env` für die AI-Erklärungen.

## Parser

```bash
pip install requests lxml

python parser/fetch_index.py     # Index holen (6.876 Gesetze)
python parser/fetch_fast.py      # Alle parsen (10 Worker, ~10 Min)
python parser/build_index.py     # Viewer-Index bauen
```

## Automatische Aktualisierung

Jeden Montag 6:00 UTC läuft ein [GitHub Action](.github/workflows/update-laws.yml):
1. Parst alle Gesetze neu von gesetze-im-internet.de
2. Vergleicht mit der vorherigen Version
3. Committed nur wenn sich etwas geändert hat
4. Die Änderung ist als **Git-Diff** sichtbar — DAS ist GitLaw

## Roadmap

### Phase 1: Archiv ✅
Alle Bundesgesetze durchsuchbar, AI-erklärbar, mit Reform-Diffs. Wöchentlich aktualisiert.

### Phase 2: Bürgerbeteiligung (geplant)
- Paragraph-Level-Kommentare
- Öffentliche API für Forscher und Journalisten
- "Was bedeutet das für MICH?" — personalisierte Erklärungen

### Phase 3: Lobbying-Transparenz (geplant)
- Integration mit lobbyregister.bundestag.de
- NLP: Lobbying-Papiere ↔ Amendments vergleichen
- Automatisches Flagging bei verdächtigen Timelines

## Datenquellen

- **[gesetze-im-internet.de](https://www.gesetze-im-internet.de)** — Alle Bundesgesetze (BMJV)
- **[lobbyregister.bundestag.de](https://www.lobbyregister.bundestag.de)** — Bundeslobbyregister (Phase 3)

## Tech

| Komponente | Stack |
|-----------|-------|
| Parser | Python + lxml + requests |
| Viewer | React + TypeScript + Vite + Tailwind + Fuse.js |
| AI | OpenAI GPT-4o-mini |
| Daten | Markdown in Git |
| Updates | GitHub Actions (wöchentlich) |
| Deployment | GitHub Pages |

## Verwandte Projekte

- **[Deutschland 2030](https://github.com/mikelninh/deutschland-2030)** — 9 Reformen für Deutschland, evidenzbasiert
- **[offenegesetze.de](https://offenegesetze.de)** — Bundesgesetzblatt durchsuchbar
- **[La Fabrique de la Loi](https://lafabriquedelaloi.fr)** — Französische Amendment-Verfolgung

## Lizenz

MIT — Nutze es, forke es, verbessere es. Demokratie sollte Open Source sein.
