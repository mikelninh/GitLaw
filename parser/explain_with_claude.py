"""Generate law explanations using Claude (highest quality). Run once, cache forever."""

import json
import time
import os
import anthropic
from pathlib import Path

client = anthropic.Anthropic()  # Uses ANTHROPIC_API_KEY from environment

def explain_section(law_name: str, section: str, text: str) -> str:
    """Generate a simple explanation using Claude."""
    try:
        resp = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=250,
            messages=[{
                "role": "user",
                "content": f"""Erkläre diesen Paragraphen in einfacher Sprache.

Regeln:
- Für einen 16-Jährigen verständlich
- Maximal 2-3 Sätze
- Ein konkretes Alltagsbeispiel
- Was passiert bei Verstoß (falls relevant)
- Kein Juristendeutsch
- Sei direkt und klar

Gesetz: {law_name}
Paragraph: {section}

Text:
{text[:1500]}"""
            }],
        )
        return resp.content[0].text.strip()
    except Exception as e:
        print(f"    Error: {e}")
        return ""


def explain_law(law_id: str, laws_dir: str = "laws", output_dir: str = "viewer/public/explanations"):
    """Generate explanations for all sections of a law."""
    md_path = Path(laws_dir) / f"{law_id}.md"
    if not md_path.exists():
        print(f"  {law_id} — not found")
        return

    out_path = Path(output_dir) / f"{law_id}.json"
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    if out_path.exists():
        print(f"  {law_id} — already explained, skipping")
        return

    content = md_path.read_text(encoding="utf-8")
    lines = content.split("\n")

    law_name = ""
    sections = []
    current_section = ""
    current_text_lines = []

    for line in lines:
        if line.startswith("# ") and not law_name:
            law_name = line[2:].strip()
        elif line.startswith("### "):
            if current_section and current_text_lines:
                sections.append((current_section, "\n".join(current_text_lines)))
            current_section = line[4:].strip()
            current_text_lines = []
        elif current_section:
            current_text_lines.append(line)

    if current_section and current_text_lines:
        sections.append((current_section, "\n".join(current_text_lines)))

    print(f"  {law_id} — {len(sections)} sections")
    explanations = {}

    for section, text in sections:
        text = text.strip()
        if len(text) < 30:
            continue

        explanation = explain_section(law_name, section, text)
        if explanation:
            explanations[section] = explanation
            print(f"    ✓ {section}")

        time.sleep(0.5)  # Rate limit safety

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({
            "law": law_name,
            "file": md_path.name,
            "explanations": explanations,
        }, f, ensure_ascii=False, indent=2)

    print(f"  → {len(explanations)} explanations saved to {out_path}")


if __name__ == "__main__":
    # Most important laws first
    priority = [
        "gg",           # Grundgesetz
        "stgb",         # Strafgesetzbuch
        "tierschg",     # Tierschutzgesetz
        "netzdg",       # NetzDG
        "sgb_6",        # Rente
        "sgb_5",        # Krankenversicherung
        "estg",         # Einkommensteuer
        "bgb",          # BGB (big — will take a while)
    ]

    print(f"Generating explanations with Claude Sonnet 4.6...")
    print(f"Output: viewer/public/explanations/\n")

    for law_id in priority:
        explain_law(law_id)
        print()
