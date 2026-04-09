# GitLaw ⚖️

**Alle 5.936 deutschen Bundesgesetze — durchsuchbar, AI-erklärbar, personalisiert, mit Musterbriefen.**

1,3 Mio. Zeilen Recht. 98.367 semantische Vektoren. 20 Musterbriefe. 6 Sprachen. Open Source.

**[Live →](https://mikelninh.github.io/gitlaw/)**

---

## Features

### Für Bürger
- 🔍 **Alle Gesetze durchsuchen** — Fuzzy + semantisch (FAISS, 98K Vektoren)
- 💡 **AI-Erklärungen** — 112 Paragraphen in einfacher Sprache (kostenlos)
- 💬 **Chat mit Folgefragen** — personalisiert für 12 Profile, 6 Sprachen
- 📝 **20 Musterbriefe** — Widerruf, Reklamation, Kündigung, DSGVO... ausfüllen → kopieren
- 📰 **Gesetz des Tages** — 20 kuratierte spannende Gesetze
- 🏠 **Themen-Buttons** — Miete, Arbeit, Steuern, Familie, Rente, Tierschutz...

### Für Juristen
- 📊 **Gesetzesstand** — Letzte Änderung sichtbar
- 🔗 **Paragraph-Verlinkung** — § 573 BGB = klickbarer Link
- 📄 **PDF-Export** + 🔗 **Mandanten-Sharing** + ⭐ **Favoriten**
- 📋 **Reform-Diffs** — Vorher/Nachher bei Gesetzesreformen

### Barrierefreiheit
- **A-/A+** Schriftgröße · 🌙 **Darkmode** · 🎯 **Themen-Buttons** statt Tippen

---

## Zahlen

| Metrik | Stand |
|--------|-------|
| Gesetze | **5.936** |
| Zeilen | **1.303.451** |
| FAISS-Vektoren | **98.367** |
| Musterbriefe | **20** (16 frei, 4 Premium) |
| Sprachen | **6** (DE, Leicht, TR, AR, EN, UK) |
| Personas | **12** × 6 FAQs = **72** |
| Aktualisierung | **Wöchentlich automatisch** |

## Top Musterbriefe

| Brief | Suchen/Mo |
|-------|----------|
| 🛒 Widerruf Online-Kauf | 40K |
| 🔧 Reklamation | 25K |
| 🏠 Kündigung Mietvertrag | 22K |
| 🚗 Einspruch Bußgeld | 20K |
| 💧 Widerspruch Nebenkosten | 18K |
| + 15 weitere | 150K+ |

## Monetarisierung

**Kostenlos**: Alle Gesetze, AI-Erklärungen, 16 Musterbriefe, Chat, 6 Sprachen.

**Premium €4,99/Mo**: 4 Extra-Briefe + unbegrenzte AI + Favoriten-Sync + Beratungsstellen.

---

## Tech

| Stack | |
|-------|---|
| Frontend | React + TypeScript + Vite + Tailwind |
| RAG | LangChain + FAISS + OpenAI Embeddings |
| API | FastAPI |
| AI | Claude Opus 4.6 (Erklärungen) + GPT-4o-mini (Chat) |
| DB (geplant) | Supabase (PostgreSQL + Auth) |
| Updates | GitHub Actions |

## Lokal starten

```bash
cd viewer && npm install && npm run dev          # Viewer
pip install langchain langchain-openai faiss-cpu  # RAG deps
python rag/build_vectorstore.py                   # Vector Store
python -m uvicorn rag.server:app --port 8001      # API
```

## Roadmap

- [x] 5.936 Gesetze + 98K Vektoren + Semantische Suche
- [x] AI-Erklärungen + Chat + 12 Personas + 6 Sprachen
- [x] 20 Musterbriefe + Premium-Paywall
- [x] PDF + Share + Favoriten + Paragraph-Links
- [x] Gesetzesstand + Barrierefreiheit + Darkmode
- [x] Gesetz des Tages + Reform-Diffs
- [x] Auto-Updates + RAG API + Supabase Schema
- [ ] Supabase UI + Verordnungen + BGH-Leitsätze

## User Ratings: 2.1★ → 3.9★

**[Deutschland 2030](https://github.com/mikelninh/deutschland-2030)** — 9 Reformen für Deutschland

MIT Lizenz — Demokratie sollte Open Source sein.

## Ökosystem — Digitale Demokratie

Dieses Projekt ist Teil eines Open-Source-Ökosystems für digitale Demokratie:

| Projekt | Frage | Link |
|---------|-------|------|
| **FairEint** | Was sollte Deutschland anders machen? | [GitHub](https://github.com/mikelninh/faireint) · [Live](https://mikelninh.github.io/faireint/) |
| **GitLaw** | Was steht im Gesetz? | [GitHub](https://github.com/mikelninh/gitlaw) · [Live](https://mikelninh.github.io/gitlaw/) |
| **Public Money Mirror** | Wohin fließt das Steuergeld? | [GitHub](https://github.com/mikelninh/Public-Money-Mirror) |
| **SafeVoice** | Wer wird online angegriffen? | [GitHub](https://github.com/mikelninh/safevoice) |

Alle Projekte: [github.com/mikelninh](https://github.com/mikelninh) · Unterstützen: [Ko-fi](https://ko-fi.com/mikel777) · [GitHub Sponsors](https://github.com/sponsors/mikelninh)

