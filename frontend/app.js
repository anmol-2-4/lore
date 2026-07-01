const $ = (id) => document.getElementById(id);
const log = (msg) => {
  const li = document.createElement("li");
  li.textContent = msg;
  $("log").prepend(li);
};

const DEMO = [
  "Around 9pm I was at the Bellagio bar with someone named Sarah.",
  "Sarah said she works as a blackjack dealer and lost my jacket at the pool.",
  "Receipt for $240 from 'Neon Noodle' timestamped 1:14am.",
  "Blurry photo caption: 'me + Sarah + a guy in an Elvis costume'.",
  "Hotel keycard sleeve: room 1207, The Venetian.",
  "Text from an unknown number at 2:03am: 'you still owe me for the cab lol'.",
  "I'm now pretty sure I left my jacket in the back of the taxi, not at the pool.",
];

async function post(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : "{}",
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

// live "spinner + elapsed seconds" feedback; returns a stop() fn
function busy(el, label, { center } = {}) {
  const start = Date.now();
  el.innerHTML =
    `<div class="${center ? "center" : ""}"><span class="spinner"></span> ` +
    `${label} <span class="elapsed">0s</span></div>`;
  const span = el.querySelector(".elapsed");
  const id = setInterval(() => {
    span.textContent = Math.round((Date.now() - start) / 1000) + "s";
  }, 1000);
  return () => clearInterval(id);
}

function render(items, cls) {
  $("answers").innerHTML = "";
  if (!items || !items.length) {
    $("answers").innerHTML = '<div class="center">...nothing.</div>';
    return;
  }
  for (const a of items) {
    const div = document.createElement("div");
    div.className = cls;
    div.textContent = a;
    $("answers").appendChild(div);
  }
}

$("addBtn").onclick = async () => {
  const text = $("fragment").value.trim();
  if (!text) return;
  $("addBtn").disabled = true;
  try {
    const r = await post("/api/fragment", { text });
    log("staged: " + text);
    $("state").textContent = `${r.staged} fragment(s) staged — hit "Remember the night".`;
    $("fragment").value = "";
  } catch (e) { log("error: " + e.message); }
  $("addBtn").disabled = false;
};

$("seedBtn").onclick = async () => {
  $("seedBtn").disabled = true;
  let n = 0;
  for (const f of DEMO) {
    try { await post("/api/fragment", { text: f }); log("staged: " + f); n++; }
    catch (e) { log("error: " + e.message); }
  }
  $("state").textContent = `${n} fragments staged — hit "Remember the night".`;
  $("seedBtn").disabled = false;
};

$("reconstructBtn").onclick = async () => {
  $("reconstructBtn").disabled = true;
  const stop = busy($("state"), "Building the memory graph (running the local LLM)…");
  try { await post("/api/reconstruct"); $("state").textContent = "Committed to memory. Ask away, spot contradictions, or view the graph."; }
  catch (e) { $("state").textContent = "error: " + e.message; }
  finally { stop(); $("reconstructBtn").disabled = false; }
};

$("enrichBtn").onclick = async () => {
  $("enrichBtn").disabled = true;
  const stop = busy($("state"), "Connecting the dots across memories…");
  try { await post("/api/improve"); $("state").textContent = "Memory enriched."; }
  catch (e) { $("state").textContent = "error: " + e.message; }
  finally { stop(); $("enrichBtn").disabled = false; }
};

$("forgetBtn").onclick = async () => {
  if (!confirm("Erase everything?")) return;
  try {
    await post("/api/forget");
    $("state").textContent = "The night is gone.";
    $("answers").innerHTML = ""; $("log").innerHTML = "";
    $("graphPanel").hidden = true;
  } catch (e) { $("state").textContent = "error: " + e.message; }
};

$("recallBtn").onclick = async () => {
  const text = $("query").value.trim();
  if (!text) return;
  $("recallBtn").disabled = true;
  const stop = busy($("answers"), "Searching the memory graph…", { center: true });
  try { const data = await post("/api/recall", { text }); stop(); render(data.answers, "ans"); }
  catch (e) { stop(); $("answers").innerHTML = '<div class="center">error: ' + e.message + "</div>"; }
  finally { $("recallBtn").disabled = false; }
};

$("contraBtn").onclick = async () => {
  $("contraBtn").disabled = true;
  const stop = busy($("answers"), "Cross-checking memories for conflicts…", { center: true });
  try { const data = await post("/api/contradictions"); stop(); render(data.conflicts, "ans conflict"); }
  catch (e) { stop(); $("answers").innerHTML = '<div class="center">error: ' + e.message + "</div>"; }
  finally { $("contraBtn").disabled = false; }
};

$("graphBtn").onclick = () => {
  const panel = $("graphPanel");
  panel.hidden = false;
  panel.scrollIntoView({ behavior: "smooth" });
  const stop = busy($("graphLoading"), "Rendering the memory graph…");
  const frame = $("graphFrame");
  frame.onload = () => { stop(); $("graphLoading").textContent = ""; };
  frame.src = "/api/graph?t=" + Date.now();
};
