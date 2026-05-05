"""
Citation-verification eval harness.

Loads tests/cases.json and runs every case through verify_citation, asserting:
  1. The verified flag matches expected.
  2. When verified=False, the reason matches expected (paragraph_not_found,
     law_not_found, could_not_parse).

On run, also writes tests/eval_report.json with per-category pass/fail counts —
that file is uploaded as a CI artefact and feeds the README pass-rate badge.

Run:
    pytest gitlaw_mcp/tests/ -v
or:
    python -m gitlaw_mcp.tests.test_eval     # standalone, prints summary
"""

from __future__ import annotations

import json
import sys
import time
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT))

import pytest  # noqa: E402

from gitlaw_mcp.server import verify_citation  # noqa: E402

CASES_FILE = Path(__file__).parent / "cases.json"
REPORT_FILE = Path(__file__).parent / "eval_report.json"

with CASES_FILE.open(encoding="utf-8") as f:
    _CASES = json.load(f)["cases"]


# ─── Pytest parametrised cases ────────────────────────────────────────


@pytest.mark.parametrize("case", _CASES, ids=lambda c: c["id"])
def test_citation_case(case: dict) -> None:
    """Each case is its own test row — failure messages cite the case id."""
    result = verify_citation(case["citation"])
    expected = case["expected"]

    assert result.get("verified") == expected["verified"], (
        f"{case['id']}: verified mismatch — got {result.get('verified')}, "
        f"expected {expected['verified']}. Full result: {result}"
    )

    if "reason" in expected:
        assert result.get("reason") == expected["reason"], (
            f"{case['id']}: reason mismatch — got {result.get('reason')!r}, "
            f"expected {expected['reason']!r}. Full result: {result}"
        )


# ─── Standalone run that writes the JSON report for CI ─────────────────


def run_eval_with_report() -> dict:
    """Run all cases programmatically. Returns aggregated results dict."""
    t0 = time.time()
    by_category: dict[str, dict[str, int]] = defaultdict(lambda: {"pass": 0, "fail": 0, "total": 0})
    failures: list[dict] = []

    for case in _CASES:
        cat = case.get("category", "uncategorised")
        by_category[cat]["total"] += 1
        result = verify_citation(case["citation"])
        expected = case["expected"]

        ok = result.get("verified") == expected["verified"]
        if "reason" in expected and ok:
            ok = result.get("reason") == expected["reason"]

        if ok:
            by_category[cat]["pass"] += 1
        else:
            by_category[cat]["fail"] += 1
            failures.append(
                {
                    "id": case["id"],
                    "citation": case["citation"],
                    "expected": expected,
                    "got": {
                        "verified": result.get("verified"),
                        "reason": result.get("reason"),
                    },
                }
            )

    total_pass = sum(c["pass"] for c in by_category.values())
    total = sum(c["total"] for c in by_category.values())
    pass_rate = (total_pass / total) if total else 0.0

    report = {
        "summary": {
            "total": total,
            "passed": total_pass,
            "failed": total - total_pass,
            "pass_rate": round(pass_rate, 4),
            "duration_seconds": round(time.time() - t0, 3),
        },
        "by_category": dict(by_category),
        "failures": failures,
    }
    REPORT_FILE.write_text(json.dumps(report, ensure_ascii=False, indent=2))
    return report


def main() -> int:
    report = run_eval_with_report()
    s = report["summary"]
    print(f"\nGitLaw MCP — citation eval")
    print(f"{'─' * 50}")
    print(f"  total:      {s['total']}")
    print(f"  passed:     {s['passed']}")
    print(f"  failed:     {s['failed']}")
    print(f"  pass-rate:  {s['pass_rate'] * 100:.1f}%")
    print(f"  duration:   {s['duration_seconds']:.2f}s")
    print()
    print("by category:")
    for cat, counts in sorted(report["by_category"].items()):
        ratio = counts["pass"] / counts["total"] if counts["total"] else 0.0
        flag = "✓" if ratio == 1.0 else ("⚠" if ratio >= 0.8 else "✗")
        print(f"  {flag} {cat:35} {counts['pass']:>3}/{counts['total']:<3} ({ratio * 100:.0f}%)")
    if report["failures"]:
        print(f"\nfailures ({len(report['failures'])}):")
        for f in report["failures"][:10]:
            print(f"  - {f['id']}: {f['citation']!r}")
            print(f"      expected: {f['expected']}")
            print(f"      got:      {f['got']}")
    return 0 if s["failed"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
