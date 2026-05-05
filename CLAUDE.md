# GitLaw — Project Guide for Claude Code

> Open infrastructure for digital legal services in Germany. Two tiers (Bürger free + Pro for lawyers) over the same 5,936-law corpus, plus a Model Context Protocol server that exposes everything to any LLM client.

---

## Architecture map

```
gitlaw/
├── viewer/                  React 19 + TS + Vite + Tailwind 4 — both Bürger and Pro UIs
│   ├── public/laws/         5,936 markdown files (single source of truth, served via GH Pages)
│   ├── public/data/         static JSON: leitsätze, citation-graph shards, etc.
│   └── src/pro/             Pro tier (lawyer-facing): ProResearch, ProCases, ProTemplates, etc.
├── api/                     Vercel Serverless Functions (TypeScript)
│   ├── ask-pro.ts           OpenAI gpt-4o-mini Structured-Output endpoint
│   ├── pro/                 Pro-specific (entities, audit, etc.)
│   └── rechtsprechung/      OpenLegalData proxy with Upstash Redis cache
├── rag/                     Python — FAISS vectorstore over all paragraphs
│   ├── server.py            FastAPI exposing query endpoint
│   ├── build_vectorstore.py one-time build (~$0.50 OpenAI embeddings, ~10 min)
│   └── vectorstore/         FAISS index (gitignored)
├── parser/                  Python — fetch + parse + normalize gesetze-im-internet.de
├── gitlaw_mcp/              MCP server — 6 tools (search, verify, lookup, list, related, hybrid)
│   ├── server.py            FastMCP, stdio + SSE transports
│   ├── citations.py         Citation parser + verifier
│   ├── graph_builder.py     Extract cross-references → citation graph
│   ├── tests/               53 hand-labelled cases, 100% pass-rate in CI
│   ├── Dockerfile           multi-stage, stdio mode (Claude Desktop)
│   ├── Dockerfile.fly       multi-stage, SSE mode (Fly.io hosted)
│   └── ARCHITECTURE.md      Cloud-migration doc (AWS / Azure paths)
├── deploy/aws/              Terraform IaC — VPC + ECS Fargate + ALB + EFS + Secrets + WAF
├── fly.toml                 Fly.io deploy (Frankfurt SSE)
├── laws/                    The corpus — 5,936 .md files, paragraphs as `### § N — Title`
├── scripts/                 Eval / sanity scripts (citizen intent, agent flows)
└── portfolio.html           Bewerbungs-Page (JD-mapping → repo paths)
```

## Two products under one repo

1. **GitLaw** (free, Bürger) — live at gitlaw.app / mikelninh.github.io/gitlaw — AGPL-3.0
2. **GitLaw Pro** (€19-149/mo, lawyers) — live at gitlaw-xi.vercel.app/#/pro — beta invite-gated, localStorage by default

The two share the corpus + RAG + viewer code. **Don't split into separate repos** — diverging would multiply maintenance.

## Naming conventions (don't break these)

- **Law file IDs:** lowercase, snake_case in filenames (`stgb.md`, `sgb_5.md`, `aufenthg_2004.md`). Some files have date suffixes — that's intentional, the corpus uses them
- **Law abbreviations in code:** UPPERCASE in the abbr index (`STGB`, `BGB`, `SGB 5`), original-case for display (`StGB`, `BGB`)
- **Paragraph headings in corpus:** `### § N — Title` (StGB-style) or `### Art N` (GG-style). The Title after `—` is optional
- **CSS:** Tailwind classes, custom variables `var(--color-*)` for theming, no inline styles unless needed
- **Tests:** Python via pytest in `tests/`; no vitest/jest in viewer yet (would be nice to add)

## Anti-hallucination is the product

The single most important design principle: **never let the LLM cite a paragraph that doesn't exist.**

- All citation verification goes through `verify_citation()` in `gitlaw_mcp/citations.py`
- Failure modes are *structured*: `law_not_found`, `paragraph_not_found`, `repealed`, `could_not_parse`
- Repealed-detection covers single (`### § 5a — (weggefallen)`) AND range (`### §§ 2 bis 3f — (weggefallen)`) markers
- The 53-case eval suite in `gitlaw_mcp/tests/cases.json` is the contract — keep at 100% pass-rate

When adding new statutes or changing the regex: **run `python -m gitlaw_mcp.tests.test_eval` before commit**.

## Pro-specific conventions

- **Citation type** in `viewer/src/pro/types.ts` has `verificationReason` enum — keep in sync with `verify.ts`
- **Pro routing**: HashRouter (`/#/pro/...`) for GH Pages compatibility
- **Pro storage**: localStorage by default; cloud-sync via Upstash Frankfurt only when tenant has signed Pro session
- **DSGVO-Anonymizer**: 14 PII patterns + 50-token whitelist, runs **before** every LLM call
- **Audit log**: lückenlos, exportable as PDF (BHV-relevant)
- **Pilot users**: bao, rubin, werner, jasmin — each has a Welcome page at `/#/{slug}` with own branding/preset

## Specific lawyer-side patterns

- **Word .docx export** via `docx` npm package — mirror the `pdf.ts` API exactly when adding letter types
- **Verwandte Paragraphen** drawer panel reads `/data/citation-graph/{lawId}.json` — graceful fail if shard missing
- **CSV import** for cases auto-detects DATEV/RA-Micro/advoware columns — see `csv-import.ts`

## What NOT to do here

- ❌ Don't add a vitest setup just to run 1 test — keep `viewer/` tooling lean
- ❌ Don't deploy laws/ files via Vercel — they live on GitHub Pages, single source of truth
- ❌ Don't bake the FAISS vectorstore into Docker images — bind-mount or regenerate
- ❌ Don't touch BAO_*.md or pilot-specific docs without checking with me
- ❌ Don't introduce a backend framework (Django, Flask) — Vercel functions + Python rag/ are the boundary
- ❌ Don't hardcode OPENAI_API_KEY anywhere — env var only, secrets only in Secrets Manager / Fly secrets
- ❌ Don't mock the citation corpus in tests — `gitlaw_mcp/tests/test_eval.py` runs against real `laws/*.md`

## Common workflows

- **Add a new law abbreviation alias:** edit `viewer/src/pro/verify.ts` `LAW_ABBREV_MAP`
- **Add a citation eval case:** append to `gitlaw_mcp/tests/cases.json`
- **Rebuild citation graph:** `python -m gitlaw_mcp.graph_builder` — writes to `gitlaw_mcp/data/` AND `viewer/public/data/citation-graph/`
- **Test the MCP server end-to-end:** `python -m gitlaw_mcp.demo` (no API key needed for 4/6 tools)
- **Local dev viewer:** `cd viewer && npm run dev`
- **Local dev RAG server:** `uvicorn rag.server:app --port 8001`
- **Deploy MCP to Fly.io:** `flyctl deploy` (after `fly auth login` + `fly secrets set OPENAI_API_KEY=...`)

## CI

`.github/workflows/mcp-ci.yml` runs three jobs in parallel on every push touching `gitlaw_mcp/` or `laws/`:
- **smoke** — install + graph build + eval (53 cases)
- **lint** — ruff check + format + mypy
- **docker** — multi-stage build with BuildKit cache, then in-image demo

Pass-rate badge in `gitlaw_mcp/README.md` reflects the eval suite.

## Pilot user reality (Bao)

Bao is a real-friend Vietnamese-German lawyer testing GitLaw Pro at `/#/bao`. His feedback shapes every Pro decision. When I'm working on Pro features, ask: *"would Bao notice and care about this on his next test session?"* — if no, deprioritize.

## See also

- [`portfolio.html`](portfolio.html) — JD-mapping for Fieldfisher X application
- [`gitlaw_mcp/README.md`](gitlaw_mcp/README.md) — MCP server docs + Claude Desktop setup
- [`gitlaw_mcp/ARCHITECTURE.md`](gitlaw_mcp/ARCHITECTURE.md) — cloud-migration plan
- [`deploy/aws/README.md`](deploy/aws/README.md) — Terraform-driven AWS deployment
- [`AGENTS.md`](AGENTS.md) — repo-priorities and collaboration style
