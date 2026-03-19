@echo off
echo Stopping DMV Form Filler...
echo.

echo Killing processes on ports 3000 and 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do taskkill /PID %%a /F >nul 2>&1

echo Killing remaining node processes from this project...
for /f "tokens=2" %%a in ('wmic process where "commandline like '%%dmv-form-filler%%' and name='node.exe'" get processid /format:list 2^>nul ^| findstr ProcessId') do (
    for /f "tokens=2 delims==" %%b in ("%%a") do taskkill /PID %%b /F >nul 2>&1
)

echo Killing any orphan concurrently processes...
for /f "tokens=2" %%a in ('wmic process where "commandline like '%%concurrently%%' and commandline like '%%dmv%%'" get processid /format:list 2^>nul ^| findstr ProcessId') do (
    for /f "tokens=2 delims==" %%b in ("%%a") do taskkill /PID %%b /F >nul 2>&1
)

echo.
echo All services stopped.
pause
