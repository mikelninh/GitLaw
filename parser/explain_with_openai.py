"""Generate law explanations using OpenAI GPT-4o-mini. Run once, cache forever."""

import json
import time
import os
from pathlib import Path
from openai import OpenAI

client = OpenAI()  # Uses OPENAI_API_KEY from environment

def explain_section(law_name: str, section: str, text: str) -> str:
    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": """Du erklärst deutsche Gesetze in einfacher Sprache.
Regeln: Für einen 16-Jährigen. Maximal 2-3 Sätze. Ein Alltagsbeispiel. Was passiert bei Verstoß. Kein Juristendeutsch."""},
                {"role": "user", "content": f"Erkläre:\n\n{law_name} — {section}\n\n{text[:1500]}"}
            ],
            max_tokens=200,
            temperature=0.3,
        )
        return resp.choices[0].message.content.strip()
    except Exception as e:
        print(f"    Error: {e}")
        time.sleep(5)
        return ""


def explain_law(law_id: str):
    md_path = Path("laws") / f"{law_id}.md"
    out_dir = Path("viewer/public/explanations")
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{law_id}.json"

    if out_path.exists():
        print(f"  {law_id} — already done, skipping")
        return

    if not md_path.exists():
        print(f"  {law_id} — not found")
        return

    content = md_path.read_text(encoding="utf-8")
    law_name = ""
    sections = []
    cur_sec = ""
    cur_txt = []

    for line in content.split("\n"):
        if line.startswith("# ") and not law_name:
            law_name = line[2:].strip()
        elif line.startswith("### "):
            if cur_sec and cur_txt:
                sections.append((cur_sec, "\n".join(cur_txt)))
            cur_sec = line[4:].strip()
            cur_txt = []
        elif cur_sec:
            cur_txt.append(line)
    if cur_sec and cur_txt:
        sections.append((cur_sec, "\n".join(cur_txt)))

    print(f"  {law_id} — {len(sections)} sections")
    explanations = {}

    for section, text in sections:
        if len(text.strip()) < 30:
            continue
        exp = explain_section(law_name, section, text)
        if exp:
            explanations[section] = exp
            print(f"    ✓ {section}")
        time.sleep(0.3)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"law": law_name, "file": md_path.name, "explanations": explanations}, f, ensure_ascii=False, indent=2)
    print(f"  → {len(explanations)} saved")


if __name__ == "__main__":
    for law_id in ["gg", "stgb", "tierschg", "netzdg", "sgb_6", "sgb_5", "estg"]:
        explain_law(law_id)
        print()
