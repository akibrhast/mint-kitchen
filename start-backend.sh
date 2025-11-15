#!/bin/bash

echo "Starting Mint Kitchen Backend API..."
echo ""

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Creating one..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Check if dependencies are installed
if [ ! -f "venv/bin/uvicorn" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo ""
    echo "WARNING: .env file not found!"
    echo "Please copy .env.example to .env and add your Square credentials:"
    echo "  cp .env.example .env"
    echo ""
    echo "Then edit .env and add your SQUARE_ACCESS_TOKEN"
    echo ""
    read -p "Press Enter to continue anyway (API will not work without credentials)..."
fi

echo ""
echo "Starting FastAPI server on http://localhost:8000"
echo "API Documentation available at http://localhost:8000/docs"
echo ""

python main.py
