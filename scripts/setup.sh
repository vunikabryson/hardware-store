#!/bin/bash
# BuildRight Hardware - Quick Setup Script
set -e

echo "Building Hardware Store - Setup"
echo "================================"

if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo "Please edit .env with your DATABASE_URL and NEXTAUTH_SECRET before continuing."
  exit 1
fi

echo "Installing dependencies..."
npm install

echo "Pushing database schema..."
npm run db:push

echo "Seeding sample data..."
npm run db:seed

echo ""
echo "Setup complete!"
echo ""
echo "Run 'npm run dev' to start the development server."
echo "Admin login: admin@hardwarestore.com / admin123"
