# 🎮 GitItUp — Git Gamification (v0.0.1)

![GitItUp Hero](../Resources/hero.png)

A lightweight desktop overlay that gamifies your coding workflow. Every Git commit earns you XP and levels you up!

---

## ✨ Features

- **🔄 Shapes & Layouts** — Choose from a minimalist circular ring or a classic horizontal bar.
- **📍 Multi-Positioning** — Snap to any screen corner or edge via the tray menu.
- **Git Integration** — Automatically gains XP on every successful `git commit`.
- **🕹️ Leveling System** — XP requirements increase with each level (×1.5 scaling).
- **Persistent Progress** — Your level, XP, and layout settings are saved between sessions.
- **👁️ Hover Reveal** — Translucent by default (level 0.1), fully visible and clickable (level 1.0) on mouse hover.
- **📥 System Tray** — Control the app, change layouts, and manage visibility from the tray.

---

## 🚀 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the App
```bash
npm start
```

### 3. Install the Global Git Hook
Run the installer script to enable XP tracking for **all** your Git repositories.

**Windows:**
```powershell
.\install-hook.bat
```

**Linux/Mac (Placeholder):**
```bash
# Ensure you have git installed and running.
# Soon: ./install-hook.sh
```

---

## ⚙️ Configuration

Edit the constants in `main.js` and `index.html` to customize the progression speed.

| Constant | Default | Description |
|---|---|---|
| `BASE_XP` | `100` | XP needed for level 1 → 2 |
| `XP_PER_COMMIT` | `25` | XP earned per commit |
| `GROWTH_FACTOR` | `1.5` | XP multiplier per level |

### Current Level Curve:
| Level | XP Required |
|---|---|
| 1 → 2 | 100 |
| 2 → 3 | 150 |
| 3 → 4 | 225 |
| 4 → 5 | 338 |

---

## 🔧 Technical Overview

1.  **Main Process**: Electrons `main.js` runs a tiny HTTP server on `localhost:31415`.
2.  **Notification Hub**: The global Git hook sends a `POST /commit` signal after every commit.
3.  **UI Updates**: The app receives the signal, appends XP, triggers a CSS animation, and saves data to `xp-data.json`.
4.  **Local API**:
    - `POST /commit`: Add 25 XP.
    - `GET /status`: View current level, total commits, and current XP.

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
├── install-hook.bat    # Windows hook installer
└── package.json        # Dependencies & scripts
```

---

## ⚖️ License

Distributed under the ISC License. See `LICENSE` for more information.
