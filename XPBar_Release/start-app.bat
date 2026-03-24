@echo off
REM ──────────────────────────────────────────────
REM  GitItUp — Quick Start (Development Mode)
REM ──────────────────────────────────────────────
REM  This script starts the XP Bar without compiling
REM  to avoid Windows Smart App Control blocks.
REM ──────────────────────────────────────────────

echo  Launching GitItUp...
cd /d "%~dp0"
npm start
