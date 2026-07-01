const $ = (id) => document.getElementById(id);
const state = (msg) => { $("state").textContent = msg; };
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

function render(items, cls) {
  $("answers").innerHTML = "";
  if (!items || !items.length) { $("answers").innerHTML = "<em>...nothing.</em>"; return; }
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
  try { const r = await post("/api/fragment", { text }); log("staged: " + text); state(`${r.staged} fragment(s) staged — hit "Remember the night".`); $("fragment").value = ""; }
  catch (e) { log("error: " + e.message); }
  $("addBtn").disabled = false;
};

$("seedBtn").onclick = async () => {
  $("seedBtn").disabled = true;
  let n = 0;
  for (const f of DEMO) { try { await post("/api/fragment", { text: f }); log("staged: " + f); n++; } catch (e) { log("error: " + e.message); } }
  state(`${n} fragments staged — hit "Remember the night".`);
  $("seedBtn").disabled = false;
};

$("reconstructBtn").onclick = async () => {
  state("Remembering — building the Cognee memory graph (runs the local LLM, give it a moment)...");
  $("reconstructBtn").disabled = true;
  try { await post("/api/reconstruct"); state("Committed to memory. Ask away, spot contradictions, or view the graph."); }
  catch (e) { state("error: " + e.message); }
  $("reconstructBtn").disabled = false;
};

$("enrichBtn").onclick = async () => {
  state("Connecting the dots across memories...");
  try { await post("/api/improve"); state("Memory enriched."); }
  catch (e) { state("error: " + e.message); }
};

$("graphBtn").onclick = () => window.open("/api/graph", "_blank");

$("forgetBtn").onclick = async () => {
  if (!confirm("Erase everything?")) return;
  try { await post("/api/forget"); state("The night is gone."); $("answers").innerHTML = ""; $("log").innerHTML = ""; }
  catch (e) { state("error: " + e.message); }
};

$("recallBtn").onclick = async () => {
  const text = $("query").value.trim();
  if (!text) return;
  $("answers").innerHTML = "<em>thinking...</em>";
  try { const data = await post("/api/recall", { text }); render(data.answers, "ans"); }
  catch (e) { $("answers").innerHTML = "error: " + e.message; }
};

$("contraBtn").onclick = async () => {
  $("answers").innerHTML = "<em>cross-checking memories for conflicts...</em>";
  try { const data = await post("/api/contradictions"); render(data.conflicts, "ans conflict"); }
  catch (e) { $("answers").innerHTML = "error: " + e.message; }
};
