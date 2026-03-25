# GitItUp — Level Up Your Code (v0.3)

GitItUp is a sleek, always-on-top desktop overlay that gamifies your coding workflow. Every Git commit earns you XP, increases your daily streak, and triggers high-juice visual rewards.

---

## What's New in v0.3

*   **Integrated Reward System**: Experience the "juice" with new XP orb absorption animations that fly directly to your progress bar.
*   **Epic Level Ups**: Multi-effect feedback including screen shake, radial flashes, and floating "LEVEL UP!" text.
*   **Daily Streak Tracking**: A new animated flame indicator tracks how many consecutive days you've been committing code.
*   **Unified Settings Overlay**: Access all customization (themes, layouts, opacity) from a single in-app menu with intuitive "Back" navigation.
*   **Intelligent UI**: The overlay now detects your taskbar position to prevent overlaps and ensures the settings panel is always fully visible.
*   **Minimalist Tray**: A cleaner system tray experience focused on essentials.

---

## Core Features

- **Dual Layouts**: Switch between a minimalist Circular Ring or a classic Horizontal XP Bar.
- **Visual Themes**: Choose from 10 premium gradients that apply to the bar, particles, and the new streak flame.
- **Smart Visibility**: Non-intrusive 15% opacity while working; 100% opacity and interactivity on hover.
- **Persistent Progress**: Your level, XP, total commits, and daily streak are automatically saved.

---

## Project Structure

### [GitItUp](./XPBar)
The core Electron application.
*   **Electron Main**: Process management and local persistence.
*   **Local HTTP API**: Listens on port 31415 for Git activity.
*   **Frontend**: Built with vanilla hardware-accelerated web tech.

---

## Getting Started

1.  **Download** the repository or the latest release.
2.  **Run**: Open `XPBar/dist/GitItUp 0.3.0.exe`.
3.  **Level Up**: Start making commits to see your XP grow and your streak ignite.

---

## License

Distributed under the ISC License. See `LICENSE` for more information.
