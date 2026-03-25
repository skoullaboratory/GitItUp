# 🏆 XP Bar — Git Gamification (v0.0.1)

A lightweight desktop overlay that gamifies your coding workflow. Every Git commit earns you XP and levels you up!

![GitItUp Hero](../Resources/hero.png)

---

## 🔥 New in this Release

*   **Unified UI**: Settings for shape, theme, and position are now available directly in the overlay (gear icon).
*   **System Exit**: Dedicated button to shut down the app without using the Task Manager.
*   **Persistent Customization**: Now saves your preferred theme, opacity, and positioning between restarts.
*   **Window Optimization**: Improved logic for "Always on Top" and click-through/hover transitions.
*   **Portable Executable**: Standalone compiled build ready in the `dist` folder.

---

## ✨ Features

- **🔄 Dual Layouts** — Minimalist circular ring or classic horizontal bar.
- **🎨 10 Visual Themes** — From Neon Cyan to Cyberpunk and Sunset.
- **📍 Multi-Positioning** — Snap to any screen corner or edge (Top/Bottom).
- **🕹️ Leveling System** — XP requirements scale exponentially (×1.5 factor).
- **👁️ Smart Hover** — Stays at 15% opacity (customizable) while coding; 100% on hover.
- **💾 Auto-Save** — Progressive tracking stored in `xp-data.json`.

---

## 🚀 Setup & Execution

### 1. Run the App
Navigate to the `dist/` directory and run **`GitItUp 0.0.1.exe`**.

### 2. Performance Note
The app runs a lightweight HTTP server to listen for commits. Ensure port `31415` is not blocked by local firewall policies.

---

## ⚙️ Configuration

Customization is available via the in-app settings (gear icon) or the System Tray.

| Parameter | Default | Location |
|---|---|---|
| `BASE_XP` | `100` | XP needed for Lvl 1 → 2 |
| `XP_PER_COMMIT` | `25` | XP earned per commit |
| `GROWTH_FACTOR` | `1.5` | XP multiplier per level |

---

## 🔧 Technical Overview

1.  **Main Process**: Electron's `main.js` runs a local HTTP server on `127.0.0.1:31415`.
2.  **Notification Hub**: Git post-commit hooks should send a `POST /commit` signal to the app.
3.  **UI Updates**: `index.html` receives the IPC signal, appends XP, and triggers CSS/Particle animations.
4.  **Local API**:
    - `POST /commit`: Add XP.
    - `GET /status`: View current progress JSON.

---

## 📁 Project Structure

```text
XPBar/
├── main.js             # Electron main & HTTP server
├── index.html          # UI and XP logic
├── style.css           # Styling & animations
├── icon.png            # App & Tray icon
├── hooks/
│   └── post-commit     # The Git hook script
└── package.json        # Dependencies & scripts
```

---

## ⚖️ License

Distributed under the ISC License. See `LICENSE` for more information.
