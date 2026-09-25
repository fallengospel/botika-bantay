/**
 * Import medicines from a CSV file into the BotikaBantay catalog.
 *
 * Honest scope: BotikaBantay catalog of FDA-registered products — this is
 * NOT a live FDA API. The FDA Philippines does not publish a stable public
 * API for product registration data. To import:
 *
 *   1. Obtain a product list export (CSV/XLSX) — e.g. the FDA e-PPS/CDRRS
 *      product registration export, or your own compiled list.
 *   2. Convert it to CSV with these headers (extra columns are ignored):
 *
 *        fda_registration_number,brand_name,generic_name,dosage_form,strength,manufacturer,barcode,conditions
 *
 *      - conditions is optional, a `|`-separated list of condition ids
 *        (e.g. fever|headache)
 *      - barcode is optional
 *   3. Run:
 *
 *        npm run db:import -- path/to/products.csv
 *
 * Upserts on fda_registration_number (safe to re-run). Requires
 * SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 */
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const REQUIRED_COLUMNS = [
  'fda_registration_number',
  'brand_name',
  'generic_name',
  'dosage_form',
  'strength',
  'manufacturer',
] as const;

interface CsvRow {
  fda_registration_number: string;
  brand_name: string;
  generic_name: string;
  dosage_form: string;
  strength: string;
  manufacturer: string;
  barcode?: string;
  conditions?: string[];
}

/** Minimal RFC-4180-ish CSV parser (handles quoted fields and newlines). */
function parseCsv(content: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (inQuotes) {
      if (ch === '"') {
        if (content[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && content[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some(c => c.trim() !== '')) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  row.push(field);
  if (row.some(c => c.trim() !== '')) rows.push(row);

  if (rows.length < 2) throw new Error('CSV has no data rows.');

  const headers = rows[0].map(h => h.trim().toLowerCase());
  const missing = REQUIRED_COLUMNS.filter(c => !headers.includes(c));
  if (missing.length) {
    throw new Error(
      `CSV is missing required column(s): ${missing.join(', ')}\n` +
        `Required: ${REQUIRED_COLUMNS.join(', ')}\n` +
        `Optional: barcode, conditions`
    );
  }

  return rows.slice(1).map(r => {
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = (r[idx] ?? '').trim();
    });
    return obj;
  });
}

function toRecord(row: Record<string, string>): CsvRow | null {
  const reg = row.fda_registration_number;
  if (!reg || !row.brand_name || !row.generic_name) return null;

  const conditions = row.conditions
    ? row.conditions
        .split('|')
        .map(c => c.trim())
        .filter(Boolean)
    : undefined;

  return {
    fda_registration_number: reg,
    brand_name: row.brand_name,
    generic_name: row.generic_name,
    dosage_form: row.dosage_form || 'Tablet',
    strength: row.strength || 'N/A',
    manufacturer: row.manufacturer || 'Unknown',
    barcode: row.barcode || undefined,
    conditions,
  };
}

async function importCsv(csvPath: string) {
  const resolved = path.resolve(csvPath);
  if (!fs.existsSync(resolved)) {
    console.error(`File not found: ${resolved}`);
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const content = fs.readFileSync(resolved, 'utf-8');
  const rows = parseCsv(content);
  const records = rows.map(toRecord).filter((r): r is CsvRow => r !== null);

  console.log(`Importing ${records.length} medicines from ${resolved}`);
  console.log('Source: local CSV import — BotikaBantay catalog (not a live FDA API)');

  let upserted = 0;
  let failed = 0;

  for (const rec of records) {
    const { barcode, conditions, ...med } = rec;
    const payload: Record<string, unknown> = { ...med, updated_at: new Date().toISOString() };
    if (barcode) payload.barcode = barcode;
    if (conditions) payload.conditions = conditions;

    const { error } = await supabase
      .from('medicines')
      .upsert(payload, { onConflict: 'fda_registration_number' })
      .select('id');

    if (error) {
      failed++;
      console.error(`  fail ${rec.fda_registration_number} (${rec.brand_name}): ${error.message}`);
    } else {
      upserted++;
    }
  }

  console.log(`Done: ${upserted} upserted (${failed} failed).`);
  if (failed > 0) process.exitCode = 1;
}

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: npm run db:import -- path/to/products.csv');
  process.exit(1);
}

importCsv(arg).catch(err => {
  console.error('Import failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
