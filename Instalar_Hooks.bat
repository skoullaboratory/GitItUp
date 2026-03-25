@echo off
SETLOCAL EnableDelayedExpansion

set HOOKS_DIR=%APPDATA%\git-it-up\hooks
if not exist "%HOOKS_DIR%" mkdir "%HOOKS_DIR%"

echo [1/3] Creando archivos de hook en: %HOOKS_DIR%

:: Creamos los archivos uno a uno asegurando el formato LF
(
echo #!/bin/sh
echo # GitItUp Hook
echo curl -s -X POST http://127.0.0.1:31415/commit ^> /dev/null 2^>^&1 ^&
echo exit 0
) > "%HOOKS_DIR%\post-commit"

(
echo #!/bin/sh
echo # GitItUp Hook
echo curl -s -X POST http://127.0.0.1:31415/push ^> /dev/null 2^>^&1 ^&
echo exit 0
) > "%HOOKS_DIR%\pre-push"

(
echo #!/bin/sh
echo # GitItUp Hook
echo curl -s -X POST http://127.0.0.1:31415/pr ^> /dev/null 2^>^&1 ^&
echo exit 0
) > "%HOOKS_DIR%\post-merge"

echo [2/3] Configurando Git Global...
:: Convertimos barras invertidas a barras normales para Git
set GIT_HOOKS_PATH=%HOOKS_DIR:\=/%
git config --global core.hooksPath "%GIT_HOOKS_PATH%"

echo [3/3] Verificando configuracion...
git config --global core.hooksPath

echo.
echo ==========================================
echo  ¡Hooks instalados con exito! 🚀
echo  Ahora los Commits, Pushes y Merges sumaran XP.
echo ==========================================
pause
