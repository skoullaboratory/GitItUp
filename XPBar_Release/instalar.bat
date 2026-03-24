@echo off
REM ──────────────────────────────────────────────
REM  GitItUp — Unified Quick-Installer
REM ──────────────────────────────────────────────

echo.
echo  Preparing GitItUp environment...
echo.

set "ICON_PATH=%~dp0App\assets\icon.ico"
set "WORK_DIR=%~dp0App"
set "DESKTOP_PATH=%USERPROFILE%\Desktop\GitItUp.lnk"

echo  Creating invisible desktop shortcut...

powershell -Command "$s=(New-Object -ComObject WScript.Shell).CreateShortcut('%DESKTOP_PATH%'); $s.TargetPath='powershell.exe'; $s.Arguments='-ExecutionPolicy Bypass -WindowStyle Hidden -NoProfile -Command \"\"(New-Object -ComObject WScript.Shell).Run(''cmd /c npm start'', 0, $false)\"\"'; $s.IconLocation='%ICON_PATH%'; $s.WorkingDirectory='%WORK_DIR%'; $s.Save()"

if %ERRORLEVEL% EQU 0 (
    echo  [OK] Shortcut created on your Desktop!
) else (
    echo  [ERROR] Failed to create shortcut.
)

echo.
echo  Installation finished. Use the new desktop icon to launch.
echo.
pause
