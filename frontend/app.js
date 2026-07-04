const $ = (id) => document.getElementById(id);
const setStatus = (msg) => { $("statusText").textContent = msg; };

const DEMO = [
  "We chose PostgreSQL over MongoDB because our core data — users, orders, and invoices — is highly relational and we rely on foreign keys and transactions.",
  "Auth uses short-lived JWT access tokens instead of server-side sessions, because the mobile app can't reliably persist cookies.",
  "We moved the job queue onto Redis after the old in-memory queue dropped every pending task on each deploy restart.",
  "The payments module sits behind a provider interface so we can swap Stripe for Razorpay in regions where Stripe isn't supported.",
  "The public API is rate-limited to 100 requests per minute per key, after scrapers hammered it in March.",
  "As of April we froze the v1 REST API — new clients must use v2, which uses cursor-based pagination.",
  "Marketing pages are server-rendered for SEO, but the logged-in dashboard is a single-page app.",
];

const QUESTIONS = ["why did we choose Postgres?", "why JWT instead of sessions?", "can we swap the payments provider?"];

const evidence = [];
let hasMemory = false;

function renderChips() {
  $("stamp").hidden = !hasMemory;
  const box = $("chips");
  box.innerHTML = "";
  if (!hasMemory) return;
  for (const q of QUESTIONS) {
    const b = document.createElement("button");
    b.className = "chip";
    b.textContent = q;
    b.onclick = () => { $("query").value = q; $("recallBtn").click(); };
    box.appendChild(b);
  }
}

async function post(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : "{}",
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

function busy(el, label, { center } = {}) {
  const start = Date.now();
  el.innerHTML = `<div class="${center ? "center" : ""}"><span class="spinner"></span> ${label} <span class="elapsed">0s</span></div>`;
  const span = el.querySelector(".elapsed");
  const id = setInterval(() => { span.textContent = Math.round((Date.now() - start) / 1000) + "s"; }, 1000);
  return () => clearInterval(id);
}

function addCard(text) {
  const empty = $("emptyEv");
  if (empty) empty.remove();
  evidence.push(text);
  const n = evidence.length;
  const card = document.createElement("div");
  card.className = "card";
  const tag = document.createElement("div");
  tag.className = "etag";
  tag.textContent = "NOTE " + String(n).padStart(2, "0");
  const body = document.createElement("div");
  body.className = "ebody";
  body.textContent = text;
  card.append(tag, body);
  $("cards").appendChild(card);
  $("evCount").textContent = n;
}

function findings(items, cls, query) {
  const box = $("answers");
  box.innerHTML = "";
  if (query) {
    const q = document.createElement("div");
    q.className = "qlabel";
    q.textContent = "ask> " + query;
    box.appendChild(q);
  }
  if (!items || !items.length) {
    box.insertAdjacentHTML("beforeend", '<div class="center">...the memory draws a blank.</div>');
    return;
  }
  for (const a of items) {
    const div = document.createElement("div");
    div.className = cls;
    div.textContent = a;
    box.appendChild(div);
  }
}

// on load: is there already memory (persisted from a previous session)?
(async function init() {
  try {
    const s = await (await fetch("/api/status")).json();
    hasMemory = s.has_memory;
    if (hasMemory) { $("storyHint").textContent = "Memory on file from a previous session — ask it anything below."; renderChips(); }
  } catch (e) {}
})();

$("addBtn").onclick = async () => {
  const text = $("fragment").value.trim();
  if (!text) return;
  $("addBtn").disabled = true;
  try { await post("/api/fragment", { text }); addCard(text); $("fragment").value = ""; setStatus(`${evidence.length} notes staged.`); }
  catch (e) { setStatus("error: " + e.message); }
  $("addBtn").disabled = false;
};

async function loadSet(list, btnId) {
  const btn = $(btnId);
  btn.disabled = true;
  // fresh slate: wipe any prior memory + notes so the demos don't bleed into each other
  setStatus("Clearing previous memory…");
  try { await post("/api/forget"); } catch (e) {}
  evidence.length = 0;
  hasMemory = false;
  $("cards").innerHTML = '<p class="hint" id="emptyEv">Nothing remembered yet.</p>';
  $("answers").innerHTML = "";
  $("evCount").textContent = "0";
  $("graphPanel").hidden = true;
  $("storyHint").textContent = "Build the memory, then ask it anything — including in a brand-new session.";
  renderChips();
  for (const f of list) { try { await post("/api/fragment", { text: f }); addCard(f); } catch (e) {} }
  setStatus(`${evidence.length} notes staged — now Build memory.`);
  btn.disabled = false;
}
$("seedBtn").onclick = () => loadSet(DEMO, "seedBtn");

$("reconstructBtn").onclick = async () => {
  $("reconstructBtn").disabled = true;
  const stop = busy($("state"), "Building memory from your notes…");
  try {
    const d = await post("/api/reconstruct");
    hasMemory = true;
    renderChips();
    setStatus("Memory built. Ask it anything, or open the memory graph.");
    $("storyHint").textContent = `Memory built — ${d.nodes || ""} facts connected. Ask it anything below.`;
  } catch (e) { setStatus("error: " + e.message); }
  finally { stop(); $("state").textContent = ""; $("reconstructBtn").disabled = false; }
};

$("enrichBtn").onclick = async () => {
  if (!hasMemory) { setStatus("Build the memory first — nothing to connect yet."); return; }
  $("enrichBtn").disabled = true;
  const stop = busy($("state"), "Connecting the dots…");
  let msg = "Connections enriched.";
  try {
    const d = await post("/api/improve");
    msg = `Enrichment pass complete — memory holds ${d.edges} connections.`;
  } catch (e) { msg = "error: " + e.message; }
  finally { stop(); $("state").textContent = msg; $("enrichBtn").disabled = false; }
};

$("forgetBtn").onclick = async () => {
  if (!confirm("Forget everything Lore has learned?")) return;
  try {
    await post("/api/forget");
    evidence.length = 0; hasMemory = false;
    $("cards").innerHTML = '<p class="hint" id="emptyEv">Nothing remembered yet.</p>';
    $("answers").innerHTML = ""; $("evCount").textContent = "0";
    $("graphPanel").hidden = true;
    $("storyHint").textContent = "Build the memory, then ask it anything — including in a brand-new session.";
    renderChips();
    setStatus("Memory wiped clean.");
  } catch (e) { setStatus("error: " + e.message); }
};

$("recallBtn").onclick = async () => {
  const text = $("query").value.trim();
  if (!text) return;
  if (!hasMemory) { findings(["No memory yet — remember some notes and build it first."], "finding", text); return; }
  $("recallBtn").disabled = true;
  const stop = busy($("answers"), "Searching the memory…", { center: true });
  try { const d = await post("/api/recall", { text }); stop(); findings(d.answers, "finding", text); }
  catch (e) { stop(); findings(["error: " + e.message], "finding"); }
  finally { $("recallBtn").disabled = false; }
};

$("graphBtn").onclick = () => {
  if (!hasMemory) { setStatus("Build the memory first — no graph to show yet."); return; }
  const panel = $("graphPanel");
  panel.hidden = false;
  panel.scrollIntoView({ behavior: "smooth" });
  const stop = busy($("graphLoading"), "Laying out the memory graph…");
  const frame = $("graphFrame");
  frame.onload = () => { stop(); $("graphLoading").textContent = ""; };
  frame.src = "/api/graph?t=" + Date.now();
};

$("query").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !$("recallBtn").disabled) $("recallBtn").click();
});
