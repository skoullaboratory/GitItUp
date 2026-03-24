# 🎮 XP Bar — Git Gamification

A lightweight desktop overlay that gamifies your coding workflow. Every Git commit earns you XP and levels you up!

## ✨ Features

- **XP Ring Overlay** — Always-on-top circular progress bar in the corner of your screen
- **Git Integration** — Automatically gains XP on every `git commit`
- **Leveling System** — XP requirements increase with each level (×1.5 scaling)
- **Persistent Progress** — Your level and XP are saved between sessions
- **Hover Reveal** — Translucent by default, fully visible on mouse hover
- **Slider (Debug)** — Manual XP slider for testing (visible on hover)

## 🚀 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the App
```bash
npm start
```

### 3. Install the Git Hook
Run the installer script to enable XP tracking for **all** your Git repositories:

**Windows:**
```bash
install-hook.bat
```

**Mac/Linux:**
```bash
chmod +x install-hook.sh
./install-hook.sh
```

This sets up a global `post-commit` hook that notifies the XP Bar on every commit.

## ⚙️ Configuration

Edit the constants in `main.js` and `index.html`:

| Constant | Default | Description |
|---|---|---|
| `BASE_XP` | `100` | XP needed for level 1 → 2 |
| `XP_PER_COMMIT` | `25` | XP earned per commit |
| `GROWTH_FACTOR` | `1.5` | XP multiplier per level |

### XP Curve Example
| Level | XP Required |
|---|---|
| 1 → 2 | 100 |
| 2 → 3 | 150 |
| 3 → 4 | 225 |
| 4 → 5 | 337 |
| 5 → 6 | 506 |

## 🔧 How It Works

1. The app runs a tiny HTTP server on `localhost:31415`
2. The global Git hook sends `POST /commit` after every commit
3. The app receives it, adds XP, updates the ring, and saves progress
4. Check status anytime: `GET http://localhost:31415/status`

## 📁 Project Structure

```
XPBar/
├── main.js            # Electron main process + HTTP server
├── index.html         # UI + XP logic
├── style.css          # Styles
├── hooks/
│   └── post-commit    # Git hook script
├── install-hook.bat   # Windows hook installer
└── package.json
```
