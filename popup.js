const btn = document.getElementById("toggle");
const slider = document.getElementById("speed");
const val = document.getElementById("val");
const err = document.getElementById("err");
let tabId;

function render(state) {
  if (!state || state.error) {
    err.textContent = "Can't scroll this page (Chrome blocks extensions on chrome:// pages and the Web Store).";
    btn.disabled = true;
    return;
  }
  btn.textContent = state.running ? "❚❚ Pause" : "▶ Start / Resume";
  btn.className = state.running ? "running" : "paused";
}

function send(payload) {
  return chrome.runtime.sendMessage({ type: "relay", tabId, payload });
}

function setSpeed(v) {
  slider.value = v;
  val.textContent = `${v} px/s`;
  chrome.storage.sync.set({ speed: Number(v) });
}

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  tabId = tab.id;
  const { speed } = await chrome.storage.sync.get({ speed: 40 });
  slider.value = speed;
  val.textContent = `${speed} px/s`;
  render(await send({ type: "status" }));
})();

btn.addEventListener("click", async () => render(await send({ type: "toggle" })));
slider.addEventListener("input", () => setSpeed(slider.value));
document.querySelectorAll(".presets span").forEach((p) =>
  p.addEventListener("click", () => setSpeed(p.dataset.v))
);
