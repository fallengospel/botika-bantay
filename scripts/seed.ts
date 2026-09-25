import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.');
  console.error('Set them in your .env file or export them before running this script.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample/demo barcode series (EAN-13 style). Demo catalog data — not real registrations.
const bc = (n: number) => `48000000000${n}`;
const reg = (n: number) => `FDA-RXY-${n}`;

const pharmacyChains = [
  { id: 'mercury', name: 'Mercury Drug', color: '#00A651' },
  { id: 'watsons', name: 'Watsons', color: '#E31937' },
  { id: 'rose', name: 'Rose Pharmacy', color: '#FF69B4' },
  { id: 'generika', name: 'Generika Drugstore', color: '#0099CC' },
  { id: 'southstar', name: 'South Star Drug', color: '#FFD700' },
  { id: 'citydrug', name: 'CityDrug', color: '#4169E1' },
];

interface MedicineSeed {
  brand_name: string;
  generic_name: string;
  dosage_form: string;
  strength: string;
  manufacturer: string;
  fda_registration_number: string;
  barcode: string;
  conditions: string[];
}

const medicines: MedicineSeed[] = [
  // Original 20
  { brand_name: 'Biogesic', generic_name: 'Paracetamol', dosage_form: 'Tablet', strength: '500mg', manufacturer: 'Unilab', fda_registration_number: reg(1234), barcode: bc(12), conditions: ['fever', 'headache'] },
  { brand_name: 'Tempra', generic_name: 'Paracetamol', dosage_form: 'Tablet', strength: '500mg', manufacturer: 'Aristopharma', fda_registration_number: reg(1235), barcode: bc(13), conditions: ['fever', 'headache'] },
  { brand_name: 'Alaxan', generic_name: 'Ibuprofen + Paracetamol', dosage_form: 'Capsule', strength: '200mg + 325mg', manufacturer: 'Unilab', fda_registration_number: reg(1236), barcode: bc(14), conditions: ['headache', 'muscle_pain'] },
  { brand_name: 'Neozep', generic_name: 'Phenylpropanolamine + Chlorpheniramine + Paracetamol', dosage_form: 'Tablet', strength: '25mg + 2mg + 500mg', manufacturer: 'Unilab', fda_registration_number: reg(1237), barcode: bc(15), conditions: ['cold', 'cough'] },
  { brand_name: 'Decolgen', generic_name: 'Phenylpropanolamine + Chlorpheniramine + Paracetamol', dosage_form: 'Tablet', strength: '25mg + 2mg + 500mg', manufacturer: 'Pfizer', fda_registration_number: reg(1238), barcode: bc(16), conditions: ['cold', 'cough'] },
  { brand_name: 'Amoxicillin', generic_name: 'Amoxicillin', dosage_form: 'Capsule', strength: '500mg', manufacturer: 'Generic', fda_registration_number: reg(1239), barcode: bc(17), conditions: ['skin_infection'] },
  { brand_name: 'Lipitor', generic_name: 'Atorvastatin', dosage_form: 'Tablet', strength: '20mg', manufacturer: 'Pfizer', fda_registration_number: reg(1240), barcode: bc(18), conditions: ['hypertension'] },
  { brand_name: 'Atorvastatin', generic_name: 'Atorvastatin', dosage_form: 'Tablet', strength: '20mg', manufacturer: 'Generic', fda_registration_number: reg(1241), barcode: bc(19), conditions: ['hypertension'] },
  { brand_name: 'Amlodipine', generic_name: 'Amlodipine', dosage_form: 'Tablet', strength: '5mg', manufacturer: 'Generic', fda_registration_number: reg(1242), barcode: bc(20), conditions: ['hypertension'] },
  { brand_name: 'Norvasc', generic_name: 'Amlodipine', dosage_form: 'Tablet', strength: '5mg', manufacturer: 'Pfizer', fda_registration_number: reg(1243), barcode: bc(21), conditions: ['hypertension'] },
  { brand_name: 'Metformin', generic_name: 'Metformin', dosage_form: 'Tablet', strength: '500mg', manufacturer: 'Generic', fda_registration_number: reg(1244), barcode: bc(22), conditions: ['diabetes'] },
  { brand_name: 'Glucophage', generic_name: 'Metformin', dosage_form: 'Tablet', strength: '500mg', manufacturer: 'Merck', fda_registration_number: reg(1245), barcode: bc(23), conditions: ['diabetes'] },
  { brand_name: 'Allerta', generic_name: 'Cetirizine', dosage_form: 'Tablet', strength: '10mg', manufacturer: 'Pfizer', fda_registration_number: reg(1246), barcode: bc(24), conditions: ['allergy'] },
  { brand_name: 'Cetirizine', generic_name: 'Cetirizine', dosage_form: 'Tablet', strength: '10mg', manufacturer: 'Generic', fda_registration_number: reg(1247), barcode: bc(25), conditions: ['allergy'] },
  { brand_name: 'Enervon', generic_name: 'Ascorbic Acid + B Complex', dosage_form: 'Tablet', strength: '500mg + B Complex', manufacturer: 'Unilab', fda_registration_number: reg(1248), barcode: bc(26), conditions: [] },
  { brand_name: 'Buscopan', generic_name: 'Hyoscine Butylbromide', dosage_form: 'Tablet', strength: '10mg', manufacturer: 'Boehringer Ingelheim', fda_registration_number: reg(1249), barcode: bc(27), conditions: ['stomachache'] },
  { brand_name: 'Diatabs', generic_name: 'Loperamide + Attapulgite', dosage_form: 'Capsule', strength: '2mg + 625mg', manufacturer: 'Pascual Laboratories', fda_registration_number: reg(1250), barcode: bc(28), conditions: ['stomachache'] },
  { brand_name: 'Salonpas', generic_name: 'Methyl Salicylate + Menthol', dosage_form: 'Patch', strength: '100mg + 30mg', manufacturer: 'Hisamitsu', fda_registration_number: reg(1251), barcode: bc(29), conditions: ['muscle_pain'] },
  { brand_name: 'Efficascent', generic_name: 'Methyl Salicylate + Menthol + Eucalyptus Oil', dosage_form: 'Solution', strength: '30% + 10% + 5%', manufacturer: 'Pascual Laboratories', fda_registration_number: reg(1252), barcode: bc(30), conditions: ['muscle_pain'] },
  { brand_name: 'Ceelin', generic_name: 'Ascorbic Acid', dosage_form: 'Drops', strength: '100mg/mL', manufacturer: 'Unilab', fda_registration_number: reg(1253), barcode: bc(31), conditions: [] },
  // Expansion — common PH OTC
  { brand_name: 'Kremil-S', generic_name: 'Calcium Carbonate + Magnesium Trisilicate', dosage_form: 'Tablet', strength: '500mg + 200mg', manufacturer: 'United Laboratories', fda_registration_number: reg(1254), barcode: bc(32), conditions: ['stomachache'] },
  { brand_name: 'Bioflu', generic_name: 'Phenylpropanolamine + Chlorpheniramine + Paracetamol + Caffeine', dosage_form: 'Tablet', strength: '25mg + 2mg + 500mg + 30mg', manufacturer: 'Unilab', fda_registration_number: reg(1255), barcode: bc(33), conditions: ['cold', 'cough', 'fever'] },
  { brand_name: 'Rexidol', generic_name: 'Paracetamol + Caffeine', dosage_form: 'Tablet', strength: '500mg + 65mg', manufacturer: 'Pascual Laboratories', fda_registration_number: reg(1256), barcode: bc(34), conditions: ['headache'] },
  { brand_name: 'Medicol', generic_name: 'Ibuprofen', dosage_form: 'Tablet', strength: '400mg', manufacturer: 'Unilab', fda_registration_number: reg(1257), barcode: bc(35), conditions: ['headache', 'muscle_pain', 'fever'] },
  { brand_name: 'Advil', generic_name: 'Ibuprofen', dosage_form: 'Tablet', strength: '200mg', manufacturer: 'Haleon', fda_registration_number: reg(1258), barcode: bc(36), conditions: ['headache', 'muscle_pain'] },
  { brand_name: 'Ponstan', generic_name: 'Mefenamic Acid', dosage_form: 'Capsule', strength: '500mg', manufacturer: 'Pfizer', fda_registration_number: reg(1259), barcode: bc(37), conditions: ['headache', 'muscle_pain'] },
  { brand_name: 'Mefenamic Acid', generic_name: 'Mefenamic Acid', dosage_form: 'Capsule', strength: '500mg', manufacturer: 'Generic', fda_registration_number: reg(1260), barcode: bc(38), conditions: ['headache', 'muscle_pain'] },
  { brand_name: 'Imodium', generic_name: 'Loperamide', dosage_form: 'Capsule', strength: '2mg', manufacturer: 'Janssen', fda_registration_number: reg(1261), barcode: bc(39), conditions: ['stomachache'] },
  { brand_name: 'Oresol', generic_name: 'Oral Rehydration Salts', dosage_form: 'Powder', strength: '20.5g/L', manufacturer: 'UNICEF / DOH', fda_registration_number: reg(1262), barcode: bc(40), conditions: ['stomachache'] },
  { brand_name: 'Strepsils', generic_name: 'Tyrothricin + Dichlorobenzyl Alcohol', dosage_form: 'Lozenge', strength: '0.6mg + 1.2mg', manufacturer: 'Reckitt', fda_registration_number: reg(1263), barcode: bc(41), conditions: ['cough', 'cold'] },
  { brand_name: 'Claritin', generic_name: 'Loratadine', dosage_form: 'Tablet', strength: '10mg', manufacturer: 'Bayer', fda_registration_number: reg(1264), barcode: bc(42), conditions: ['allergy'] },
  { brand_name: 'Allegra', generic_name: 'Fexofenadine', dosage_form: 'Tablet', strength: '120mg', manufacturer: 'Sanofi', fda_registration_number: reg(1265), barcode: bc(43), conditions: ['allergy'] },
  // Expansion — maintenance / Rx
  { brand_name: 'Cozaar', generic_name: 'Losartan', dosage_form: 'Tablet', strength: '50mg', manufacturer: 'Organon', fda_registration_number: reg(1266), barcode: bc(44), conditions: ['hypertension'] },
  { brand_name: 'Losartan', generic_name: 'Losartan', dosage_form: 'Tablet', strength: '50mg', manufacturer: 'Generic', fda_registration_number: reg(1267), barcode: bc(45), conditions: ['hypertension'] },
  { brand_name: 'Renitec', generic_name: 'Enalapril', dosage_form: 'Tablet', strength: '10mg', manufacturer: 'Organon', fda_registration_number: reg(1268), barcode: bc(46), conditions: ['hypertension'] },
  { brand_name: 'Daonil', generic_name: 'Glibenclamide', dosage_form: 'Tablet', strength: '5mg', manufacturer: 'Sanofi', fda_registration_number: reg(1269), barcode: bc(47), conditions: ['diabetes'] },
  { brand_name: 'Gliclazide', generic_name: 'Gliclazide', dosage_form: 'Tablet', strength: '80mg', manufacturer: 'Generic', fda_registration_number: reg(1270), barcode: bc(48), conditions: ['diabetes'] },
  { brand_name: 'Zocor', generic_name: 'Simvastatin', dosage_form: 'Tablet', strength: '20mg', manufacturer: 'Organon', fda_registration_number: reg(1271), barcode: bc(49), conditions: ['hypertension'] },
  { brand_name: 'Amoxil', generic_name: 'Amoxicillin', dosage_form: 'Capsule', strength: '500mg', manufacturer: 'GlaxoSmithKline', fda_registration_number: reg(1272), barcode: bc(50), conditions: ['skin_infection'] },
  { brand_name: 'Augmentin', generic_name: 'Amoxicillin + Clavulanate', dosage_form: 'Tablet', strength: '500mg + 125mg', manufacturer: 'GlaxoSmithKline', fda_registration_number: reg(1273), barcode: bc(51), conditions: ['skin_infection'] },
  { brand_name: 'Zithromax', generic_name: 'Azithromycin', dosage_form: 'Tablet', strength: '500mg', manufacturer: 'Pfizer', fda_registration_number: reg(1274), barcode: bc(52), conditions: ['skin_infection', 'cough'] },
  { brand_name: 'Cefalexin', generic_name: 'Cefalexin', dosage_form: 'Capsule', strength: '500mg', manufacturer: 'Generic', fda_registration_number: reg(1275), barcode: bc(53), conditions: ['skin_infection'] },
  { brand_name: 'Losec', generic_name: 'Omeprazole', dosage_form: 'Capsule', strength: '20mg', manufacturer: 'AstraZeneca', fda_registration_number: reg(1276), barcode: bc(54), conditions: ['stomachache'] },
  { brand_name: 'Omeprazole', generic_name: 'Omeprazole', dosage_form: 'Capsule', strength: '20mg', manufacturer: 'Generic', fda_registration_number: reg(1277), barcode: bc(55), conditions: ['stomachache'] },
  { brand_name: 'Peptac', generic_name: 'Famotidine', dosage_form: 'Tablet', strength: '20mg', manufacturer: 'Pfizer', fda_registration_number: reg(1278), barcode: bc(56), conditions: ['stomachache'] },
  { brand_name: 'Ventolin', generic_name: 'Salbutamol', dosage_form: 'Inhaler', strength: '100mcg/dose', manufacturer: 'GlaxoSmithKline', fda_registration_number: reg(1279), barcode: bc(57), conditions: ['cough'] },
  { brand_name: 'Bactroban', generic_name: 'Mupirocin', dosage_form: 'Cream', strength: '2%', manufacturer: 'GlaxoSmithKline', fda_registration_number: reg(1280), barcode: bc(58), conditions: ['skin_infection'] },
  { brand_name: 'Canesten', generic_name: 'Clotrimazole', dosage_form: 'Cream', strength: '1%', manufacturer: 'Bayer', fda_registration_number: reg(1281), barcode: bc(59), conditions: ['skin_infection'] },
  { brand_name: 'Betadine', generic_name: 'Povidone-Iodine', dosage_form: 'Solution', strength: '10%', manufacturer: 'Mundipharma', fda_registration_number: reg(1282), barcode: bc(60), conditions: ['skin_infection'] },
  { brand_name: 'Voltarol', generic_name: 'Diclofenac', dosage_form: 'Tablet', strength: '50mg', manufacturer: 'Novartis', fda_registration_number: reg(1283), barcode: bc(61), conditions: ['muscle_pain'] },
  { brand_name: 'Naprosyn', generic_name: 'Naproxen', dosage_form: 'Tablet', strength: '250mg', manufacturer: 'Hoffmann-La Roche', fda_registration_number: reg(1284), barcode: bc(62), conditions: ['muscle_pain', 'headache'] },
  { brand_name: 'Ceelin Plus', generic_name: 'Ascorbic Acid + Zinc', dosage_form: 'Syrup', strength: '100mg/mL + 5mg/mL', manufacturer: 'Unilab', fda_registration_number: reg(1285), barcode: bc(63), conditions: [] },
  { brand_name: 'Singulair', generic_name: 'Montelukast', dosage_form: 'Tablet', strength: '10mg', manufacturer: 'Organon', fda_registration_number: reg(1286), barcode: bc(64), conditions: ['cough'] },
];

interface BranchSeed {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  province: string;
  chain: string;
}

const pharmacyBranches: BranchSeed[] = [
  { chain: 'mercury', name: 'Mercury Drug - Makati Ave', address: '123 Makati Ave, Makati City', latitude: 14.5547, longitude: 121.0500, city: 'Makati City', province: 'Metro Manila' },
  { chain: 'mercury', name: 'Mercury Drug - BGC', address: '456 5th Ave, BGC, Taguig City', latitude: 14.5510, longitude: 121.0480, city: 'Taguig City', province: 'Metro Manila' },
  { chain: 'watsons', name: 'Watsons - SM Makati', address: 'SM Makati, Ayala Ave, Makati City', latitude: 14.5509, longitude: 121.0540, city: 'Makati City', province: 'Metro Manila' },
  { chain: 'rose', name: 'Rose Pharmacy - Alabang', address: '789 Alabang-Zapote Rd, Muntinlupa City', latitude: 14.4150, longitude: 121.0350, city: 'Muntinlupa City', province: 'Metro Manila' },
  { chain: 'generika', name: 'Generika - Quezon City', address: '321 Quezon Ave, Quezon City', latitude: 14.6500, longitude: 121.0300, city: 'Quezon City', province: 'Metro Manila' },
  { chain: 'southstar', name: 'South Star Drug - Pasig', address: '555 Ortigas Ave, Pasig City', latitude: 14.5800, longitude: 121.0600, city: 'Pasig City', province: 'Metro Manila' },
  // Expansion
  { chain: 'mercury', name: 'Mercury Drug - Cubao', address: 'Aurora Blvd, Cubao, Quezon City', latitude: 14.6190, longitude: 121.0510, city: 'Quezon City', province: 'Metro Manila' },
  { chain: 'mercury', name: 'Mercury Drug - SM Manila', address: 'SM Manila, Ermita, Manila', latitude: 14.5800, longitude: 120.9800, city: 'Manila', province: 'Metro Manila' },
  { chain: 'watsons', name: 'Watsons - SM Mall of Asia', address: 'SM Mall of Asia, Pasay City', latitude: 14.5350, longitude: 121.0000, city: 'Pasay City', province: 'Metro Manila' },
  { chain: 'watsons', name: 'Watsons - Trinoma', address: 'Trinoma, Quezon City', latitude: 14.6560, longitude: 121.0330, city: 'Quezon City', province: 'Metro Manila' },
  { chain: 'rose', name: 'Rose Pharmacy - Makati', address: 'Legazpi Village, Makati City', latitude: 14.5500, longitude: 121.0250, city: 'Makati City', province: 'Metro Manila' },
  { chain: 'generika', name: 'Generika - Mandaluyong', address: 'Shaw Blvd, Mandaluyong City', latitude: 14.5800, longitude: 121.0400, city: 'Mandaluyong City', province: 'Metro Manila' },
  { chain: 'southstar', name: 'South Star Drug - San Juan', address: 'Ortigas Ave, San Juan City', latitude: 14.6000, longitude: 121.0300, city: 'San Juan City', province: 'Metro Manila' },
  { chain: 'citydrug', name: 'CityDrug - Ortigas', address: 'Ortigas Center, Pasig City', latitude: 14.5800, longitude: 121.0540, city: 'Pasig City', province: 'Metro Manila' },
  { chain: 'citydrug', name: 'CityDrug - Ermita', address: 'United Nations Ave, Ermita, Manila', latitude: 14.5790, longitude: 120.9840, city: 'Manila', province: 'Metro Manila' },
];

// Sample prices keyed by brand + branch name so order changes can't silently break seeding.
const prices: Array<{ brand: string; branch: string; price: number }> = [
  { brand: 'Biogesic', branch: 'Mercury Drug - Makati Ave', price: 4.50 },
  { brand: 'Biogesic', branch: 'Watsons - SM Makati', price: 4.75 },
  { brand: 'Biogesic', branch: 'Generika - Quezon City', price: 4.25 },
  { brand: 'Tempra', branch: 'Mercury Drug - Makati Ave', price: 5.00 },
  { brand: 'Tempra', branch: 'Watsons - SM Makati', price: 5.25 },
  { brand: 'Tempra', branch: 'Rose Pharmacy - Alabang', price: 4.80 },
  { brand: 'Alaxan', branch: 'Mercury Drug - Makati Ave', price: 8.50 },
  { brand: 'Alaxan', branch: 'Watsons - SM Makati', price: 8.75 },
  { brand: 'Alaxan', branch: 'CityDrug - Ortigas', price: 8.25 },
  { brand: 'Neozep', branch: 'Mercury Drug - Makati Ave', price: 6.00 },
  { brand: 'Neozep', branch: 'Watsons - SM Makati', price: 6.25 },
  { brand: 'Neozep', branch: 'Generika - Quezon City', price: 5.80 },
  { brand: 'Lipitor', branch: 'Mercury Drug - Makati Ave', price: 45.00 },
  { brand: 'Lipitor', branch: 'Watsons - SM Makati', price: 44.50 },
  { brand: 'Atorvastatin', branch: 'Mercury Drug - Makati Ave', price: 12.00 },
  { brand: 'Atorvastatin', branch: 'Watsons - SM Makati', price: 11.50 },
  { brand: 'Atorvastatin', branch: 'Generika - Quezon City', price: 11.00 },
  { brand: 'Amlodipine', branch: 'Mercury Drug - Makati Ave', price: 8.00 },
  { brand: 'Amlodipine', branch: 'Watsons - SM Makati', price: 7.50 },
  { brand: 'Amlodipine', branch: 'CityDrug - Ortigas', price: 7.80 },
  { brand: 'Norvasc', branch: 'Mercury Drug - Makati Ave', price: 35.00 },
  { brand: 'Norvasc', branch: 'Watsons - SM Makati', price: 34.50 },
  { brand: 'Metformin', branch: 'Mercury Drug - Makati Ave', price: 6.00 },
  { brand: 'Metformin', branch: 'Watsons - SM Makati', price: 5.80 },
  { brand: 'Metformin', branch: 'Generika - Quezon City', price: 5.50 },
  { brand: 'Glucophage', branch: 'Mercury Drug - Makati Ave', price: 25.00 },
  { brand: 'Glucophage', branch: 'Watsons - SM Makati', price: 24.50 },
  // Expansion prices
  { brand: 'Kremil-S', branch: 'Mercury Drug - Makati Ave', price: 7.50 },
  { brand: 'Kremil-S', branch: 'Generika - Quezon City', price: 7.00 },
  { brand: 'Bioflu', branch: 'Mercury Drug - Makati Ave', price: 8.00 },
  { brand: 'Bioflu', branch: 'Watsons - SM Makati', price: 8.50 },
  { brand: 'Bioflu', branch: 'CityDrug - Ortigas', price: 7.75 },
  { brand: 'Rexidol', branch: 'Mercury Drug - Makati Ave', price: 6.50 },
  { brand: 'Rexidol', branch: 'Generika - Quezon City', price: 6.00 },
  { brand: 'Medicol', branch: 'Mercury Drug - Makati Ave', price: 9.00 },
  { brand: 'Medicol', branch: 'Watsons - SM Makati', price: 9.50 },
  { brand: 'Advil', branch: 'Watsons - SM Makati', price: 10.00 },
  { brand: 'Ponstan', branch: 'Mercury Drug - Makati Ave', price: 12.50 },
  { brand: 'Ponstan', branch: 'Watsons - SM Makati', price: 13.00 },
  { brand: 'Mefenamic Acid', branch: 'Generika - Quezon City', price: 7.50 },
  { brand: 'Mefenamic Acid', branch: 'CityDrug - Ermita', price: 7.75 },
  { brand: 'Imodium', branch: 'Mercury Drug - Makati Ave', price: 15.00 },
  { brand: 'Oresol', branch: 'Generika - Quezon City', price: 12.00 },
  { brand: 'Oresol', branch: 'Mercury Drug - SM Manila', price: 12.50 },
  { brand: 'Strepsils', branch: 'Watsons - SM Makati', price: 7.00 },
  { brand: 'Strepsils', branch: 'Mercury Drug - Makati Ave', price: 6.75 },
  { brand: 'Claritin', branch: 'Watsons - SM Makati', price: 22.00 },
  { brand: 'Claritin', branch: 'Mercury Drug - Makati Ave', price: 21.50 },
  { brand: 'Allegra', branch: 'Watsons - SM Makati', price: 32.00 },
  { brand: 'Cozaar', branch: 'Mercury Drug - Makati Ave', price: 38.00 },
  { brand: 'Losartan', branch: 'Generika - Quezon City', price: 9.50 },
  { brand: 'Losartan', branch: 'Mercury Drug - Makati Ave', price: 10.50 },
  { brand: 'Losartan', branch: 'CityDrug - Ortigas', price: 10.00 },
  { brand: 'Renitec', branch: 'Mercury Drug - Makati Ave', price: 12.00 },
  { brand: 'Renitec', branch: 'Generika - Quezon City', price: 11.50 },
  { brand: 'Daonil', branch: 'Mercury Drug - Makati Ave', price: 9.00 },
  { brand: 'Gliclazide', branch: 'Generika - Quezon City', price: 8.50 },
  { brand: 'Zocor', branch: 'Mercury Drug - Makati Ave', price: 36.00 },
  { brand: 'Amoxil', branch: 'Mercury Drug - Makati Ave', price: 15.00 },
  { brand: 'Amoxil', branch: 'Watsons - SM Makati', price: 15.50 },
  { brand: 'Augmentin', branch: 'Mercury Drug - Makati Ave', price: 42.00 },
  { brand: 'Zithromax', branch: 'Mercury Drug - Makati Ave', price: 55.00 },
  { brand: 'Cefalexin', branch: 'Generika - Quezon City', price: 14.00 },
  { brand: 'Losec', branch: 'Mercury Drug - Makati Ave', price: 30.00 },
  { brand: 'Omeprazole', branch: 'Generika - Quezon City', price: 8.00 },
  { brand: 'Omeprazole', branch: 'Mercury Drug - Makati Ave', price: 9.00 },
  { brand: 'Omeprazole', branch: 'CityDrug - Ermita', price: 8.50 },
  { brand: 'Peptac', branch: 'Mercury Drug - Makati Ave', price: 12.50 },
  { brand: 'Ventolin', branch: 'Mercury Drug - Makati Ave', price: 165.00 },
  { brand: 'Bactroban', branch: 'Watsons - SM Makati', price: 95.00 },
  { brand: 'Canesten', branch: 'Watsons - SM Makati', price: 65.00 },
  { brand: 'Betadine', branch: 'Mercury Drug - Makati Ave', price: 55.00 },
  { brand: 'Betadine', branch: 'Watsons - SM Makati', price: 56.50 },
  { brand: 'Voltarol', branch: 'Mercury Drug - Makati Ave', price: 11.00 },
  { brand: 'Naprosyn', branch: 'Mercury Drug - Makati Ave', price: 14.00 },
  { brand: 'Ceelin Plus', branch: 'Generika - Quezon City', price: 85.00 },
  { brand: 'Singulair', branch: 'Mercury Drug - Makati Ave', price: 68.00 },
  { brand: 'Enervon', branch: 'Mercury Drug - Makati Ave', price: 6.50 },
  { brand: 'Enervon', branch: 'Watsons - SM Makati', price: 7.00 },
  { brand: 'Buscopan', branch: 'Mercury Drug - Makati Ave', price: 10.00 },
  { brand: 'Diatabs', branch: 'Mercury Drug - Makati Ave', price: 8.00 },
  { brand: 'Salonpas', branch: 'Watsons - SM Makati', price: 9.50 },
  { brand: 'Efficascent', branch: 'Mercury Drug - Makati Ave', price: 95.00 },
  { brand: 'Ceelin', branch: 'Generika - Quezon City', price: 55.00 },
];

async function seed() {
  console.log('Seeding pharmacy chains...');
  for (const chain of pharmacyChains) {
    const { error } = await supabase.from('pharmacy_chains').upsert(chain);
    if (error) console.error('Error seeding chain:', chain.name, error);
  }

  console.log(`Seeding ${medicines.length} medicines (idempotent)...`);
  let medErrors = 0;
  for (const medicine of medicines) {
    const { error } = await supabase
      .from('medicines')
      .upsert(medicine, { onConflict: 'fda_registration_number' });
    if (error) {
      medErrors++;
      console.error('Error seeding medicine:', medicine.brand_name, error.message);
    }
  }

  console.log(`Seeding ${pharmacyBranches.length} pharmacy branches (idempotent)...`);
  const { data: existingBranches } = await supabase.from('pharmacy_branches').select('name');
  const existingNames = new Set((existingBranches || []).map(b => b.name));
  let branchInserted = 0;
  for (const branch of pharmacyBranches) {
    if (existingNames.has(branch.name)) continue;
    const { chain, ...row } = branch;
    const { error } = await supabase.from('pharmacy_branches').insert({ ...row, chain_id: chain });
    if (error) console.error('Error seeding branch:', branch.name, error.message);
    else branchInserted++;
  }
  console.log(`  inserted ${branchInserted} new branches (${pharmacyBranches.length - branchInserted} already present)`);

  console.log('Seeding prices (idempotent)...');
  const { data: allMedicines } = await supabase.from('medicines').select('id, brand_name');
  const { data: allBranches } = await supabase.from('pharmacy_branches').select('id, name');
  const { data: existingPrices } = await supabase
    .from('prices')
    .select('medicine_id, branch_id, source_type')
    .eq('source_type', 'official');

  const medByBrand = new Map((allMedicines || []).map(m => [m.brand_name, m.id]));
  const branchByName = new Map((allBranches || []).map(b => [b.name, b.id]));
  const priceKeys = new Set((existingPrices || []).map(p => `${p.medicine_id}:${p.branch_id}`));

  let priceInserted = 0;
  let priceSkipped = 0;
  for (const price of prices) {
    const medicineId = medByBrand.get(price.brand);
    const branchId = branchByName.get(price.branch);
    if (!medicineId || !branchId) {
      console.warn('  skip price — unknown brand or branch:', price.brand, '@', price.branch);
      continue;
    }
    const key = `${medicineId}:${branchId}`;
    if (priceKeys.has(key)) {
      priceSkipped++;
      continue;
    }
    const { error } = await supabase.from('prices').insert({
      medicine_id: medicineId,
      branch_id: branchId,
      price: price.price,
      source_type: 'official',
      verification_status: 'verified',
    });
    if (error) console.error('Error seeding price:', price.brand, price.branch, error.message);
    else {
      priceInserted++;
      priceKeys.add(key);
    }
  }

  console.log(`Seed complete: ${medicines.length} medicines, ${branchInserted} new branches, ${priceInserted} new prices (${priceSkipped} price rows already existed).`);
  if (medErrors > 0) process.exitCode = 1;
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
