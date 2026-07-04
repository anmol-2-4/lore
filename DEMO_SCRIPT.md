# Lore — Demo Video Script (target 2:30–3:00)

**Goal:** show deep, genuine use of open-source Cognee, and land the theme — *an agent that
never forgets* — with a beat a plain LLM literally cannot do: **memory that survives a full
restart.**
**The one thing to nail:** the restart. Teach it, kill the process, reopen, and it still knows
*why*. Everything else supports that.
Record at 1080p; keep it tight.

## Before you hit record (prep)
- `ollama serve` running; pre-warm: `ollama run qwen2.5:3b "ok"` (avoids cold-start pauses on camera).
- Start server: `uvicorn backend.main:app` → open `http://localhost:8000`.
- Local LLM on CPU is slow (~60–90s/query). **Record in segments and cut the wait**, OR speed
  up 4–8× in editing. Never show a 90s frozen screen.
- Have a second terminal visible for the restart beat — the kill + relaunch should be on camera.

## Shot list

### 0:00–0:20 — Hook (the problem)
- On screen: the Lore header — *"The memory your codebase keeps."*
- **VO:** "Every time you open a new session, your AI assistant forgets why your project is the
  way it is. LLMs are stateless — they lose the last session and overflow their context window.
  So the *why* behind your architecture lives in people's heads and disappears when they leave.
  Lore fixes that with persistent memory, built on Cognee's open-source graph-vector engine,
  100% local, zero API keys."

### 0:20–0:45 — Teach it (the Cognee core)
- Click **Demo: a project** → real decisions stream into the memory column.
- Click **Build memory**. (Cut the wait.)
- **VO:** "I record my project's decisions — why Postgres over Mongo, why JWT instead of
  sessions, why the job queue moved to Redis. One call to Cognee's `remember()` turns them into
  a knowledge graph. This is the hybrid graph-vector memory doing the work, not a plain prompt."

### 0:45–1:10 — See the memory (the wow shot)
- Click **Memory graph** → the interactive node graph opens. Slowly pan/zoom.
- **VO:** "This is the actual memory Cognee built — the decisions, the systems, and how they
  connect. Dozens of nodes from a handful of notes."

### 1:10–1:35 — Ask *why* + multi-hop recall
- Ask: **"why did we choose Postgres?"** → graph-grounded answer.
- Ask: **"why JWT instead of sessions?"** → answer connects *mobile can't hold cookies* → *so
  we use JWT*, a link no single note states outright.
- **VO:** "Now I ask the codebase *why*. Answers come straight from the graph — and it connects
  facts across separate notes to explain a decision no single note spells out."

### 1:35–2:20 — THE HERO BEAT: memory that survives a restart
- Cut to the terminal. **Ctrl-C the server. Show it fully stopped.** Relaunch
  `uvicorn backend.main:app`. Reload the page in a fresh tab.
- On load, the UI shows: *"Memory on file from a previous session."*
- Ask the SAME question again: **"why don't we use cookie sessions?"** → it still answers.
- **VO:** "Here's the whole point. I kill the process completely — new session, nothing in
  context. I reopen, and the memory is still there. I ask again, and it still knows: mobile
  can't hold cookies, so auth uses JWT. That's what a plain LLM chat can never do. Cognee
  persisted the graph to disk. Context that survives — across infinite sessions."

### 2:20–2:40 — Open the memory graph (optional wow shot to close on)
- Click **Memory graph** if you didn't earlier, and let it settle on screen under the close VO.

### 2:40–3:00 — Close
- Cut to: the repo / "Best Use of Open Source Cognee".
- **VO:** "Lore. Persistent memory for your codebase — fully open source, fully local. Built on
  Cognee."

## Lines to hit for judges (say the words)
- "Cognee's `remember` / `recall` / `improve` / `forget`" (name the lifecycle).
- "hybrid graph-vector memory."
- "open-source, self-hosted, 100% local, no API keys."
- "persistent, cross-session memory — it survives a restart."
