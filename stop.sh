#!/bin/bash
echo "Stopping DMV Form Filler..."
echo ""

echo "Killing processes on ports 3000 and 5173..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

echo "Killing remaining node processes from this project..."
pgrep -f "dmv-form-filler" | xargs kill -9 2>/dev/null

echo "Killing any orphan concurrently processes..."
pgrep -f "concurrently.*dmv" | xargs kill -9 2>/dev/null

echo ""
echo "All services stopped."
