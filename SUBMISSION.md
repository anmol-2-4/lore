# Lore — submission copy (paste into the form)

**Track:** Best Use of Open Source
**Repo:** https://github.com/anmol-2-4/wingman
**Demo video:** [ADD LINK]

---

## Tagline (one line)
Lore — the memory your codebase keeps: persistent, self-hosted memory that remembers *why*
your project is the way it is, across sessions and restarts.

## Short description (2–3 sentences)
Lore gives a codebase a permanent memory. You record the decisions and the *why* behind them,
and Cognee's open-source hybrid graph-vector memory turns them into a queryable knowledge
graph — so weeks later, or in a brand-new session after a full restart, you can ask "why did we
choose Postgres?" and get the answer from memory — connecting facts across separate notes that
no single note states outright. It runs 100% locally, no API keys.

## The problem
Every developer asks "why did we do it this way?" — and every AI assistant asks it too, on
every session. LLMs are stateless: a new chat forgets the last, and the context window
overflows long before a project's history fits. So the *why* behind an architecture lives in
people's heads and dies when they leave. The fix is a permanent, self-hosted, hybrid
graph-vector memory that retains, connects, and carries context across infinite sessions.

## What it does
You tell Lore your project's decisions ("auth uses JWT because mobile can't hold cookies"). It
uses Cognee to build a knowledge graph, then lets you:
- **Ask the codebase *why*** in natural language, answered from the graph.
- **Recall across sessions** — the headline: kill the process, reopen fresh, and the memory is
  still there. No re-explaining. A plain LLM chat can't do this.
- **Multi-hop recall** — it connects facts across separate notes that no single note states.
- **Visualize** the memory as a live interactive graph.

## How it uses Cognee (the memory lifecycle + hybrid graph-vector layer, deeply)
Every memory operation runs through Cognee's named APIs over its hybrid graph-vector memory
layer — Cognee is the brain; the local LLM only phrases answers over what Cognee retrieves:
- **`remember()`** — ingests a decision and builds the hybrid graph-vector memory
- **`recall()`** — graph-traversal answers grounded in the memory
- **`improve()`** — cross-links and enriches related decisions
- **`forget()`** — wipes memory
- **`visualize_graph()`** — the live memory graph

## Why "Best Use of Open Source"
100% self-hosted open-source Cognee (Kuzu graph + vector store) with open-source local models
via Ollama (`qwen2.5:3b` + `nomic-embed-text`). No cloud, no API keys, $0 — fully reproducible
from the README quickstart.

## Tech stack
Cognee 1.2.2 (self-hosted) · Ollama (`qwen2.5:3b`, `nomic-embed-text`) · FastAPI · vanilla JS.
