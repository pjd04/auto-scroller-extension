# Auto Scroll Reader

A Chrome extension that slowly scrolls the page so you can read along hands-free. Pause and resume anytime.

## Features

- **Adjustable speed** from 5 to 200 pixels per second, with Slow, Medium, and Fast presets
- **Keyboard shortcut:** `Alt+Shift+S` starts and pauses from anywhere. `Esc` pauses.
- **Floating control:** a small button on the page to pause or resume without opening the popup. Double-click it to hide it.
- **Works on tricky sites** like Gmail and Google Docs by finding the main scrolling area when the page itself doesn't scroll
- **Stops at the bottom** of the page on its own, and remembers your speed

## Install

1. Download this repo: click the green **Code** button, then **Download ZIP**, and unzip it.
2. Open Chrome and go to `chrome://extensions`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and choose the unzipped folder (the one that contains `manifest.json`).
5. Pin the extension from the puzzle-piece menu so it's easy to reach.

## Use

Open any article, click the extension icon, and press **Start**. Drag the slider or pick a preset to change speed.

Chrome doesn't let extensions run on `chrome://` pages or the Chrome Web Store, so it won't scroll those.

## How it works

Built with Chrome's Manifest V3.

| File | What it does |
| --- | --- |
| `manifest.json` | Extension settings, permissions, and the keyboard shortcut |
| `popup.html` / `popup.js` | The start button, speed slider, and presets |
| `content.js` | Runs on the page: picks what to scroll and scrolls it smoothly with `requestAnimationFrame` |
| `background.js` | Handles the shortcut and passes messages between the popup and the page |

## Version

1.0.0
