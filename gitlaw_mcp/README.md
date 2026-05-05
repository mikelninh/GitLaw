# GitLaw MCP Server

> **MCP server that exposes 5,936 German laws + RAG search + citation verification as tools any LLM client can call.**

Built on top of the existing GitLaw RAG pipeline (FAISS vectorstore, OpenAI embeddings, paragraph-level chunking of all federal German laws).

---

## Why this exists

LLMs hallucinate German law all the time. They confidently cite `§ 999 StGB` (doesn't exist), invent paragraph titles, or swap statutes. This server gives any MCP-compatible client (Claude Desktop, Cursor, Continue, custom agents) a set of **verifiable** legal tools:

- **Semantic search** across all 5,936 laws → grounded retrieval
- **Citation verification** → returns *the actual paragraph text* if the citation exists, or `verified: false` with a reason if not
- **Exact lookup** by abbreviation + paragraph
- **Law enumeration** for discovery

The result: an LLM connected to this server can ground every legal claim in the real German Bundesrecht corpus, with a structured "I checked" / "I couldn't verify" signal on every citation.

---

## Tools exposed

| Tool | Purpose | Example |
|---|---|---|
| `search_laws(query, limit=5)` | Semantic search across all paragraphs (FAISS, OpenAI embeddings) | `"Beleidigung im Internet"` |
| `verify_citation(citation)` | Parse `§ 185 StGB` style strings, return actual text or `verified: false` with reason | `"§ 185 Abs. 1 StGB"` |
| `lookup_paragraph(abbr, paragraph)` | Exact lookup with structured input | `("StGB", "263a")` |
| `list_laws(filter=None, limit=50)` | Enumerate available laws (4,852+ unique abbreviations indexed) | `filter="bgb"` |

Plus the resource `gitlaw://law/{abbreviation}` returning the full markdown content of a law.

---

## Anti-hallucination demo

```
verify_citation("§ 185 StGB")
→ {
    "verified": true,
    "law": { "name": "Strafgesetzbuch", "abbreviation": "StGB" },
    "paragraph": {
      "number": "§ 185",
      "title": "Beleidigung",
      "text": "Die Beleidigung wird mit Freiheitsstrafe bis zu einem Jahr ..."
    },
    "source": "laws/stgb.md"
  }

verify_citation("§ 999 StGB")
→ {
    "verified": false,
    "reason": "paragraph_not_found",
    "law": { "name": "Strafgesetzbuch", "abbreviation": "StGB" },
    "hint": "StGB exists, but '§ 999' was not found in the corpus."
  }

verify_citation("§ 185 XYZ")
→ {
    "verified": false,
    "reason": "law_not_found",
    "law_abbreviation_searched": "XYZ"
  }
```

---

## Install

Requires Python 3.10+.

From the GitLaw repo root:

```bash
pip install -e gitlaw_mcp
# or with uv:
uv pip install -e gitlaw_mcp
```

Then verify:

```bash
gitlaw-mcp --help                    # see CLI options (FastMCP defaults)
python -m gitlaw_mcp.server          # start the server (stdio)
```

`search_laws` requires `OPENAI_API_KEY` (used for query embeddings). The other three tools work entirely offline against the local Markdown corpus.

The `rag/vectorstore/` directory must exist. If not:

```bash
python rag/build_vectorstore.py      # builds FAISS index, ~$0.50, ~10 min
```

---

## Wire it into Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or the equivalent on your OS:

```json
{
  "mcpServers": {
    "gitlaw": {
      "command": "python",
      "args": ["-m", "gitlaw_mcp.server"],
      "cwd": "/absolute/path/to/gitlaw",
      "env": {
        "OPENAI_API_KEY": "sk-..."
      }
    }
  }
}
```

Restart Claude Desktop. You should see a 🔧 indicator and the four `gitlaw` tools available in any conversation.

### Cursor / Continue / generic MCP clients

Most MCP clients accept a similar `command + args + cwd` config. Use the `python -m gitlaw_mcp.server` entry point.

---

## Try it

In Claude Desktop, after wiring up the server:

> *"Was sagt § 185 StGB zu Beleidigung im Internet? Verifiziere bitte die Zitate."*

Claude will call `search_laws` for context, then `verify_citation` on each citation it produces, and clearly mark which ones are verified vs. unverified.

> *"Welche Gesetze haben die Abkürzung 'BGB'?"*

Calls `list_laws(filter='bgb')` and returns the three matches.

> *"Existiert eigentlich § 999 StGB?"*

Calls `verify_citation('§ 999 StGB')` and reports it does not exist.

---

## Architecture

```
gitlaw_mcp/
├── server.py        — FastMCP server, 4 @tool decorators + 1 @resource
├── citations.py     — German legal-citation regex parser + paragraph extractor
├── pyproject.toml
└── README.md

  reuses:
  laws/             — 5,936 markdown files (one per law, paragraphs as ### headings)
  rag/vectorstore/  — FAISS index (paragraph-level chunks, OpenAI embeddings)
```

The server is **stateless across requests** but loads:
- the abbreviation→file index lazily on first call (~50ms scan of `laws/*.md` headers)
- the FAISS vectorstore lazily on first `search_laws` call (~2-3s, ~150MB RAM)

The other tools (`verify_citation`, `lookup_paragraph`, `list_laws`) are pure file-reads against the markdown corpus — no API key needed, sub-millisecond per call.

---

## Citation parser

`citations.py` handles common German legal citation formats:

| Input | Parsed |
|---|---|
| `§ 185 StGB` | StGB / § 185 |
| `§185 StGB` | StGB / § 185 |
| `§ 185 Abs. 1 StGB` | StGB / § 185 (subsection: "Abs. 1") |
| `§ 185 I StGB` | StGB / § 185 (subsection: "I", Roman numeral) |
| `§ 263a StGB` | StGB / § 263a (paragraph with letter suffix) |
| `Art. 5 GG` | GG / Art 5 |
| `Art 5 Abs. 1 S. 1 GG` | GG / Art 5 (subsection: "Abs. 1 S. 1") |

The Roman-numeral sub-pattern uses a lookahead so `X` in `XYZ` is not mistaken for a Roman 10. Letter-suffixed paragraphs (`263a`, `129b`) are supported.

---

## Roadmap

- [ ] HTTP/SSE transport (currently stdio only) — for hosted clients
- [ ] Optional citation graph: extract cross-references from paragraph text → expose as `find_related(citation)` tool
- [ ] Eval harness: a fixed set of 100 hand-labelled citation-verification cases, run on every commit
- [ ] Schweizer / Österreichischer Rechtskorpus (already partially in `laws_*.py` data files in the parent repo)

---

## License

MIT. Part of the [GitLaw](../README.md) project — open infrastructure for digital legal services in Germany.
