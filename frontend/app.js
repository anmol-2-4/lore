const $ = (id) => document.getElementById(id);
const log = (msg) => {
  const li = document.createElement("li");
  li.textContent = msg;
  $("log").prepend(li);
};

async function post(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : "{}",
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

$("rememberBtn").onclick = async () => {
  const text = $("fragment").value.trim();
  if (!text) return;
  $("rememberBtn").disabled = true;
  try {
    await post("/api/remember", { text });
    log("remembered: " + text);
    $("fragment").value = "";
  } catch (e) { log("error: " + e.message); }
  $("rememberBtn").disabled = false;
};

$("improveBtn").onclick = async () => {
  log("connecting the dots...");
  try { await post("/api/improve"); log("memory graph enriched."); }
  catch (e) { log("error: " + e.message); }
};

$("forgetBtn").onclick = async () => {
  if (!confirm("Erase everything?")) return;
  try { await post("/api/forget"); log("the night is gone."); $("answers").innerHTML = ""; }
  catch (e) { log("error: " + e.message); }
};

$("recallBtn").onclick = async () => {
  const text = $("query").value.trim();
  if (!text) return;
  $("answers").innerHTML = "<em>thinking...</em>";
  try {
    const data = await post("/api/recall", { text });
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
