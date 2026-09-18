# BotikaBantay

**"Presyo na Tama, Gamot na Tunay"**  
*(The Right Price, The Real Medicine)*

A Unified Medicine Price Comparison & Authenticity Verification Platform for the Filipino Consumer.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Setup](#setup)
7. [Environment Variables](#environment-variables)
8. [Running the App](#running-the-app)
9. [Database](#database)
10. [API Reference](#api-reference)
11. [Deployment](#deployment)
12. [Contributing](#contributing)
13. [License](#license)

---

## Overview

BotikaBantay combines two everyday pain points for Filipino consumers — medicine cost and medicine safety — into a single platform. It allows users to:

- **Compare medicine prices** across major Philippine pharmacy chains (Mercury Drug, Watsons, Rose Pharmacy, Generika, South Star Drug)
- **Verify medicine authenticity** by scanning barcodes/QR codes against the FDA Philippines drug registry
- **Find nearby pharmacies** with directions via Google Maps
- **Save on maintenance medications** by discovering the cheapest available option

---

## Features

### Presyo Check (Price Comparison)
- Search by brand name, generic name, or condition
- Side-by-side price comparison across 5+ pharmacy chains
- Branded vs. generic equivalent savings calculator
- Price staleness indicators (Fresh / Stale / Outdated)
- Location-based pharmacy finder with distances

### Tunay Check (Authenticity Verification)
- Barcode/QR code scanning (mobile app)
- Manual lookup by barcode number or FDA registration number (web app)
- Cross-reference against FDA Philippines public drug registry
- Verification history logging

### Nearby Pharmacies
- GPS-based pharmacy discovery within 10km radius
- Google Maps directions integration
- Distance display from current location

### Offline Support (Mobile)
- Cached medicines and prices for low-connectivity areas
- Automatic cache refresh on network availability

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Mobile** | React Native (Expo SDK 50) |
| **Web** | Next.js 14 + Tailwind CSS |
| **Backend** | Supabase (PostgreSQL + REST API) |
| **Shared** | TypeScript (monorepo) |
| **Icons** | Lucide React / Lucide React Native |
| **Deployment** | Vercel (Web) / EAS (Mobile) |

---

## Project Structure

```
botika-bantay/
├── apps/
│   ├── web/                    # Next.js web application
│   │   ├── app/                # App Router pages
│   │   │   ├── page.tsx        # Home page
│   │   │   ├── medicines/      # Medicine list & detail pages
│   │   │   ├── scanner/        # Tunay Check (manual verification)
│   │   │   ├── nearby/         # Nearby pharmacies
│   │   │   └── api/            # API routes
│   │   ├── components/         # Reusable UI components
│   │   └── lib/                # Supabase client utilities
│   │
│   └── mobile/                 # React Native/Expo mobile app
│       ├── src/
│       │   ├── screens/        # Screen components
│       │   ├── components/     # Reusable UI components
│       │   ├── services/       # Supabase client
│       │   └── utils/          # Cache utilities
│       └── App.tsx             # Navigation setup
│
├── packages/
│   └── shared/                 # Shared types, constants, utilities
│       └── src/
│           ├── types/          # TypeScript interfaces
│           ├── constants/      # App constants (pharmacy chains, conditions)
│           └── utils/          # Utility functions (formatPrice, calculateDistance)
│
├── supabase/
│   └── schema.sql              # Database schema
│
├── scripts/
│   └── seed.ts                 # Database seeding script
│
└── docs/
    ├── QA_BUG_REPORT.md        # QA bug tracking
    └── USAGE.md                # This file
```

---

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Expo CLI (for mobile development)

---

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd botika-bantay
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Copy your **Project URL** and **Anon Key** from Settings > API
4. Copy your **Service Role Key** from Settings > API (for seeding only)

### 5. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
# Web (Next.js)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Mobile (Expo) - same values
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Admin (for seed script)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 6. Seed the database

```bash
npm run db:seed
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (web) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key (web) |
| `EXPO_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (mobile) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key (mobile) |
| `SUPABASE_SERVICE_ROLE_KEY` | For seeding | Supabase service role key (admin) |

> **Security Note:** Never commit `.env` to version control. The `.env.example` file is safe to commit.

---

## Running the App

### Web App

```bash
# Development
npm run dev:web

# Build
npm run build:web

# Production
npm run start:web
```

The web app will be available at `http://localhost:3000`

### Mobile App

```bash
# Start Expo development server
npm run dev:mobile

# Or directly
cd apps/mobile && npx expo start
```

Scan the QR code with Expo Go (Android) or Camera (iOS).

---

## Database

### Tables

| Table | Description |
|-------|-------------|
| `medicines` | Medicine catalog (brand, generic, dosage, FDA reg) |
| `pharmacy_chains` | Pharmacy chain info (Mercury, Watsons, etc.) |
| `pharmacy_branches` | Branch locations with coordinates |
| `prices` | Medicine prices per branch |
| `users` | User accounts (optional) |
| `price_submissions` | Crowdsourced price submissions |
| `verification_records` | Scan/verification audit log |
| `suspicious_product_reports` | User reports of suspicious products |

### Key Commands

```bash
npm run db:seed    # Seed database with sample data
npm run db:migrate # Push schema changes
npm run db:reset   # Reset database ( destructive! )
```

---

## API Reference

### GET /api/medicines
Search medicines by brand or generic name.

**Query Parameters:**
- `search` (string) - Search term
- `condition` (string) - Filter by condition

### GET /api/prices
Get prices for a specific medicine.

**Query Parameters:**
- `medicineId` (string) - Medicine UUID
- `branchId` (string) - Branch UUID (optional)

### POST /api/prices
Submit a new price (crowdsourced).

**Body:**
```json
{
  "medicineId": "uuid",
  "branchId": "uuid",
  "price": 4.50,
  "sourceType": "crowdsourced"
}
```

### POST /api/verification
Verify a product by barcode or FDA registration number.

**Body:**
```json
{
  "scannedCode": "4800000000012"
}
```

### GET /api/branches
Get nearby pharmacy branches.

**Query Parameters:**
- `lat` (number) - Latitude
- `lng` (number) - Longitude
- `radius` (number) - Radius in km (default: 10)

---

## Deployment

### Web (Vercel)

1. Push to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Mobile (EAS)

```bash
cd apps/mobile
npx eas build --platform android
npx eas build --platform ios
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Conventions

- Use TypeScript for all new files
- Follow existing component patterns (see `components/` directories)
- Run `npm run build:web` before committing to catch errors
- Update this documentation when adding features

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- FDA Philippines for the public drug registry
- All pharmacy chains providing price transparency
- The Filipino community for their trust and contributions
