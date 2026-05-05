"""
GitLaw MCP Server — expose the GitLaw legal corpus as MCP tools.

Built on top of the existing FAISS vectorstore (rag/vectorstore/) and the
5,936 German law markdown files (laws/*.md).

Tools:
    search_laws       — semantic search across all paragraphs (RAG retrieval, no LLM)
    verify_citation   — parse a citation string and confirm it exists, return text
    lookup_paragraph  — exact lookup by abbreviation + paragraph number
    list_laws         — enumerate available laws (full list or filtered)

Resource:
    gitlaw://law/{abbr} — full markdown content of a law

Run locally:
    uv run python -m mcp.server
or:
    python -m mcp.server

Hook into Claude Desktop / Cursor / any MCP client via stdio — see README.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any

# Allow `python -m mcp.server` from repo root and `uv run`
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from mcp.server.fastmcp import FastMCP  # type: ignore

from gitlaw_mcp.citations import (  # type: ignore
    extract_paragraph,
    find_law_file,
    get_abbr_index,
    get_law_metadata,
    parse_citation,
)

LAWS_DIR = ROOT / "laws"
VECTORSTORE_DIR = ROOT / "rag" / "vectorstore"

mcp = FastMCP("gitlaw")

# ---------------------------------------------------------------------------
# Lazy vectorstore (only loaded when search_laws is first called)
# ---------------------------------------------------------------------------

_vectorstore = None


def _get_vectorstore():
    global _vectorstore
    if _vectorstore is not None:
        return _vectorstore

    if not VECTORSTORE_DIR.exists():
        raise RuntimeError(
            f"Vector store not found at {VECTORSTORE_DIR}. Run: python rag/build_vectorstore.py"
        )
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError(
            "OPENAI_API_KEY env var is required for semantic search "
            "(text-embedding-3-small embeddings)."
        )

    # Lazy imports — keep CLI tools (verify_citation, lookup_paragraph, list_laws)
    # working without OpenAI dependency installed.
    from langchain_community.vectorstores import FAISS
    from langchain_openai import OpenAIEmbeddings

    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    _vectorstore = FAISS.load_local(
        str(VECTORSTORE_DIR), embeddings, allow_dangerous_deserialization=True
    )
    return _vectorstore


# ---------------------------------------------------------------------------
# Tools
# ---------------------------------------------------------------------------


@mcp.tool()
def search_laws(query: str, limit: int = 5) -> list[dict[str, Any]]:
    """
    Semantic search across all 5,936 German laws (paragraph-level).

    Returns the most relevant paragraphs for a natural-language query, with
    metadata (law name, abbreviation, section, source file) — useful as
    grounding context for downstream reasoning. Embeddings: OpenAI
    text-embedding-3-small. Retrieval only — no LLM call.

    Args:
        query: Natural-language question or topic, e.g. "Beleidigung im Internet"
        limit: How many top matches to return (default 5, max 20)

    Returns:
        List of {law, abbreviation, section, chapter, text, file} dicts.
    """
    if not query or not query.strip():
        return []
    limit = max(1, min(20, int(limit)))
    vs = _get_vectorstore()
    docs = vs.similarity_search(query, k=limit)
    return [
        {
            "law": d.metadata.get("law", ""),
            "abbreviation": d.metadata.get("abbreviation", ""),
            "section": d.metadata.get("section", ""),
            "chapter": d.metadata.get("chapter", ""),
            "text": d.page_content,
            "file": d.metadata.get("file", ""),
        }
        for d in docs
    ]


@mcp.tool()
def verify_citation(citation: str) -> dict[str, Any]:
    """
    Verify whether a German legal citation exists and return its actual text.

    The point of this tool is anti-hallucination: an LLM can claim "§ 999 StGB
    says X" — this tool will return verified=False for the made-up paragraph,
    or verified=True with the real text for genuine citations.

    Accepted formats:
        § 185 StGB
        § 185 Abs. 1 StGB
        Art. 5 GG
        Art 5 Abs. 1 S. 1 GG

    Args:
        citation: Citation string

    Returns:
        Dict with:
          verified (bool), citation_parsed, law (name+abbr), paragraph
          (number, title, text), source (file). On failure: reason +
          best-effort suggestions.
    """
    parsed = parse_citation(citation)
    if not parsed:
        return {
            "verified": False,
            "reason": "could_not_parse",
            "input": citation,
            "hint": "Expected format: '§ 185 StGB' or 'Art. 5 GG'.",
        }

    law_path = find_law_file(parsed.abbreviation)
    if not law_path:
        return {
            "verified": False,
            "reason": "law_not_found",
            "input": citation,
            "law_abbreviation_searched": parsed.abbreviation,
            "available_count": len(get_abbr_index()),
        }

    paragraph = extract_paragraph(law_path, parsed.marker, parsed.number)
    if not paragraph:
        return {
            "verified": False,
            "reason": "paragraph_not_found",
            "input": citation,
            "law": get_law_metadata(law_path),
            "source": law_path.name,
            "hint": (
                f"{parsed.abbreviation} exists, but '{parsed.marker} {parsed.number}' "
                "was not found in the corpus. The paragraph may have been repealed, "
                "renumbered, or the citation may be wrong."
            ),
        }

    return {
        "verified": True,
        "citation_parsed": {
            "marker": parsed.marker,
            "number": parsed.number,
            "subsection": parsed.subsection,
            "abbreviation": parsed.abbreviation,
        },
        "law": get_law_metadata(law_path),
        "paragraph": {
            "number": paragraph.number,
            "title": paragraph.title,
            "text": paragraph.text,
        },
        "source": f"laws/{law_path.name}",
    }


@mcp.tool()
def lookup_paragraph(abbreviation: str, paragraph: str) -> dict[str, Any]:
    """
    Exact lookup by law abbreviation and paragraph number — faster than
    verify_citation when you already have structured input.

    Args:
        abbreviation: Law abbreviation, e.g. "StGB", "GG", "BGB"
        paragraph: Paragraph number, e.g. "§ 185", "185", "Art 5", "5"

    Returns:
        Same shape as verify_citation on success.
    """
    law_path = find_law_file(abbreviation)
    if not law_path:
        return {
            "verified": False,
            "reason": "law_not_found",
            "law_abbreviation_searched": abbreviation,
        }

    # Normalise paragraph input — accept "§ 185", "185", "Art 5", "5"
    p = paragraph.strip()
    marker = "§"
    if p.lower().startswith("art"):
        marker = "Art"
        p = p[3:].lstrip(". ").strip()
    elif p.startswith("§"):
        p = p[1:].strip()

    found = extract_paragraph(law_path, marker, p)
    if not found:
        return {
            "verified": False,
            "reason": "paragraph_not_found",
            "law": get_law_metadata(law_path),
            "source": law_path.name,
        }
    return {
        "verified": True,
        "law": get_law_metadata(law_path),
        "paragraph": {
            "number": found.number,
            "title": found.title,
            "text": found.text,
        },
        "source": f"laws/{law_path.name}",
    }


@mcp.tool()
def list_laws(filter: str | None = None, limit: int = 50) -> dict[str, Any]:
    """
    List laws available in the GitLaw corpus.

    Args:
        filter: Optional substring (case-insensitive) to filter by abbreviation
                or filename, e.g. "stgb" matches StGB, StGB-EG, etc.
        limit: Max results to return (default 50, the corpus has ~5,936 laws total)

    Returns:
        {total: int, returned: int, laws: [{abbreviation, file}]}
    """
    index = get_abbr_index()
    items = sorted(index.items())  # [(abbr, Path), ...]
    if filter:
        f = filter.lower()
        items = [(a, p) for a, p in items if f in a.lower() or f in p.name.lower()]
    limited = items[: max(1, min(500, int(limit)))]
    return {
        "total": len(index),
        "matched": len(items),
        "returned": len(limited),
        "laws": [{"abbreviation": a, "file": p.name} for a, p in limited],
    }


# ---------------------------------------------------------------------------
# Resource — full law text by abbreviation
# ---------------------------------------------------------------------------


@mcp.resource("gitlaw://law/{abbreviation}")
def get_law_text(abbreviation: str) -> str:
    """Return the full markdown content of a law by its abbreviation."""
    law_path = find_law_file(abbreviation)
    if not law_path:
        return f"# Law not found\n\nNo law with abbreviation '{abbreviation}'."
    return law_path.read_text(encoding="utf-8")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------


def main() -> None:
    mcp.run()


if __name__ == "__main__":
    main()
