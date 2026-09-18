#!/bin/bash
# BotikaBantay - Supabase Cloud Setup Script
# Run this after creating your Supabase project

set -e

echo "========================================="
echo "  BotikaBantay - Supabase Setup"
echo "========================================="
echo ""

# Check for required tools
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is required. Install from https://nodejs.org"
  exit 1
fi

if ! command -v npx &> /dev/null; then
  echo "Error: npx is required."
  exit 1
fi

# Prompt for credentials
echo "1. Go to https://supabase.com and create a free project"
echo "2. Copy your Project URL and Anon Key from Settings > API"
echo ""

read -p "Supabase Project URL (e.g. https://xxxx.supabase.co): " SUPABASE_URL
read -p "Supabase Anon Key (public): " SUPABASE_ANON_KEY
read -p "Supabase Service Role Key (secret): " SUPABASE_SERVICE_ROLE_KEY

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: All three values are required."
  exit 1
fi

echo ""
echo "Creating .env.local files..."

# Web app
cat > apps/web/.env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=BotikaBantay
EOF

# Mobile app
cat > apps/mobile/.env << EOF
EXPO_PUBLIC_SUPABASE_URL=$SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
EOF

echo "✓ .env.local files created"
echo ""

echo "3. Go to your Supabase project > SQL Editor"
echo "   Paste the contents of supabase/schema.sql and run it"
echo ""
echo "   Then run: npm run db:seed"
echo ""
echo "4. Start the dev server: npm run dev:web"
echo ""
echo "========================================="
echo "  Setup complete!"
echo "========================================="
