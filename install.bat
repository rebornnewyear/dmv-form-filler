@echo off
setlocal enabledelayedexpansion

echo ============================================
echo   DMV Form Filler - Installation Script
echo   Windows
echo ============================================
echo.

:: Navigate to project root first
cd /d "%~dp0"

:: ──────────────────────────────────────────────
:: Step 1: Ensure Node.js is installed
:: ──────────────────────────────────────────────
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Node.js is not installed. Installing automatically...
    echo.

    :: Try winget first (Windows 10 1709+ / Windows 11)
    where winget >nul 2>&1
    if !errorlevel! equ 0 (
        echo Installing Node.js via winget...
        winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
        if !errorlevel! neq 0 (
            echo [WARNING] winget install failed, trying alternative method...
            goto :try_msi
        )
        goto :refresh_path
    )

    :try_msi
    echo Downloading Node.js installer...
    set "NODE_MSI=%TEMP%\node-setup.msi"

    :: Detect architecture
    if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
        set "NODE_URL=https://nodejs.org/dist/v20.18.1/node-v20.18.1-x64.msi"
    ) else (
        set "NODE_URL=https://nodejs.org/dist/v20.18.1/node-v20.18.1-x86.msi"
    )

    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '!NODE_URL!' -OutFile '!NODE_MSI!'" 2>nul
    if !errorlevel! neq 0 (
        echo.
        echo [ERROR] Failed to download Node.js installer.
        echo Please install Node.js v20+ manually from https://nodejs.org/
        echo Then re-run this script.
        pause
        exit /b 1
    )

    echo Installing Node.js (this may request Administrator privileges)...
    msiexec /i "!NODE_MSI!" /qn /norestart
    if !errorlevel! neq 0 (
        echo.
        echo [INFO] Silent install requires admin rights. Launching interactive installer...
        msiexec /i "!NODE_MSI!"
        if !errorlevel! neq 0 (
            echo [ERROR] Node.js installation failed.
            echo Please install Node.js v20+ manually from https://nodejs.org/
            del "!NODE_MSI!" >nul 2>&1
            pause
            exit /b 1
        )
    )
    del "!NODE_MSI!" >nul 2>&1

    :refresh_path
    echo.
    echo Refreshing PATH...

    :: Reload PATH from registry so we pick up newly installed Node.js
    for /f "tokens=2*" %%A in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "SYS_PATH=%%B"
    for /f "tokens=2*" %%A in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "USR_PATH=%%B"
    set "PATH=!SYS_PATH!;!USR_PATH!"

    :: Also check common Node.js install locations
    if exist "C:\Program Files\nodejs\node.exe" set "PATH=C:\Program Files\nodejs;!PATH!"
    if exist "%APPDATA%\nvm\current\node.exe" set "PATH=%APPDATA%\nvm\current;!PATH!"
    if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;!PATH!"

    where node >nul 2>&1
    if !errorlevel! neq 0 (
        echo.
        echo [WARNING] Node.js was installed but is not yet in PATH for this session.
        echo Please close this terminal, open a new one, and run install.bat again.
        pause
        exit /b 0
    )
)

for /f "delims=" %%v in ('node -v') do set NODE_VER=%%v
echo [OK] Node.js found: %NODE_VER%

:: ──────────────────────────────────────────────
:: Step 2: Verify npm
:: ──────────────────────────────────────────────
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not available. It should be bundled with Node.js.
    echo Try reinstalling Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "delims=" %%v in ('npm -v') do set NPM_VER=%%v
echo [OK] npm found: %NPM_VER%
echo.

:: ──────────────────────────────────────────────
:: Step 3: Install project dependencies
:: ──────────────────────────────────────────────
echo Installing project dependencies (this may take a few minutes)...
echo.

call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] npm install failed. Check the output above for details.
    pause
    exit /b 1
)

echo.

:: ──────────────────────────────────────────────
:: Step 4: Generate PDF template if missing
:: ──────────────────────────────────────────────
if not exist "backend\templates\REG-156.pdf" (
    echo Generating PDF template...
    node backend\scripts\create-template.mjs
    if %errorlevel% neq 0 (
        echo [WARNING] PDF template generation failed. You can retry manually:
        echo   node backend\scripts\create-template.mjs
    ) else (
        echo [OK] PDF template generated.
    )
) else (
    echo [OK] PDF template already exists.
)

echo.
echo ============================================
echo   Installation complete!
echo ============================================
echo.
echo To start the application:
echo   start.bat
echo.
echo To run tests:
echo   npm test
echo.
echo Application URLs (after starting):
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3000
echo.
pause
