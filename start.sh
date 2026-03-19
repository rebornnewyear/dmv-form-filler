#!/bin/bash
echo "Checking for leftover processes..."

PORT3000=$(lsof -ti:3000 2>/dev/null)
if [ -n "$PORT3000" ]; then
    echo "Found process on port 3000 (PID $PORT3000), killing..."
    echo "$PORT3000" | xargs kill -9 2>/dev/null
fi

PORT5173=$(lsof -ti:5173 2>/dev/null)
if [ -n "$PORT5173" ]; then
    echo "Found process on port 5173 (PID $PORT5173), killing..."
    echo "$PORT5173" | xargs kill -9 2>/dev/null
fi

ORPHANS=$(pgrep -f "dmv-form-filler" 2>/dev/null)
if [ -n "$ORPHANS" ]; then
    echo "Found orphan node processes, killing..."
    echo "$ORPHANS" | xargs kill -9 2>/dev/null
fi

sleep 1

echo ""
echo "Starting DMV Form Filler..."
echo ""
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services."
echo ""
cd "$(dirname "$0")"
npm run dev
