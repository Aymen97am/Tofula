#!/bin/bash

# Tofula Setup Script
# This script helps you set up the Tofula project

set -e

echo "🚀 Setting up Tofula..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Backend setup
echo "🔧 Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit backend/.env and add your GOOGLE_API_KEY${NC}"
fi

echo "Installing backend dependencies..."
pip install -r requirements.txt

echo -e "${GREEN}✅ Backend setup complete${NC}"
echo ""

# Frontend setup
cd ../web
echo "🎨 Setting up frontend..."

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file from example..."
    cp .env.local.example .env.local
fi

echo "Installing frontend dependencies..."
npm install

echo -e "${GREEN}✅ Frontend setup complete${NC}"
echo ""

# Create storage directory
cd ..
mkdir -p storage/pdfs storage/images storage/audio

echo ""
echo "═══════════════════════════════════════════════════"
echo "✨ Setup Complete!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo ""
echo "1. Add your GOOGLE_API_KEY to backend/.env"
echo "   ${YELLOW}nano backend/.env${NC}"
echo ""
echo "2. Start the backend:"
echo "   ${GREEN}cd backend${NC}"
echo "   ${GREEN}uvicorn app.main:app --reload${NC}"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   ${GREEN}cd web${NC}"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "4. Open your browser:"
echo "   Frontend: ${GREEN}http://localhost:3000${NC}"
echo "   API Docs: ${GREEN}http://localhost:8000/docs${NC}"
echo ""
echo "═══════════════════════════════════════════════════"
