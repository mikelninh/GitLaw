---
name: add-new-law-to-corpus
description: Use whenever Mikel needs to add a German law to the GitLaw corpus that isn't already there. Handles the full pipeline — fetch from gesetze-im-internet.de, parse to markdown, drop into laws/, rebuild FAISS vectorstore, regenerate the citation graph + per-law shards, add eval cases, run CI, commit. Triggers on phrases like "add law X to corpus", "neues Gesetz X einbauen", "missing law in corpus", or whenever search_laws returns no hits for an obviously-real statute.
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# Add New Law to GitLaw Corpus

End-to-end pipeline for ingesting a missing German law into the corpus, the FAISS index, the citation graph, the per-law viewer shards, and the eval harness — without breaking existing assertions.

## When to invoke

- "Add NetzDG to the corpus" / "Wir haben Gesetz X nicht im Korpus, bitte ergänzen"
- `verify_citation('§ 5 LawXYZ')` returns `law_not_found` and Mikel confirms the law actually exists
- `list_laws(filter='somelaw')` returns no match for a statute Mikel cites
- New legislation enacted (BGBl) that should be picked up before the weekly auto-update runs
- Multi-jurisdiction expansion: same protocol but pointing at Swiss / Austrian source

## Prerequisites — verify these before doing anything

```bash
cd /Users/mikel/gitlaw

# 1. Python environment available
command -v python3 || echo "MISSING: python3"

# 2. The parser deps are installed (lxml, requests)
python3 -c "import lxml, requests" 2>&1 | grep -i error && echo "MISSING: pip install -r parser/requirements.txt"

# 3. The corpus dir exists
[ -d laws ] || echo "MISSING: laws/ directory — wrong working dir?"

# 4. The vectorstore exists (otherwise the rebuild step is much slower + costs ~$0.50)
[ -f rag/vectorstore/index.faiss ] || echo "WARN: no existing vectorstore — full rebuild will run"

# 5. Working tree is clean (so we don't conflate this with other in-progress work)
git status --short | grep -q . && echo "WARN: uncommitted changes — consider stashing first"
```

If anything is missing or the user wants to proceed despite warnings, ask before continuing.

## Decision tree — where to source the law

### Path A · Standard German federal law (most common)

Source: **gesetze-im-internet.de** (BMJV, public domain XML format).

Find the URL: search the toc at https://www.gesetze-im-internet.de/aktuell.html or use the existing `parser/law_index.json` if it's already known.

```bash
# Check if it's in the existing index (might have been skipped):
grep -i "abbreviation.*XYZG" parser/law_index.json | head
```

If found → use the `xml_url` field. If not → resolve manually (the URL is usually `https://www.gesetze-im-internet.de/{slug}/xml.zip`).

### Path B · Specific older statute / amendment

Some laws (`gewschg_neu`, `arbzg_2003`, etc.) have date-suffixed slugs. Use `grep -l "^\*\*Abkürzung:\*\* {ABBR}" laws/*.md` to see if a variant already exists under a different filename — avoid creating duplicates.

### Path C · Multi-jurisdiction (Schweiz / Österreich)

This skill is **not** designed for that — the parser only handles BMJV XML. If the user wants Swiss/Austrian, stop and surface that the skill needs an extension first.

## Pipeline — execute these in order

### Step 1 · Fetch + parse the XML to markdown

```bash
cd /Users/mikel/gitlaw

# Use the existing parse_law module — it's been battle-tested on 5,936 laws
python3 -c "
from parser.parse_law import process_law
url = '<XML URL from above>'
out = process_law(url, 'laws')
print(f'Wrote: {out}')
"
```

**Verify the output**:
```bash
# Confirm file was written + has the expected header structure
NEW_FILE='laws/<abbr>.md'
head -5 "$NEW_FILE"          # should show: # Title \n **Abkürzung:** XXX
grep -c '^### §' "$NEW_FILE" # paragraph count
```

If the abbreviation differs from filename (corpus uses `aabb 1977` etc.), keep the parser's choice — `find_law_file` handles the year-suffix prefix-match.

### Step 2 · Sanity-check the new file against the corpus convention

```bash
# Required headers at the top:
grep -E '^# |^\*\*Abkürzung:\*\*|^\*\*Ausfertigungsdatum:\*\*' "$NEW_FILE" | head -5

# Heading format must be: ### § N or ### Art N (StGB / GG style)
grep -E '^###\s+(§|Art)\s+\w' "$NEW_FILE" | head -5
```

If headings are malformed (e.g. `### 5` without `§`), the verifier won't find them. Fix in `parser/parse_law.py` rather than hand-patching the .md — keeps the pipeline reproducible.

### Step 3 · Rebuild the FAISS vectorstore (incremental if possible)

The `rag/build_vectorstore.py` script does a full rebuild. For one new law that's overkill but safer than partial-update bugs.

```bash
# First, check if the OPENAI_API_KEY is set — required for embeddings
[ -z "$OPENAI_API_KEY" ] && echo "MISSING: export OPENAI_API_KEY=sk-..."

# Full rebuild (~10 min, ~$0.50)
python3 rag/build_vectorstore.py

# OR if the script supports incremental, prefer that
# (verify by reading the script first — current state may have been extended)
```

Mikel doesn't want to spend $0.50 every time a single law is added. **If only one or two laws are added, suggest he batches** (e.g. wait until 5+ are queued) before running the rebuild.

### Step 4 · Rebuild the citation graph

```bash
python3 -m gitlaw_mcp.graph_builder
# Writes:
#   gitlaw_mcp/data/citation_graph.json (~32 MB, gitignored)
#   gitlaw_mcp/data/citation_graph_top.json
#   gitlaw_mcp/data/citation_graph_laws.json
#   viewer/public/data/citation-graph/<abbr>.json (per-law shard for Pro UI)
```

Confirm the new law is now in the graph:

```bash
python3 -c "
from gitlaw_mcp.citations import get_abbr_index
print('NEW_ABBR' in {k.upper() for k in get_abbr_index()})
"
```

### Step 5 · Add eval-harness cases

Open `gitlaw_mcp/tests/cases.json`. Add 2-4 cases for the new law:

```json
{"id": "real-NEWABBR-N",      "citation": "§ N NEWABBR",     "expected": {"verified": true},                                                    "category": "real-canonical"},
{"id": "halu-NEWABBR-9999",   "citation": "§ 9999 NEWABBR",  "expected": {"verified": false, "reason": "paragraph_not_found"},                  "category": "halluzination-paragraph"}
```

Pick at least one **real** paragraph that genuinely exists (cross-check against the .md file) and at least one **halluzinated** number that doesn't, to ensure the negative path also works.

### Step 6 · Run the eval

```bash
python3 -m gitlaw_mcp.tests.test_eval
```

Must show `failed: 0`. If anything fails:
- New real-citation case fails → corpus parsing issue, return to Step 2
- Existing case fails → the regex changes broke something, surface that as a regression

### Step 7 · Verify in the MCP server end-to-end

```bash
python3 -c "
import sys; sys.path.insert(0, '.')
from gitlaw_mcp.server import verify_citation, find_related_paragraphs
print(verify_citation('§ N NEWABBR'))
print(find_related_paragraphs('§ N NEWABBR'))
"
```

Both should return `verified: true` (or `found: true`) for a real paragraph.

### Step 8 · Update the README's `## 📊 Zahlen` section if needed

If the addition meaningfully changes corpus stats, update the Zahlen-Tabelle in the root `README.md`. Usually one law isn't worth it — but if you just added 50 SGB-related, refresh.

### Step 9 · Stage, commit, push

```bash
git add laws/<abbr>.md \
        gitlaw_mcp/tests/cases.json \
        gitlaw_mcp/data/citation_graph_top.json \
        gitlaw_mcp/data/citation_graph_laws.json \
        viewer/public/data/citation-graph/

# (Note: rag/vectorstore/ is gitignored — rebuild on each developer machine)

git commit -m "feat(corpus): add NEWABBR (Full Law Name)" \
           -m "<short description of what the law covers, why it was missing>" \
           -m "- N paragraphs added" \
           -m "- citation graph regenerated" \
           -m "- M new eval cases (verified + halluzinated)" \
           -m "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"

git push
```

The CI workflow `.github/workflows/mcp-ci.yml` will run automatically on push and re-verify the eval suite + Docker build. Watch it fail before declaring done.

## Common pitfalls

| Symptom | Likely cause | Fix |
|---|---|---|
| `verify_citation` returns `law_not_found` after adding | parse_law.py wrote the abbreviation in a non-standard format | Check `**Abkürzung:**` line in the new .md is on its own line, no extra whitespace |
| `verify_citation` returns `paragraph_not_found` for a paragraph that visibly exists in the .md | Heading uses `### 5` instead of `### § 5` | Re-run parser; or hand-fix in the .md as last resort |
| Graph build crashes with `OSError: too many open files` on large laws | Default ulimit too low | `ulimit -n 4096` then rerun |
| Eval suite fails on existing case after adding the law | The new abbreviation collides with a substring of an existing one | Check ABBR_BLOCKLIST in `gitlaw_mcp/citations.py` — may need to add a guard |
| Per-law shard not generated | abbreviation contains slashes or unusual chars | The `safe_name` sanitizer in `graph_builder.py:build_viewer_shards` handles this — check it ran |

## What NOT to do

- ❌ Don't hand-write the .md file — always go through `parse_law.py`. Keeps the format consistent.
- ❌ Don't commit `gitlaw_mcp/data/citation_graph.json` (32 MB) — it's gitignored, regenerate on demand.
- ❌ Don't skip the eval cases. The 53/53 contract is *the* anti-hallucination guarantee.
- ❌ Don't manually merge multiple law additions into one commit — keep commits per-law for traceability (unless you intentionally batched 5+).
- ❌ Don't run `build_vectorstore.py` casually — costs real money. Batch if possible.
- ❌ Don't add multi-jurisdiction laws via this skill — separate workflow needed (see `data/laws_*.py`).

## See also

- `parser/parse_law.py` — the canonical parser (don't rewrite, extend)
- `gitlaw_mcp/citations.py` — verification logic
- `gitlaw_mcp/graph_builder.py` — citation graph + per-law shards
- `gitlaw_mcp/tests/cases.json` — eval contract
- `.github/workflows/mcp-ci.yml` — CI that catches regressions
- `gitlaw_mcp/README.md` — MCP server docs
