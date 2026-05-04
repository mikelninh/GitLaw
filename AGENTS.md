# GitLaw Agent Guide

## Mission
- Build GitLaw as a supervised agentic legal workflow product for small German law firms.
- Optimize for real legal work, not generic AI novelty.

## Product Thesis
- GitLaw is not a generic legal chatbot.
- GitLaw is a workflow system around one core loop:
  - intake
  - documents
  - research
  - draft
  - approval
- The lawyer remains the reviewer and final authority.

## Priorities
- Trust beats flash.
- Workflow depth beats feature count.
- Structured outputs beat free-form prose where possible.
- Citations, auditability, and reviewability matter more than clever demos.
- Production hardening is usually a better investment than speculative AI features.

## Agent Architecture
- Prefer narrow, supervised agent roles over one general agent.
- Main agent roles:
  - intake
  - document / OCR
  - translation
  - research
  - citation verification
  - drafting
  - memory
- Agent outputs should feed the next workflow step, not float as isolated answers.

## Engineering Rules
- Preserve structured research outputs.
- Preserve tenant isolation, RBAC, and auditability.
- Prefer server-side trust boundaries over browser-only logic.
- When improving AI behavior, also improve verification and failure handling.
- Do not weaken legal trust for speed or demo aesthetics.

## What Not To Build First
- Generic legal chat as the primary product.
- Broad multi-practice expansion before the core loop is strong.
- Enterprise-heavy abstractions without pilot demand.
- Fancy agent orchestration without measurable workflow benefit.

## Collaboration Style
- Work autonomously by default.
- Ask fewer permission questions.
- Proceed directly with:
  - code changes
  - docs updates
  - local tests
  - build checks
  - non-destructive commands
- Only interrupt for approval when:
  - a destructive action is required
  - credentials, billing, or external accounts are affected
  - there is a real ambiguity in product direction
  - existing user changes create a direct conflict

## Expected Output Style
- Be concise and concrete.
- Explain changes in terms of workflow impact.
- Prefer real implementation and verification over abstract suggestions.
