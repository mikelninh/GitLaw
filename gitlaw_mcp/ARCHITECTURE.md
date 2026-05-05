# GitLaw MCP — Architecture & Cloud-Migration Pfad

> Wie der MCP-Server heute läuft — und wie man ihn in eine Production-Cloud-Umgebung (AWS / Azure) hebt, ohne die Architektur über den Haufen zu werfen.

---

## Aktueller Stand — wie es heute läuft

```
┌─────────────────────────────────┐
│  MCP-Client                     │
│  (Claude Desktop / Cursor /     │
│   Continue / eigener Agent)     │
└──────────────┬──────────────────┘
               │  stdio (JSON-RPC 2.0)
               │  ↕
┌──────────────▼──────────────────┐
│  gitlaw_mcp.server (Python)     │
│  ─ FastMCP                      │
│  ─ 4 Tools + 1 Resource         │
└──────────┬──────────┬───────────┘
           │          │
   ┌───────▼──┐  ┌────▼─────────┐
   │ laws/    │  │ rag/         │
   │ *.md     │  │ vectorstore/ │
   │ (5,936   │  │ (FAISS,      │
   │  files)  │  │  ~150 MB)    │
   └──────────┘  └──────┬───────┘
                        │  query embed
                        ▼
                ┌─────────────────┐
                │ OpenAI API      │
                │ (Embeddings nur)│
                └─────────────────┘
```

**Transport:** stdio. Der Client startet den Server-Prozess als Subprozess und pipet JSON-RPC. Kein Netzwerk, keine Ports — perfekt für Desktop-Clients und für die ersten Beta-Anwält:innen aus dem Pilot-Netzwerk.

**Persistenz:** Keine. Stateless pro Request. Der `_vectorstore` Cache lebt nur im Prozess-Memory.

**Secrets:** `OPENAI_API_KEY` über Env-Variable an den Subprozess weitergegeben (Claude-Desktop-Config-JSON).

---

## Schritt 1 — Containerization (heute fertig)

```bash
docker build -t gitlaw-mcp:0.1.0 -f gitlaw_mcp/Dockerfile .
docker run --rm -i \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -v $(pwd)/rag/vectorstore:/app/rag/vectorstore:ro \
  gitlaw-mcp:0.1.0
```

**Multi-Stage-Build:**
- Stage 1 (builder): kompilierende deps (faiss-cpu pulled in numpy + BLAS) → in Venv installieren
- Stage 2 (runtime): nur das resolved venv + app-code, schlankes `python:3.11-slim`, non-root user, healthcheck

Der `rag/vectorstore/` ist **bind-mounted** statt im Image — das hält das Image ~250 MB statt ~400 MB und erlaubt Index-Updates ohne Image-Rebuild.

**CI:** `.github/workflows/mcp-ci.yml` baut + smoke-tested das Image bei jedem Push, plus ruff/mypy auf dem Code, plus den Offline-Demo-Run direkt auf dem Runner. Total ~2-3 min.

---

## Schritt 2 — HTTP / SSE Transport (für Remote-Clients)

Heute: stdio = nur lokal startbar. Für hosted Clients (Claude.ai Web, Continue Cloud, eigene Agenten in Production) brauchen wir HTTP-Transport.

FastMCP unterstützt das nativ:

```python
# Statt mcp.run() :
mcp.run(transport="sse")   # Server-Sent Events auf Port 8000
# oder
mcp.run(transport="streamable-http")  # neuere Variante
```

Der Container exponiert dann Port 8000, hinter einem Reverse-Proxy mit TLS + Auth.

---

## Schritt 3 — AWS-Deployment-Pfad

### Option A — ECS Fargate (empfohlen für MVP-Production)

```
Internet
   │
   ▼
┌────────────────────┐
│  ALB (TLS-Term,    │  ← ACM-Cert, OIDC-Auth via Cognito
│  WAF, Rate-Limit)  │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  ECS Fargate Task  │  ← gitlaw-mcp:0.1.0 image
│  (1-N replicas)    │
│  Port 8000         │
└────┬───────┬───────┘
     │       │
     ▼       ▼
┌──────┐  ┌────────────┐
│ EFS  │  │ Secrets    │
│ /rag │  │ Manager    │
│      │  │ (OAI key)  │
└──────┘  └────────────┘
```

**Warum Fargate, nicht EC2:** keine EC2-Verwaltung, autoscaling per ECS-Service-Definition, pay-per-second. Für einen MCP-Server mit unklarer Last ist das ideal.

**Warum EFS für `rag/vectorstore/`:** der Vectorstore ist ~150 MB und wird wöchentlich neu gebaut (siehe Roadmap). EFS = shared filesystem über alle Tasks, kein Re-Upload pro Deploy nötig. Alternative: S3 + Sidecar-Container, der bei Start syncet.

**Secrets:** `OPENAI_API_KEY` über AWS Secrets Manager. ECS-Task-Definition zieht die Werte automatisch in die Container-Env. Niemals im Image.

**Compliance-relevant:**
- ALB-Logs → S3 (mit Object-Lock falls für Audit nötig)
- ECS-Logs → CloudWatch
- WAF-Rules: rate-limit pro IP, geo-block falls nicht-EU
- KMS-encrypted EFS + Secrets Manager
- VPC private subnet, kein direkter Internet-Zugang (nur über NAT für OpenAI-API-Calls)
- Region: **eu-central-1 (Frankfurt)** — DSGVO-konform, mit EU-Cloud-Garantien

### Option B — Lambda + Function URL (für sporadische Last)

Geht auch — Lambda kann Container-Images mit bis zu 10 GB. Vorteile: Skaliert auf 0, keine Idle-Kosten. Nachteile: Cold-Start (FAISS-Load = ~3-5s), 15-min Timeout-Limit. Für einen produktiven MCP-Server eher nicht erste Wahl, aber für interne Demos / Tests ausreichend.

---

## Schritt 4 — Azure-Deployment-Pfad (alternativ, semantisch äquivalent)

```
Internet
   │
   ▼
┌────────────────────────┐
│  Application Gateway   │  ← TLS, WAF, OIDC via Entra ID
│  (Azure Front Door     │
│   für globalen Edge)   │
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│  Container Apps        │  ← gitlaw-mcp Image, autoscaled
│  (managed Kubernetes-  │     0-N replicas, scale-on-HTTP
│   adjacent compute)    │
└────┬───────────────────┘
     │
     ├─► Azure Files (rag/vectorstore mounted)
     ├─► Key Vault (OpenAI key)
     └─► Log Analytics + App Insights

```

**Warum Container Apps statt AKS:** AKS ist Vollkubernetes, overkill für einen MCP-Server. Container Apps gibt dir 80% von Kubernetes (KEDA-basierte autoscaling, dapr) ohne K8s-Operations-Overhead.

**Region:** **Germany West Central (Frankfurt)** für DSGVO-Konformität.

---

## Beobachtbarkeit

Drei Schichten, die wir sukzessive einbauen:

1. **Strukturiertes Logging** — JSON-Logs zu stdout, jede Tool-Invocation mit `tool_name`, `args_hash`, `latency_ms`, `verified` (für `verify_citation`). Sofort grepable in CloudWatch / Log Analytics.

2. **Metrics** — CloudWatch / App Insights Custom Metrics: Tool-Calls/min, Halluzinations-Rate (% verified=false), p95-Latency. Daraus simple Alerts (z.B. wenn Halluzinations-Rate plötzlich >50% steigt — könnte ein Korpus-Schaden sein).

3. **Tracing** — OpenTelemetry-Sidecar für jede Tool-Invocation. Visualisiert die FAISS-Suche + OpenAI-Call als Span-Hierarchie. Hilft bei "warum war die letzte Suche langsam".

Für den MVP-Pilot reicht Schicht 1. Schichten 2-3 werden relevant ab dem Punkt, an dem zahlende Kanzleien das produktiv nutzen.

---

## Compliance-Checkliste (DSGVO + Legal-Industry)

| Bereich | Aktueller Stand | Production-Stand |
|---|---|---|
| Datenresidenz | Lokal | EU-Region (Frankfurt) |
| Verschlüsselung at-rest | n/a | KMS-encrypted EFS + Secrets |
| Verschlüsselung in-transit | stdio (lokal) | TLS 1.3 zwischen Client und ALB/AppGW |
| Auth | n/a | OIDC (Cognito / Entra ID) + API-Key per Tenant |
| Logging | print | strukturiertes JSON, kein PII |
| AVV / DPA | n/a | mit OpenAI bestehend, dokumentiert |
| Auditierbar | n/a | jeder Tool-Call mit `tenant_id` + `request_id` geloggt |
| Lösch-Recht | n/a | per-Tenant API-Endpoint zum Logs/Caches-Wipe |

Der GitLaw-Pro-Stack hat einige dieser Schichten schon (Upstash-Frankfurt, signierte Pro-Sessions, 14-Pattern-Anonymizer). Der MCP-Server muss sich beim Production-Cutover dort einklinken.

---

## Skalierung — wann was wichtig wird

**0-100 Users / Day:** stdio reicht. Local install, Claude-Desktop-Config. Kein Hosting nötig.

**100-1.000 Users / Day:** Single Fargate-Task / Container-App-Instance. ~$50-150/Mo Cloud-Kosten + OpenAI-Embedding-Kosten (~$0.02 pro 1k Calls).

**1.000-10.000 Users / Day:** 2-5 Replicas, ALB-Routing, EFS für shared vectorstore. ~$200-600/Mo. Caching-Layer (Redis) für `verify_citation` Resultate (high cache hit rate).

**10.000+ Users / Day:** Eigener vectorstore-Service (Pinecone / Weaviate / Qdrant Cloud) statt FAISS-in-Process. Dedizierte Embedding-Worker. Multi-Region. ~$1.500+/Mo. An diesem Punkt ist es kein "Side-Project" mehr, sondern Produkt.

---

## Open Questions / Roadmap

- [ ] HTTP/SSE-Transport produktiv testen (FastMCP dokumentiert das, aber best-practices entwickeln sich noch)
- [ ] Eval-Harness in CI: 100 hand-labelled Citation-Verification-Cases, Pass/Fail-Rate getrackt
- [ ] Citation-Graph: Cross-Referenzen zwischen Paragraphen extrahieren → `find_related(citation)` Tool
- [ ] Per-Tenant Rate-Limiting (heute n/a, da stdio)
- [ ] Schweizer / Österreichischer Korpus integrieren (`laws_*.py` Daten existieren bereits im Parent-Repo)
