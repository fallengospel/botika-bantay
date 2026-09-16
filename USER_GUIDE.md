# BotikaBantay - User Guide

## "Presyo na Tama, Gamot na Tunay"

---

## Step 1: Open the App

Open your browser and go to **http://localhost:3000**

You'll see the home page with two main options:
- **Presyo Check** — Compare medicine prices
- **Tunay Check** — Verify medicine authenticity

---

## Step 2: Search for Medicine (Presyo Check)

1. Click **"Presyo Check"** on the home page
2. Type the **brand name** (e.g., "Biogesic") or **generic name** (e.g., "Paracetamol") in the search bar
3. The app will show matching medicines from the database
4. Click on any medicine to see its details

---

## Step 3: Compare Prices

After selecting a medicine, you'll see:

- **Medicine Info** — Brand name, generic name, dosage form, strength, manufacturer, FDA registration number
- **Price List** — Prices from different pharmacy chains (Mercury Drug, Watsons, Rose Pharmacy, etc.)
- **Lowest Price** — Highlighted in green with a "Lowest" badge
- **Savings** — Shows how much you can save by choosing the cheapest option

**Price details include:**
- Pharmacy chain name and branch location
- Price amount (in Philippine Peso)
- Source type (official or crowdsourced)
- Last updated date

---

## Step 4: Verify Medicine (Tunay Check)

This feature requires a camera-enabled device (mobile phone).

1. Click **"Tunay Check"** on the home page
2. Allow camera access when prompted
3. Point your camera at the medicine's **barcode or QR code**
4. The app will scan and check against the FDA Philippines registry

**Results:**
- ✅ **"Product Verified"** — Medicine is FDA-registered. Shows brand name, generic name, and manufacturer.
- ❌ **"Product Not Found"** — Medicine not in FDA registry. You can report it for review.

---

## Step 5: Browse by Condition (Optional)

On the home page, you can also search by health condition:
- Fever (Lagnat)
- Headache (Sakit ng Ulo)
- Cough (Ubo)
- Cold (Sipon)
- High Blood Pressure (Altapresyon)
- Diabetes (Diyabetis)
- Allergy
- Stomachache (Sakit ng Tiyan)
- Muscle Pain (Sakit ng Kalamnan)

---

## Features Summary

| Feature | What It Does |
|---------|--------------|
| **Medicine Search** | Find medicines by brand, generic name, or condition |
| **Price Comparison** | See prices across Mercury Drug, Watsons, Rose Pharmacy, Generika, South Star |
| **Savings Calculator** | Shows potential savings between branded and generic |
| **FDA Verification** | Scan barcodes to check if medicine is registered |
| **Nearby Pharmacies** | Find pharmacy branches near your location |
| **Price History** | See when prices were last updated |

---

## Data Coverage

**Medicines in Database (15):**
- Biogesic, Tempra (Paracetamol)
- Alaxan (Ibuprofen + Paracetamol)
- Neozep (Cold medicine)
- Lipitor, Atorvastatin (Cholesterol)
- Amlodipine, Norvasc (Blood Pressure)
- Metformin, Glucophage (Diabetes)
- Allerta, Cetirizine (Allergy)
- Enervon (Vitamins)
- Buscopan (Stomach pain)
- Salonpas (Pain relief)

**Pharmacy Chains (5):**
- Mercury Drug
- Watsons
- Rose Pharmacy
- Generika Drugstore
- South Star Drug

---

## For Developers

### Run Locally

```bash
cd botika-bantay
npm install
npm run dev:web
```

### Database Commands

```bash
npm run db:seed    # Add sample data
```

### Project Structure

```
botika-bantay/
├── apps/web/          # Next.js web app
├── apps/mobile/       # React Native app (coming soon)
├── packages/shared/   # Shared code
├── supabase/          # Database schema
└── scripts/           # Seed scripts
```

### Tech Stack

- **Frontend:** Next.js 14 + Tailwind CSS
- **Backend:** Supabase (PostgreSQL)
- **Icons:** Lucide React
- **Deployment:** Vercel (ready)
