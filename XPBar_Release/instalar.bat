@echo off
REM ──────────────────────────────────────────────
REM  GitItUp — Advanced Installer
REM ──────────────────────────────────────────────

echo.
echo  === GitItUp Setup ===
echo.

set "ICON_PATH=%~dp0App\assets\icon.ico"
set "WORK_DIR=%~dp0App"

REM Verify environment
if not exist "%WORK_DIR%" (
    echo  [ERROR] Folder "App" missing! Please redownload the repo.
    pause
    exit /b
)

REM Mandatory npm install check
if not exist "%WORK_DIR%\node_modules" (
    echo  [!] Dependencies missing (node_modules).
    echo      Installing now... This may take up to 60 seconds.
    echo.
    
    pushd "%WORK_DIR%"
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo  [ERROR] Failed to install dependencies. 
        echo          Make sure you have Node.js installed!
        popd
        pause
        exit /b
    )
    popd
    echo.
    echo  [OK] Dependencies installed successfully!
)

echo.
echo  Creating invisible desktop shortcut...

REM Using a PowerShell script block for better readability and actual desktop detection
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$desktop = [Environment]::GetFolderPath('Desktop');" ^
    "$shortcutPath = Join-Path $desktop 'GitItUp.lnk';" ^
    "$wshell = New-Object -ComObject WScript.Shell;" ^
    "$shortcut = $wshell.CreateShortcut($shortcutPath);" ^
    "$shortcut.TargetPath = 'powershell.exe';" ^
    "$shortcut.Arguments = '-ExecutionPolicy Bypass -WindowStyle Hidden -NoProfile -Command \"\"(New-Object -ComObject WScript.Shell).Run(''cmd /c npm start'', 0, $false)\"\"';" ^
    "$shortcut.IconLocation = '%ICON_PATH%';" ^
    "$shortcut.WorkingDirectory = '%WORK_DIR%';" ^
    "$shortcut.Save();"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo  [OK] Shortcut "GitItUp" created on your Desktop!
) else (
    echo.
    echo  [ERROR] Failed to create shortcut. Error Level: %ERRORLEVEL%
)

echo.
echo  ------------------------------------------------
echo  Done! You can now close this window and launch 
echo  the app from your Desktop icon.
echo  ------------------------------------------------
echo.
pause
