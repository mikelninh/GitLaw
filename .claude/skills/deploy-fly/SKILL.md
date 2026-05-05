---
name: deploy-fly
description: Deploys the GitLaw MCP server to Fly.io in Frankfurt over SSE transport. Use when Mikel says "deploy MCP", "deploy to Fly", "ship the MCP server", or wants to update the live https://gitlaw-mcp.fly.dev endpoint. Handles first-time bootstrap (auth, app creation, secrets, volume) AND incremental redeploys.
allowed-tools: Bash, Read
---

# Deploy GitLaw MCP to Fly.io

End-to-end deploy of the MCP server to Fly.io Frankfurt with SSE transport.

## When to invoke this skill

- "Deploy the MCP server"
- "Ship to Fly"
- "Push the MCP update live"
- "Update gitlaw-mcp.fly.dev"
- After significant changes in `gitlaw_mcp/`, `laws/`, or `fly.toml`

## Prerequisites — verify before doing anything

Run these checks in order. If any fails, stop and surface the issue to Mikel.

```bash
# 1. flyctl installed?
command -v flyctl >/dev/null 2>&1 || echo "MISSING: flyctl — install via 'brew install flyctl'"

# 2. Authenticated?
flyctl auth whoami 2>&1 | grep -q "@" || echo "MISSING: fly auth — run 'flyctl auth login'"

# 3. App exists?
flyctl apps list 2>&1 | grep -q "gitlaw-mcp" || echo "MISSING: app — run 'flyctl launch --no-deploy' first"

# 4. OPENAI_API_KEY set as secret?
flyctl secrets list -a gitlaw-mcp 2>&1 | grep -q "OPENAI_API_KEY" || echo "MISSING: secret — run 'flyctl secrets set OPENAI_API_KEY=sk-...'"

# 5. Volume exists?
flyctl volumes list -a gitlaw-mcp 2>&1 | grep -q "gitlaw_data" || echo "MISSING: volume — run 'flyctl volumes create gitlaw_data --region fra --size 1'"
```

## First-time bootstrap (only if app doesn't exist yet)

Walk through these in order. **Wait for user confirmation between each step** — these are creating real cloud resources.

```bash
flyctl auth login                                                    # opens browser
flyctl launch --no-deploy --name gitlaw-mcp --region fra             # accepts existing fly.toml
flyctl secrets set OPENAI_API_KEY="sk-..."                           # ask user for the key
flyctl volumes create gitlaw_data --region fra --size 1              # 1 GB persistent storage
```

## Standard redeploy (most common case)

Once everything's set up, deploys are one command:

```bash
cd /Users/mikel/gitlaw
flyctl deploy --remote-only
```

`--remote-only` builds the Docker image on Fly's infrastructure (faster + no local Docker needed). Uses `gitlaw_mcp/Dockerfile.fly` per the `fly.toml`.

Expected wall-time: 60-90 seconds for a cached redeploy, 3-5 min for a from-scratch build.

## Verify after deploy

```bash
# Status
flyctl status -a gitlaw-mcp

# Logs (live tail — Ctrl+C to exit)
flyctl logs -a gitlaw-mcp

# Live endpoint check
curl -sI https://gitlaw-mcp.fly.dev/sse | head -3
# expect: HTTP/2 200 ... content-type: text/event-stream

# Tool smoke test (optional, requires an MCP client):
# Add to claude_desktop_config.json:
#   "gitlaw-remote": { "command": "npx", "args": ["@modelcontextprotocol/inspector", "https://gitlaw-mcp.fly.dev/sse"] }
```

## Rollback if something went wrong

```bash
flyctl releases -a gitlaw-mcp                            # see release history
flyctl releases rollback <version> -a gitlaw-mcp         # roll back to a known-good
```

## After deploy — update places that point at the URL

If we're going from "no live deploy" to "live deploy" for the first time, also update:

- `gitlaw_mcp/README.md` — replace `gitlaw-mcp.fly.dev` placeholder with confirmed URL
- `portfolio.html` — link in the Hero buttons block
- Maybe Bao's `/#/bao` welcome page — show "MCP-Server live für externe Tools"

## What NOT to do

- ❌ Don't run `flyctl deploy` without `--remote-only` from Mikel's laptop — local Docker builds work but are slower and risk drift
- ❌ Don't deploy with uncommitted changes that touch `gitlaw_mcp/` — push to git first so the deployed image matches `main`
- ❌ Don't bake `OPENAI_API_KEY` into the Dockerfile or commit it to git — only secrets manager
- ❌ Don't change the region without asking — Frankfurt is DSGVO-aligned, that matters for legal-tech
- ❌ Don't `flyctl destroy` without an explicit "destroy the app" instruction

## Push-to-deploy alternative

If `FLY_API_TOKEN` is set as a GitHub Secret, `.github/workflows/fly-deploy.yml` auto-deploys on every push to `main` that touches `gitlaw_mcp/`, `laws/`, or `fly.toml`. To enable:

```bash
flyctl auth token                                           # generates a token
# Paste it into GitHub → Settings → Secrets → FLY_API_TOKEN
```

After that, this skill is mostly redundant for redeploys — only the bootstrap remains manual.
