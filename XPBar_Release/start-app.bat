@echo off
REM ──────────────────────────────────────────────
REM  GitItUp — Debug Launcher (Force Open)
REM ──────────────────────────────────────────────

echo.
echo  Checking environment...
echo.

if not exist "%~dp0App" (
    echo  [ERROR] Folder "App" not found in %~dp0
    pause
    exit /b
)

cd /d "%~dp0App"
echo  Current directory: %CD%
echo.

echo  Attempting to run: npm start
echo.

REM Using cmd /k to keep the window open even if the process crashes or terminates
cmd /k "npm start"
