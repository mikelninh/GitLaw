# GitLaw 📝

**Version control for legislation.** Every change tracked. Every author visible. Every lobbying influence traceable.

## The Problem

Laws are changed behind closed doors. Nobody knows who inserted which clause, which lobbyist influenced which paragraph, or what changed between version 1 and version 47. Citizens, journalists, and even other legislators can't follow what's happening.

Germany has 1,700 federal laws and 50,000 regulations. When they change, the changes are buried in legal jargon and published in formats nobody can read.

## The Solution

Treat laws like code. Use version control — the same technology that powers every piece of software on earth — to make legislation transparent, traceable, and participatory.

**Three pillars:**

### 1. Track Every Change
Every law as a plain-text file. Every amendment tracked with author, timestamp, and justification. Automatic diffs show exactly what changed — word by word.

### 2. Let Citizens Comment
Anyone can comment on any paragraph — like code review. Aggregated feedback shows which clauses are controversial and which have public support.

### 3. Trace Lobbying Influence
Link the lobbying register to legislative changes. When a lobbyist meets a legislator on Monday and an amendment appears on Friday that mirrors the lobbyist's position paper — automatic flagging. Not a ban. Just sunlight.

> "Sunlight is the best disinfectant." — Louis Brandeis

## Does This Exist?

| Project | What it does | What's missing |
|---------|-------------|---------------|
| **bundesgit** | Mirrors German federal laws on GitHub | No change tracking, no attribution, no citizen participation |
| **offenegesetze.de** | Makes the Bundesgesetzblatt searchable | Read-only, no version control, no lobbying link |
| **La Fabrique de la Loi** (France) | Tracks amendments through legislative process | No citizen comments, no lobbying tracing |
| **g0v** (Taiwan) | Civic tech alternative to gov sites | Prototyped law tracking but not adopted officially |
| **GitLaw** (this project) | All of the above — combined | **This is what we're building** |

## How It Works

```
            ┌─────────────────────┐
            │   Bundesgesetzblatt  │  ← Official source
            └──────────┬──────────┘
                       │ parse
            ┌──────────▼──────────┐
            │   GitLaw Repository  │  ← Plain-text laws in Git
            │   (version control)  │
            └──────────┬──────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐   ┌─────▼─────┐  ┌────▼────┐
   │  Diffs  │   │ Comments  │  │ Lobby   │
   │  (what  │   │ (citizen  │  │ Trace   │
   │ changed)│   │ feedback) │  │ (who    │
   │         │   │           │  │ pushed  │
   └─────────┘   └───────────┘  │ what?)  │
                                └─────────┘
```

## Example

**§ 185 StGB — Beleidigung (Insult)**

```diff
- Die Beleidigung wird mit Freiheitsstrafe bis zu einem Jahr
- oder mit Geldstrafe bestraft.
+ Die Beleidigung wird mit Freiheitsstrafe bis zu zwei Jahren
+ oder mit Geldstrafe bestraft.
```

**Change metadata:**
- Author: Dr. Marco Buschmann (FDP), Bundesjustizminister
- Date: 2024-08-15
- Justification: "Anpassung an die gestiegene Bedeutung digitaler Beleidigungen"
- Lobbying link: Meeting with BDK (Bund Deutscher Kriminalbeamter) on 2024-07-22 — position paper requested higher penalties

**Citizen comments:** 47 comments, 72% positive, concerns about freedom of speech from 3 legal academics.

## Tech Stack

- **Git** for version control (the same tool used by 100 million developers)
- **Markdown** for law text (human-readable, machine-parseable)
- **NLP** for comparing lobbying documents with amendments (text similarity)
- **Web interface** for citizen comments and diff visualization

## Roadmap

### Phase 1: Mirror (Now)
- [ ] Parse all current German federal laws from gesetze-im-internet.de
- [ ] Convert to clean Markdown files
- [ ] Initialize Git repository with full history
- [ ] Build web viewer with diff visualization

### Phase 2: Citizen Layer (Q3 2026)
- [ ] Add paragraph-level commenting
- [ ] Public API for researchers and journalists
- [ ] Embed Wahl-O-Mat-style opinion matching per law

### Phase 3: Lobbying Trace (Q1 2027)
- [ ] Integrate with Lobbyregister (lobbyregister.bundestag.de)
- [ ] NLP pipeline: compare position papers → amendments
- [ ] Timeline analysis: meeting date → amendment date correlation
- [ ] Public dashboard: "Most influenced laws of the month"

### Phase 4: Live Tracking (2027+)
- [ ] Real-time tracking of new Gesetzentwürfe as they enter committee
- [ ] Notification system: "A law you commented on was just amended"
- [ ] Integration with Deutschland 2030 platform

## Why This Matters

Democracy requires informed citizens. You can't be informed about laws you can't read, changes you can't see, and influences you can't trace.

GitLaw doesn't tell people what to think. It shows them what happened. The rest is up to democracy.

## Data Sources

- **gesetze-im-internet.de** — All federal laws, maintained by BMJV
- **Bundesgesetzblatt** (via offenegesetze.de) — Official publication of legal changes
- **lobbyregister.bundestag.de** — Federal lobbying register (since 2022)
- **Bundestag Drucksachen** — Parliamentary documents, bills, amendments

## Contributing

This is open source. PRs welcome. The most impactful contribution right now: help parsing German legal text into clean Markdown.

## License

MIT — Use it, fork it, improve it. Democracy should be open source.

## Related

- [Deutschland 2030](https://github.com/mikelninh/deutschland-2030) — The broader reform platform
- [offenegesetze.de](https://offenegesetze.de) — Making the Bundesgesetzblatt accessible
- [bundesgit](https://github.com/bundestag/gesetze) — Mirror of German laws
- [La Fabrique de la Loi](https://lafabriquedelaloi.fr) — French amendment tracking
- [Pol.is](https://pol.is) — Consensus finding tool (used by Taiwan's vTaiwan)
