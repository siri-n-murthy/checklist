#!/usr/bin/env bash

# Checklist App Quick Start
# This script helps you run frontend and backend simultaneously

echo "🚀 Checklist Application - Quick Start"
echo "======================================"
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if MongoDB is mentioned
echo "📋 Pre-requisites:"
echo "1. Ensure MongoDB is running (local or Atlas connection configured)"
echo "2. Backend will connect to: mongodb://localhost:27017/checklist"
echo "3. Frontend will run on: http://localhost:5173"
echo "4. Backend will run on: http://localhost:5000"
echo ""

# Install dependencies if needed
read -p "Install/update dependencies? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    
    echo "📦 Installing backend dependencies..."
    cd server
    npm install
    cd ..
fi

echo ""
echo "🎯 Starting application..."
echo ""
echo "In two separate terminals, run:"
echo ""
echo "Terminal 1 (Frontend):"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Backend):"
echo "  cd server && npm run dev"
echo ""
echo "Or run them together with:"
echo "  npm run dev & cd server && npm run dev"
echo ""
