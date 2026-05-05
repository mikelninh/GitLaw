"""
Parse and verify German legal citations against the GitLaw corpus.

Handles common citation formats:
    § 185 StGB                    → StGB / § 185
    §185 StGB                     → StGB / § 185
    § 185 Abs. 1 StGB             → StGB / § 185 (with subsection note)
    § 185 I StGB                  → StGB / § 185 (Roman numeral subsection)
    Art. 5 GG                     → GG  / Art 5
    Art 5 Abs. 1 S. 1 GG          → GG  / Art 5 (with subsection note)

The corpus stores paragraphs as `### § 185 — Beleidigung` (StGB style)
or `### Art 5` (GG style). We extract by matching that exact heading.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

LAWS_DIR = Path(__file__).parent.parent / "laws"

# Citation regex — captures: marker (§ or Art), paragraph number, subsection bits, law abbreviation
# Examples that should match:
#   § 185 StGB
#   §185 Abs. 1 StGB
#   Art. 5 Abs. 1 S. 1 GG
#   Art 5 GG
CITATION_RE = re.compile(
    r"""
    (?P<marker>§|Art\.?)\s*                              # § or Art / Art.
    (?P<number>\d+[a-z]?)                                  # paragraph number, optional letter (e.g. 263a)
    (?P<sub>                                               # optional, repeatable subsection chain
        (?:\s+(?:Abs\.?\s*\d+                              #   Abs. 1
                 |[IVX]+(?=[\s,.])                          #   Roman numeral (lookahead: must be followed by sep)
                 |S\.?\s*\d+                                #   S. 1
                 |\(\d+\)                                   #   (1)
        ))*
    )
    \s+
    (?P<abbr>[A-ZÄÖÜ][A-Za-zÄÖÜäöü\-]{1,30})              # law abbreviation
    """,
    re.VERBOSE,
)


@dataclass
class Citation:
    raw: str
    marker: str       # "§" or "Art"
    number: str       # "185" or "5"
    subsection: str | None
    abbreviation: str  # "StGB"


def parse_citation(text: str) -> Citation | None:
    """Extract the first legal citation from a string. Returns None if none found."""
    m = CITATION_RE.search(text)
    if not m:
        return None
    marker = m.group("marker").rstrip(".")
    if marker == "Art":
        marker = "Art"
    return Citation(
        raw=m.group(0).strip(),
        marker=marker,
        number=m.group("number"),
        subsection=(m.group("sub") or "").strip() or None,
        abbreviation=m.group("abbr"),
    )


# Build {abbr_upper: Path} mapping by scanning law files for the **Abkürzung:** header.
# Cached at first call; subsequent calls are O(1).
_ABBR_INDEX: dict[str, Path] | None = None


def _build_abbr_index() -> dict[str, Path]:
    index: dict[str, Path] = {}
    for md in sorted(LAWS_DIR.glob("*.md")):
        try:
            with md.open(encoding="utf-8") as f:
                # Read only first ~30 lines — header is always near top
                head = "".join(f.readline() for _ in range(30))
        except OSError:
            continue
        m = re.search(r"\*\*Abkürzung:\*\*\s*([^\s\n]+)", head)
        if m:
            abbr = m.group(1).strip().upper()
            # Prefer the canonical filename (e.g. stgb.md) over variants (stgbeg.md)
            # if multiple files share an abbreviation, the shorter filename wins
            existing = index.get(abbr)
            if existing is None or len(md.name) < len(existing.name):
                index[abbr] = md
    return index


def get_abbr_index() -> dict[str, Path]:
    global _ABBR_INDEX
    if _ABBR_INDEX is None:
        _ABBR_INDEX = _build_abbr_index()
    return _ABBR_INDEX


def find_law_file(abbreviation: str) -> Path | None:
    """Resolve a law abbreviation (case-insensitive) to its Markdown file."""
    return get_abbr_index().get(abbreviation.upper())


@dataclass
class Paragraph:
    heading: str       # "§ 185 — Beleidigung" or "Art 5"
    title: str | None  # "Beleidigung" or None
    number: str        # "§ 185" or "Art 5"
    text: str          # full paragraph body (without the heading line)


def extract_paragraph(law_path: Path, marker: str, number: str) -> Paragraph | None:
    """
    Pull a single paragraph from a law file by `### § N` or `### Art N` heading.
    Matches both `### § 185 — Beleidigung` and `### Art 5` styles.
    """
    content = law_path.read_text(encoding="utf-8")
    lines = content.split("\n")

    # Build the heading prefix we're looking for, e.g. "### § 185" or "### Art 5"
    if marker == "§":
        prefix = f"### § {number}"
    else:  # Art
        prefix = f"### Art {number}"

    in_section = False
    heading = None
    body: list[str] = []

    for line in lines:
        if line.startswith("### "):
            if in_section:
                break  # next section starts → stop
            # check if this line is OUR section
            stripped = line.rstrip()
            # tolerate variants: "### § 185 — Beleidigung", "### § 185", "### § 185a"
            if stripped == prefix or stripped.startswith(prefix + " ") or stripped.startswith(prefix + "—"):
                in_section = True
                heading = stripped[4:].strip()  # strip "### "
        elif in_section:
            body.append(line)

    if not in_section or heading is None:
        return None

    # Title is the part after "—" if present
    title: str | None = None
    if "—" in heading:
        _, _, after = heading.partition("—")
        title = after.strip() or None

    # Number = heading up to "—"
    raw_number = heading.split("—")[0].strip()

    text = "\n".join(body).strip()
    return Paragraph(heading=heading, title=title, number=raw_number, text=text)


def get_law_metadata(law_path: Path) -> dict[str, str]:
    """Return {name, abbreviation} for a law file."""
    name = ""
    abbr = ""
    with law_path.open(encoding="utf-8") as f:
        for i, line in enumerate(f):
            if i > 30:
                break
            if line.startswith("# ") and not name:
                name = line[2:].strip()
            elif line.startswith("**Abkürzung:**"):
                abbr = line.replace("**Abkürzung:**", "").strip()
    return {"name": name, "abbreviation": abbr}
