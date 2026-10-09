// Sends a message to the page, injecting the content script first if the tab
// was open before the extension was installed.
async function send(tabId, msg) {
  try {
    return await chrome.tabs.sendMessage(tabId, msg);
  } catch {
    await chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] });
    return await chrome.tabs.sendMessage(tabId, msg);
  }
}

chrome.commands.onCommand.addListener(async (cmd) => {
  if (cmd !== "toggle-scroll") return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) send(tab.id, { type: "toggle" }).catch(() => {});
});

chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  if (msg.type !== "relay") return;
  send(msg.tabId, msg.payload).then(reply).catch((e) => reply({ error: String(e) }));
  return true;
});
