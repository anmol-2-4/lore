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

async function addFragment(text) {
  await post("/api/fragment", { text });
  log("added: " + text);
}

$("addBtn").onclick = async () => {
  const text = $("fragment").value.trim();
  if (!text) return;
  $("addBtn").disabled = true;
  try { await addFragment(text); $("fragment").value = ""; }
  catch (e) { log("error: " + e.message); }
  $("addBtn").disabled = false;
};

$("seedBtn").onclick = async () => {
  $("seedBtn").disabled = true;
  for (const f of DEMO) { try { await addFragment(f); } catch (e) { log("error: " + e.message); } }
  $("seedBtn").disabled = false;
};

$("reconstructBtn").onclick = async () => {
  state("Reconstructing the night into a memory graph... (this runs the LLM, give it a moment)");
  $("reconstructBtn").disabled = true;
  try { await post("/api/reconstruct"); state("Memory graph built. Ask away, or view the graph."); }
  catch (e) { state("error: " + e.message); }
  $("reconstructBtn").disabled = false;
};

$("enrichBtn").onclick = async () => {
  state("Connecting the dots across fragments...");
  try { await post("/api/enrich"); state("Memory enriched with new connections."); }
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
  try {
    const data = await post("/api/recall", { text, mode: $("mode").value });
    $("answers").innerHTML = "";
    if (!data.answers.length) { $("answers").innerHTML = "<em>...drawing a blank.</em>"; return; }
    for (const a of data.answers) {
      const div = document.createElement("div");
      div.className = "ans";
      div.textContent = a;
      $("answers").appendChild(div);
    }
  } catch (e) { $("answers").innerHTML = "error: " + e.message; }
};
