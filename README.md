# 🎮 GitItUp — Gamify Your Git Workflow

![GitItUp Hero](./Resources/hero.png)

**GitItUp** is a sleek, always-on-top desktop overlay that turns every Git commit into an achievement. Level up as you code and transform your development workflow into an engaging progression system.

---

## ✨ Features (v1.1)

- **🔄 Dual Layouts** — Choose between a minimalist **Circular Ring** or a classic **Horizontal XP Bar**.
- **📍 Dynamic Positioning** — Place it anywhere: top-left, top-right, bottom-left, or bottom-right.
- **🔗 Universal Git Integration** — Earn 25 XP automatically on every `git commit` (tracked globally).
- **🕹️ Persistent Progress** — Your level, total commits, and current XP are saved between sessions.
- **👁️ Hover Reveal & Click-Through** — Translucent and non-intrusive by default; becomes fully visible and clickable on mouse hover.
- **📥 System Tray** — Manage your experience from the tray with shape-switching and visibility controls.

---

## 🏗️ Project Structure

This repository contains:

### 🏆 [XP Bar](./XPBar)
The core Electron-based application that powers the overlay.
*   **Electron + Node.js** — Fast, lightweight, and extensible.
*   **Web-Tech Driven** — Styled with CSS animations and HTML5 Canvas.
*   **Local HTTP Server** — Listens on port `31415` for Git hook notifications.

---

## 🚀 Quick Start

To get up and running with **GitItUp**:

1.  **Download & Install**: 
    Clone this repository or download the latest release.
2.  **Activate Progress Tracking**: 
    Run `install-hook.bat` (Windows) in the `XPBar` folder. This sets up a global Git hook so **every repository** on your machine earns you XP.
3.  **Start the Overlay**: 
    Navigate to `XPBar` and run:
    ```bash
    npm install
    npm start
    ```
4.  **Level Up**: 
    Start committing! Each commit grants you **25 XP**. The path to your next level scales by **1.5x** each time you level up.

---

## 🛠️ Customization

You can customize your experience via the **System Tray Icon**:
*   **Change Shape**: Switch between `Circular` and `Horizontal` modes.
*   **Change Position**: Snap the overlay to your preferred corner or screen edge.
*   **Show/Hide**: Need more focus? Hide the bar and bring it back when you're ready to check your stats.

---

## ⚙️ How It Works

1.  The app runs a lightweight HTTP server on `localhost:31415`.
2.  The global Git hook sends a `POST` request to the app after every successful commit.
3.  The overlay receives the signal, triggers a level-up animation, and persists your progress in a local JSON file.
4.  **Manual Query**: You can see your raw stats via `GET http://localhost:31415/status`.

---

## ⚖️ License

Distributed under the ISC License. See `LICENSE` for more information.
