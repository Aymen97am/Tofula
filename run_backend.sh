#!/bin/bash

# Script to run the Tofula backend
# Run this from the project root directory

echo "🚀 Starting Tofula Backend..."

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "✓ Virtual environment activated"
fi

# Add the project root to PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Run uvicorn from the backend directory
cd backend
echo "✓ Starting Uvicorn..."
echo "📍 API will be available at: http://localhost:8000"
echo "📚 API Docs will be available at: http://localhost:8000/docs"
echo ""
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
