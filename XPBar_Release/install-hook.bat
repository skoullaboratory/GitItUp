@echo off
REM ──────────────────────────────────────────────
REM  XP Bar — Global Git Hook Installer (Windows)
REM ──────────────────────────────────────────────
REM  This script sets up a global post-commit hook
REM  so ALL your git repos notify the XP Bar app.
REM ──────────────────────────────────────────────

set HOOKS_DIR=%USERPROFILE%\.git-hooks

echo.
echo  === XP Bar — Git Hook Setup ===
echo.

REM Create the global hooks directory
if not exist "%HOOKS_DIR%" (
    mkdir "%HOOKS_DIR%"
    echo  [OK] Created %HOOKS_DIR%
) else (
    echo  [OK] %HOOKS_DIR% already exists
)

REM Copy the post-commit hook
copy /Y "%~dp0App\hooks\post-commit" "%HOOKS_DIR%\post-commit" > nul
echo  [OK] Installed post-commit hook

REM Configure git to use global hooks
git config --global core.hooksPath "%HOOKS_DIR%"
echo  [OK] Set global core.hooksPath to %HOOKS_DIR%

echo.
echo  Done! Every git commit will now give you XP.
echo  Make sure the XP Bar app is running (npm start).
echo.
pause
