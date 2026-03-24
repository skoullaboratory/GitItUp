# 🎮 GitItUp — Gamify Your Git Workflow

[![GitItUp Hero](https://github.com/skoullaboratory/GitItUp/raw/main/Resources/hero.png)](https://github.com/skoullaboratory/GitItUp)

**GitItUp** is a toolset designed to make your coding sessions more engaging by turning every Git commit into an achievement. At its core is the **XP Bar**, a sleek desktop overlay that tracks your progress and levels you up as you code.

---

## 🏗️ Project Structure

This repository contains the following components:

### 🏆 [XP Bar](./XPBar)
An Electron-based desktop application that displays a non-interactive, always-on-top experience bar.
*   **XP Ring Overlay** — Minimalist circular progress bar in the bottom-right corner.
*   **Git Integration** — Gains XP automatically on every `git commit`.
*   **System Tray** — Minimize to tray, hide/show, and quit easily.
*   **Persistent** — Your level and total commits are saved between sessions.

---

## 🚀 Quick Start

To get up and running with the XP Bar:

1.  **Download & Run**:
    Go to the [Releases](https://github.com/skoullaboratory/GitItUp/releases) page and download `Git XP Bar.exe`.
2.  **Activate Experience**:
    Run `install-hook.bat` in the application folder. This will set up a global Git hook so **all** your repositories earn you XP.
3.  **Level Up**:
    Start committing! Each commit grants you **25 XP**. Your level requirement increases by **1.5x** each time you level up.

---

## 🛠️ Development

If you'd like to build the project from source or customize the XP curve:

```bash
cd XPBar
npm install
npm start
```

For more technical details, check out the [XPBar README](./XPBar/README.md).

---

## ⚖️ License

Distributed under the ISC License. See `LICENSE` for more information.
