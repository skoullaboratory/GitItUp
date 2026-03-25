# 🎮 GitItUp — Level Up Your Code (v0.0.1)

**GitItUp** is a sleek, always-on-top desktop overlay that gamifies your coding workflow. Every Git commit earns you XP and levels you up, transforming your daily tasks into an engaging progression system.

![GitItUp Hero](./Resources/hero.png)

---

## 🚀 Recent Changes (v0.0.1 Release)

Compared to previous internal builds, this release introduces several major enhancements:

*   **🛠️ Unified Settings Interface**: Tray icon settings have been consolidated into a beautiful in-app overlay. Access themes, positions, and shapes directly from the gear icon on hover.
*   **🎨 Premium Theme Engine**: A new visual picker with 10 hand-crafted gradients (Neon Cyan, Sunset, Cyberpunk, etc.).
*   **🚪 Instant Exit**: Added a dedicated "Salir Aplicación" button within the settings menu for clean termination.
*   **📦 Portable Build**: The project is now compiled into a standalone Windows executable (`.exe`) located in `XPBar/dist/`.
*   **🔧 Professional Experience**: Improved window logic for "Always on Top" and click-through/hover transitions.

---

## ✨ Core Features

- **🔄 Dual Layouts** — Switch between a minimalist **Circular Ring** or a classic **Horizontal XP Bar**.
- **📍 Multi-Positioning** — Snap to any screen corner: top-left, top-right, bottom-left, or bottom-right.
- **👁️ Smart Visibility** — Stays translucent (low opacity) and click-through while you work; becomes fully opaque and interactive on mouse hover.
- **🎚️ Transparency Control** — Adjust your preferred idle opacity using a slider in the settings.
- **🕹️ Persistent Leveling** — Your level, XP, and layout settings are automatically saved and restored.

---

## 📂 Project Structure

This repository is organized as follows:

### 🏆 [XP Bar](./XPBar)
The core Electron-based application.
*   **Electron Main**: Manages the window, tray, and persistence.
*   **Local HTTP API**: Listens on port `31415` for commit signals from Git hooks.
*   **Frontend**: Built with HTML5, CSS animations, and Outfit typography.

---

## 🛠️ Getting Started

1.  **Download/Clone** the repository.
2.  **Run the Executable**: Navigate to `XPBar/dist/` and run `GitItUp 0.0.1.exe`.
3.  **Start Coding**: Every `git commit` you make will now grant you XP and level you up!

---

## ⚙️ How It Works

1.  The app runs a lightweight HTTP server on `localhost:31415`.
2.  Your Git hook sends a `POST` request to the app after every successful commit.
3.  The overlay receives the signal, triggers a level-up animation, and persists your progress in a local JSON file.
4.  **Manual Query**: You can see your raw stats via `GET http://localhost:31415/status`.

---

## ⚖️ License

Distributed under the ISC License. See `LICENSE` for more information.
