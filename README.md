# GitLaw ⚖️

**Alle 5.938 deutschen Bundesgesetze als durchsuchbares, transparentes Markdown-Archiv.**

107.691 Paragraphen. 904.989 Zeilen. Open Source. Für jeden zugänglich.

> "Sunlight is the best disinfectant." — Louis Brandeis

## Was ist GitLaw?

Gesetze werden hinter verschlossenen Türen geändert. Niemand weiß, wer welche Klausel eingefügt hat. GitLaw macht die gesamte deutsche Bundesgesetzgebung durchsuchbar, lesbar und transparent — mit derselben Technologie, die 100 Millionen Entwickler für Software nutzen.

**Live Viewer**: [mikelninh.github.io/gitlaw](https://mikelninh.github.io/gitlaw/)

## Was drin ist

| Metrik | Zahl |
|--------|------|
| Gesetze | **5.938** |
| Paragraphen | **107.691** |
| Zeilen | **904.989** |
| Abdeckung | **86%** aller Bundesgesetze |

Jedes Gesetz als sauberes Markdown — von der Abgabenordnung bis zum Zukunftsfinanzierungsgesetz.

### Schlüsselgesetze

| Gesetz | Datei | Beschreibung |
|--------|-------|-------------|
| 🏛️ Grundgesetz | `laws/gg.md` | Die Verfassung |
| ⚖️ Strafgesetzbuch | `laws/stgb.md` | Strafrecht |
| 📋 Bürgerliches Gesetzbuch | `laws/bgb.md` | Zivilrecht (10.768 Zeilen) |
| 🏦 Sozialgesetzbuch VI | `laws/sgb_6.md` | Rentenrecht |
| 🌐 Netzwerkdurchsetzungsgesetz | `laws/netzdg.md` | Plattform-Regulierung |
| 🐾 Tierschutzgesetz | `laws/tierschg.md` | Tierschutz |
| 💶 Einkommensteuergesetz | `laws/estg.md` | Einkommensteuer |
| 🛂 Aufenthaltsgesetz | `laws/aufenthg_2004.md` | Aufenthaltsrecht |

## Web Viewer

Der Viewer (`viewer/`) ist eine React-App mit:
- **Fuzzy-Suche** über alle 5.938 Gesetze
- **Featured Laws** mit Schnellzugriff
- **"Zuletzt geändert"** — Gesetze die kürzlich aktualisiert wurden
- **In-Gesetz-Suche** mit Treffer-Hervorhebung
- **GitHub-Link** zu jedem Markdown-File

```bash
cd viewer
npm install
npm run dev    # http://localhost:5175/gitlaw/
```

## Parser

Der Parser (`parser/`) konvertiert XML von gesetze-im-internet.de zu Markdown:

```bash
pip install requests lxml

# Index aller Gesetze holen
python parser/fetch_index.py          # → 6.876 Gesetze gefunden

# Ein Gesetz parsen
python parser/parse_law.py "https://www.gesetze-im-internet.de/gg/xml.zip"

# Alle parsen (parallel, 10 Worker)
python parser/fetch_fast.py           # ~10 Minuten für alles
```

## Die Vision: 3 Phasen

### Phase 1: Archiv ✅ (fertig)
Alle Bundesgesetze als durchsuchbares Markdown in Git.

### Phase 2: Bürgerbeteiligung (geplant)
- Paragraph-Level-Kommentare
- Öffentliche API für Forscher und Journalisten
- Meinungsvergleich pro Gesetz (Wahl-O-Mat-Stil)

### Phase 3: Lobbying-Transparenz (geplant)
- Integration mit dem Lobbyregister (lobbyregister.bundestag.de)
- NLP-Vergleich: Lobbying-Positionspapiere ↔ Amendments
- Timeline-Analyse: Meeting am Montag → Amendment am Freitag = automatisches Flag
- Dashboard: "Meistbeeinflusste Gesetze des Monats"

## Datenquellen

- **gesetze-im-internet.de** — Alle Bundesgesetze (BMJV)
- **lobbyregister.bundestag.de** — Bundeslobbyregister (ab Phase 3)

## Tech Stack

- **Parser**: Python + lxml + requests
- **Viewer**: React + TypeScript + Vite + Tailwind + Fuse.js
- **Daten**: Markdown in Git (versioniert, diffbar, durchsuchbar)

## Verwandte Projekte

- **[offenegesetze.de](https://offenegesetze.de)** — Bundesgesetzblatt durchsuchbar (OKF)
- **[bundesgit](https://github.com/bundestag/gesetze)** — Mirror (abandoned)
- **[La Fabrique de la Loi](https://lafabriquedelaloi.fr)** — Französische Amendment-Verfolgung

## Lizenz

MIT — Nutze es, forke es, verbessere es. Demokratie sollte Open Source sein.
