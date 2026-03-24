@echo off
REM ──────────────────────────────────────────────
REM  GitItUp — Desktop Shortcut Installer
REM ──────────────────────────────────────────────

echo.
echo  Creating desktop shortcut for GitItUp...
echo.

set "SCRIPT_PATH=%~dp0start-silent.vbs"
set "ICON_PATH=%~dp0dist\.icon-ico\icon.ico"
set "WORK_DIR=%~dp0"
set "DESKTOP_PATH=%USERPROFILE%\Desktop\GitItUp.lnk"

powershell -Command "$s=(New-Object -ComObject WScript.Shell).CreateShortcut('%DESKTOP_PATH%'); $s.TargetPath='wscript.exe'; $s.Arguments='\"%SCRIPT_PATH%\"'; $s.IconLocation='%ICON_PATH%'; $s.WorkingDirectory='%WORK_DIR%'; $s.Save()"

if %ERRORLEVEL% EQU 0 (
    echo  [OK] Shortcut created on your Desktop!
) else (
    echo  [ERROR] Failed to create shortcut.
)

echo.
pause
