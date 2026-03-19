@echo off
echo Checking for leftover processes...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Found process on port 3000 ^(PID %%a^), killing...
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    echo Found process on port 5173 ^(PID %%a^), killing...
    taskkill /PID %%a /F >nul 2>&1
)

for /f "tokens=2" %%a in ('wmic process where "commandline like '%%dmv-form-filler%%' and name='node.exe'" get processid /format:list 2^>nul ^| findstr ProcessId') do (
    for /f "tokens=2 delims==" %%b in ("%%a") do (
        echo Found orphan node process ^(PID %%b^), killing...
        taskkill /PID %%b /F >nul 2>&1
    )
)

timeout /t 1 /nobreak >nul

echo.
echo Starting DMV Form Filler...
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C to stop all services.
echo.
cd /d "%~dp0"
npm run dev
