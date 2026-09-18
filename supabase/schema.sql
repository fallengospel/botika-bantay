-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users (must be created before prices which references it)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  display_name TEXT NOT NULL,
  contribution_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pharmacy Chains
CREATE TABLE pharmacy_chains (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  color TEXT DEFAULT '#000000',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pharmacy Branches
CREATE TABLE pharmacy_branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chain_id TEXT NOT NULL REFERENCES pharmacy_chains(id),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  city TEXT NOT NULL,
  province TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medicines
CREATE TABLE medicines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_name TEXT NOT NULL,
  generic_name TEXT NOT NULL,
  dosage_form TEXT NOT NULL,
  strength TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  fda_registration_number TEXT UNIQUE NOT NULL,
  barcode TEXT,
  image_url TEXT,
  conditions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prices
CREATE TABLE prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicine_id UUID NOT NULL REFERENCES medicines(id),
  branch_id UUID NOT NULL REFERENCES pharmacy_branches(id),
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  source_type TEXT NOT NULL CHECK (source_type IN ('official', 'crowdsourced')),
  submitted_by UUID REFERENCES users(id),
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  photo_url TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price Submissions (crowdsourced)
CREATE TABLE price_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  medicine_id UUID NOT NULL REFERENCES medicines(id),
  branch_id UUID NOT NULL REFERENCES pharmacy_branches(id),
  price DECIMAL(10, 2) NOT NULL,
  photo_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  outlier_flag BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification Records
CREATE TABLE verification_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicine_id UUID REFERENCES medicines(id),
  scanned_code TEXT NOT NULL,
  match_result TEXT NOT NULL CHECK (match_result IN ('found', 'not_found', 'ambiguous')),
  fda_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suspicious Product Reports
CREATE TABLE suspicious_product_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  medicine_id UUID REFERENCES medicines(id),
  scanned_code TEXT NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'reviewed', 'forwarded_to_fda')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_medicines_brand_name ON medicines(brand_name);
CREATE INDEX idx_medicines_generic_name ON medicines(generic_name);
CREATE INDEX idx_medicines_barcode ON medicines(barcode);
CREATE INDEX idx_medicines_fda_registration ON medicines(fda_registration_number);
CREATE INDEX idx_prices_medicine_id ON prices(medicine_id);
CREATE INDEX idx_prices_branch_id ON prices(branch_id);
CREATE INDEX idx_prices_medicine_branch ON prices(medicine_id, branch_id);
CREATE INDEX idx_pharmacy_branches_coords ON pharmacy_branches(latitude, longitude);
CREATE INDEX idx_pharmacy_branches_chain ON pharmacy_branches(chain_id);
CREATE INDEX idx_pharmacy_branches_city ON pharmacy_branches(city);
CREATE INDEX idx_verification_records_code ON verification_records(scanned_code);
CREATE INDEX idx_price_submissions_user ON price_submissions(user_id);
CREATE INDEX idx_price_submissions_medicine ON price_submissions(medicine_id);

-- Row Level Security (RLS)
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE suspicious_product_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;

-- Public read access for medicines, pharmacy_chains, pharmacy_branches
CREATE POLICY "Public read access for medicines" ON medicines FOR SELECT USING (true);
CREATE POLICY "Public read access for pharmacy_chains" ON pharmacy_chains FOR SELECT USING (true);
CREATE POLICY "Public read access for pharmacy_branches" ON pharmacy_branches FOR SELECT USING (true);
CREATE POLICY "Public read access for verified prices" ON prices FOR SELECT USING (verification_status = 'verified');
CREATE POLICY "Allow price insert" ON prices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow verification record insert" ON verification_records FOR INSERT WITH CHECK (true);

-- Authenticated user policies
CREATE POLICY "Users can insert price submissions" ON price_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own submissions" ON price_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert reports" ON suspicious_product_reports FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
