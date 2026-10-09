// Auto Scroll Reader - content script
(() => {
  if (window.__autoScrollReader) return;
  window.__autoScrollReader = true;

  let running = false;
  let speed = 40;          // pixels per second
  let lastTime = null;
  let carry = 0;           // fractional pixels carried between frames
  let target = null;       // element being scrolled
  let pill = null;

  chrome.storage.sync.get({ speed: 40 }, (s) => { speed = s.speed; updatePill(); });
  chrome.storage.onChanged.addListener((c) => {
    if (c.speed) { speed = c.speed.newValue; updatePill(); }
  });

  // Pick what to scroll: the page itself, or the biggest scrollable box
  // (for sites like Gmail/Docs where the page body doesn't scroll).
  function findTarget() {
    const root = document.scrollingElement || document.documentElement;
    if (root.scrollHeight - root.clientHeight > 50) return root;
    let best = null, bestArea = 0;
    for (const el of document.querySelectorAll("body *")) {
      if (el.scrollHeight - el.clientHeight < 50) continue;
      const oy = getComputedStyle(el).overflowY;
      if (oy !== "auto" && oy !== "scroll") continue;
      const area = el.clientWidth * el.clientHeight;
      if (area > bestArea) { best = el; bestArea = area; }
    }
    return best || root;
  }

  function atBottom(el) {
    return Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 1;
  }

  function step(now) {
    if (!running) return;
    if (lastTime === null) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.1); // cap if tab was hidden
    lastTime = now;

    carry += speed * dt;
    const px = Math.floor(carry);
    if (px >= 1) {
      carry -= px;
      target.scrollTop += px;
      if (atBottom(target)) { stop(); return; }
    }
    requestAnimationFrame(step);
  }

  function start() {
    if (running) return;
    target = findTarget();
    if (atBottom(target)) return;
    running = true;
    lastTime = null;
    carry = 0;
    requestAnimationFrame(step);
    updatePill();
  }

  function stop() {
    running = false;
    updatePill();
  }

  function toggle() { running ? stop() : start(); }

  // Small floating control so you can pause/resume without opening the popup.
  function updatePill() {
    if (!pill && !running) return;
    if (!pill) {
      pill = document.createElement("div");
      Object.assign(pill.style, {
        position: "fixed", right: "16px", bottom: "16px", zIndex: 2147483647,
        background: "rgba(17,24,39,0.85)", color: "#fff", font: "13px/1 system-ui, sans-serif",
        padding: "8px 12px", borderRadius: "999px", cursor: "pointer", userSelect: "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)", display: "flex", gap: "10px", alignItems: "center"
      });
      pill.title = "Click to pause/resume (Alt+Shift+S). Double-click to hide.";
      pill.addEventListener("click", toggle);
      pill.addEventListener("dblclick", () => { stop(); pill.remove(); pill = null; });
      document.documentElement.appendChild(pill);
    }
    pill.textContent = (running ? "❚❚ Pause" : "▶ Resume") + `  ·  ${speed} px/s`;
  }

  // Keyboard: Esc pauses while scrolling.
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && running) stop();
  });

  chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
    if (msg.type === "toggle") toggle();
    else if (msg.type === "start") start();
    else if (msg.type === "stop") stop();
    reply({ running, speed });
  });
})();
