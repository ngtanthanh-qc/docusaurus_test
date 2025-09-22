#!/bin/bash

echo "Starting Docusaurus in multiple locales..."
echo "=========================================="
echo ""
echo "[1] English - http://localhost:3000"
echo "[2] Vietnamese - http://localhost:3001"
echo ""

# Function to kill servers on exit
cleanup() {
    echo "Stopping servers..."
    kill $PID1 $PID2 2>/dev/null
    exit
}

# Set up trap to clean up on script exit
trap cleanup EXIT INT TERM

# Start English version in background
npm start -- --locale en --port 3000 &
PID1=$!
echo "Started English server (PID: $PID1)"

# Wait a bit before starting second server
sleep 3

# Start Vietnamese version in background
npm start -- --locale vi --port 3001 &
PID2=$!
echo "Started Vietnamese server (PID: $PID2)"

echo ""
echo "Both servers are running!"
echo "English: http://localhost:3000"
echo "Vietnamese: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Wait for both processes
wait $PID1 $PID2