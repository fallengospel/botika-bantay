# BotikaBantay - Local Development Setup

## Prerequisites

- Node.js 18+
- npm or yarn
- A free Supabase account (https://supabase.com)

## Step 1: Create Supabase Project

1. Go to **https://supabase.com** and sign up (free tier is fine)
2. Click **"New Project"**
3. Choose a project name (e.g. `botika-bantay`)
4. Set a database password (save this somewhere)
5. Choose a region close to you (e.g. Southeast Asia)
6. Click **"Create new project"**
7. Wait ~2 minutes for it to provision

## Step 2: Run the SQL Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open `supabase/schema.sql` from this repo
4. Copy the entire contents and paste into the SQL Editor
5. Click **"Run"** (or press Cmd+Enter)
6. You should see "Success. No rows returned"

## Step 3: Get Your Credentials

1. Go to **Settings > API** (left sidebar, gear icon at the bottom)
2. Copy these two values:
   - **Project URL** — looks like `https://xxxxxxxx.supabase.co`
   - **Project API Key (anon/public)** — starts with `eyJ...`

## Step 4: Set Up Environment Variables

### Option A: Run the setup script (recommended)

```bash
./scripts/setup-supabase.sh
```

It will prompt you for your URL, Anon Key, and Service Role Key.

### Option B: Edit files manually

**Web app** — edit `apps/web/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=BotikaBantay
```

**Mobile app** — edit `apps/mobile/.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Step 5: Seed Test Data

The seed script populates 20 medicines, 6 pharmacy branches, and ~20 price records.

```bash
npm run db:seed
```

> **Note:** The seed script uses the **Service Role Key** (found in Settings > API > service_role). This key bypasses RLS — keep it secret and never commit it.

To get the Service Role Key:
1. Go to **Settings > API** in Supabase
2. Under "Project API keys", find **service_role**
3. Copy it and paste when prompted by the seed script

## Step 6: Start Development

```bash
# Web app (http://localhost:3000)
npm run dev:web

# Mobile app (Expo)
npm run dev:mobile
```

## What You Should See

- **Home page** (`/`) — Filipino landing page with search
- **Medicines** (`/medicines`) — 20 medicines from the seed data
- **Medicine detail** (`/medicines/[id]`) — prices from 3-6 pharmacies
- **Nearby** (`/nearby`) — 6 pharmacy branches in Metro Manila
- **Scanner** (`/scanner`) — enter barcodes like `4800000000012`
- **Login/Register** — Supabase auth
- **Submit price** (`/submit`) — submit crowdsourced prices
- **Admin** (`/admin`) — moderate submissions and reports

## Useful Commands

```bash
# Reseed database (clears and repopulates)
npm run db:seed

# Reset database completely
npm run db:reset

# Build for production
npm run build:web
```

## Troubleshooting

**"Supabase not configured" warnings:**
- Make sure `apps/web/.env.local` exists with correct values
- Restart the dev server after changing env vars

**Seed script fails:**
- Make sure you're using the **Service Role Key**, not the Anon Key
- Make sure you ran the SQL schema first (Step 2)

**Empty data on pages:**
- Run `npm run db:seed` to populate test data
- Check the Prices page — only `verified` prices are shown

**Auth not working:**
- Make sure Email auth is enabled in Supabase Dashboard > Authentication > Providers
