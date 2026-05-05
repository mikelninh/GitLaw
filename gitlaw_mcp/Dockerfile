# GitLaw MCP Server — multi-stage Docker build
#
# Stage 1 (builder):  install dependencies in a venv with build tools available
# Stage 2 (runtime):  copy only the venv + app code, run as non-root user
#
# Why multi-stage: faiss-cpu pulls in numpy + BLAS, langchain has heavy
# transitive deps. Building in one stage and shipping only the resolved
# venv keeps the runtime image lean and free of compiler/build tooling.
#
# Build:    docker build -t gitlaw-mcp:0.1.0 -f gitlaw_mcp/Dockerfile .
# Run:      docker run --rm -i -e OPENAI_API_KEY=$OPENAI_API_KEY gitlaw-mcp:0.1.0
# Smoke:    docker run --rm gitlaw-mcp:0.1.0 python -m gitlaw_mcp.demo

# ─────────────────────────────────────────────────────────────────────
# Stage 1 — builder
# ─────────────────────────────────────────────────────────────────────
FROM python:3.11-slim AS builder

# System deps that some Python wheels (faiss-cpu, openblas) may compile against.
# We pin to slim-bookworm + minimal apt packages, then clean up.
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        build-essential \
        libgomp1 \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /build

# Install dependencies into a venv (so we can copy it cleanly to runtime stage)
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy only the package manifest first → maximize Docker-layer cache hits
COPY gitlaw_mcp/pyproject.toml gitlaw_mcp/README.md ./gitlaw_mcp/
COPY gitlaw_mcp/__init__.py ./gitlaw_mcp/

RUN pip install --upgrade pip \
 && pip install ./gitlaw_mcp

# ─────────────────────────────────────────────────────────────────────
# Stage 2 — runtime
# ─────────────────────────────────────────────────────────────────────
FROM python:3.11-slim AS runtime

# libgomp1 is needed by faiss-cpu at runtime (OpenMP shared lib)
RUN apt-get update \
    && apt-get install --no-install-recommends -y libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Non-root user — never run a server as root, even if it's only stdio
RUN useradd --create-home --shell /bin/bash gitlaw
USER gitlaw
WORKDIR /app

ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Copy the resolved venv from the builder stage
COPY --from=builder --chown=gitlaw:gitlaw /opt/venv /opt/venv

# Copy the corpus and the package source.
# laws/ is the source of truth; rag/vectorstore/ is bind-mounted at run time
# (it's ~150 MB and rebuilds with `python rag/build_vectorstore.py`).
COPY --chown=gitlaw:gitlaw laws/ /app/laws/
COPY --chown=gitlaw:gitlaw gitlaw_mcp/ /app/gitlaw_mcp/

# Healthcheck: run the offline demo (no network/API needed)
HEALTHCHECK --interval=60s --timeout=10s --start-period=5s --retries=2 \
    CMD python -c "from gitlaw_mcp.citations import get_abbr_index; assert len(get_abbr_index()) > 1000"

# Default: start the MCP stdio server.
# An MCP client (Claude Desktop, Cursor, etc.) wires this up and pipes JSON-RPC.
CMD ["python", "-m", "gitlaw_mcp.server"]
