# BotikaBantay

**Presyo na Tama, Gamot na Tunay**

A Unified Medicine Price Comparison & Authenticity Verification Platform for the Filipino Consumer.

## Features

- **Presyo Check** - Compare medicine prices across major pharmacy chains
- **Tunay Check** - Verify medicine authenticity via barcode scanning
- **Nearby Pharmacies** - Find pharmacies near you with the best prices
- **FDA Verified** - Cross-referenced with FDA Philippines drug registry

## Tech Stack

- **Mobile**: React Native (Expo)
- **Web**: Next.js + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Shared**: TypeScript

## Project Structure

```
botika-bantay/
├── apps/
│   ├── web/          # Next.js web application
│   └── mobile/       # React Native/Expo mobile app
├── packages/
│   └── shared/       # Shared types, utils, constants
├── supabase/         # Database schema
├── scripts/          # Data ingestion scripts
└── docs/             # Documentation
```

## Documentation

- **[Usage Guide](docs/USAGE.md)** - Complete setup, development, and deployment guide
- **[QA Bug Report](docs/QA_BUG_REPORT.md)** - Bug tracking and status

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd botika-bantay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the schema from `supabase/schema.sql`
   - Copy your project URL and keys to `.env`

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

5. **Seed the database**
   ```bash
   npm run db:seed
   ```

6. **Start development**
   ```bash
   # Web app
   npm run dev:web

   # Mobile app
   npm run dev:mobile
   ```

## Scripts

- `npm run dev:web` - Start web development server
- `npm run dev:mobile` - Start Expo development server
- `npm run build:web` - Build web application
- `npm run db:seed` - Seed database with sample data
- `npm run db:migrate` - Run database migrations
- `npm run db:reset` - Reset database

## Environment Variables

```env
# Supabase (Web)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase (Mobile)
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin (seed script only)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- FDA Philippines for the public drug registry
- All pharmacy chains providing price transparency
- The Filipino community for their trust and contributions
