-- Production Hardening v1.4.0 — run in Supabase SQL Editor
-- Unblocks anonymous report / price-submission inserts (QA RLS blocker)

-- Reports: allow public insert (web/mobile submit without session)
DROP POLICY IF EXISTS "Users can insert reports" ON suspicious_product_reports;
DROP POLICY IF EXISTS "Allow report insert" ON suspicious_product_reports;
CREATE POLICY "Allow report insert" ON suspicious_product_reports
  FOR INSERT WITH CHECK (true);

-- Price submissions: allow public insert + admin read of queue
DROP POLICY IF EXISTS "Users can insert price submissions" ON price_submissions;
DROP POLICY IF EXISTS "Allow price submission insert" ON price_submissions;
CREATE POLICY "Allow price submission insert" ON price_submissions
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own submissions" ON price_submissions;
DROP POLICY IF EXISTS "Allow view price submissions" ON price_submissions;
CREATE POLICY "Allow view price submissions" ON price_submissions
  FOR SELECT USING (true);

-- Admin moderation updates use the service role key (bypasses RLS).
-- Public clients must NOT have UPDATE on these tables.

-- Ensure public can only read verified prices (matches UI copy: pending not published)
DROP POLICY IF EXISTS "Public read access for verified prices" ON prices;
CREATE POLICY "Public read access for verified prices" ON prices
  FOR SELECT USING (verification_status = 'verified');
