import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.');
  console.error('Set them in your .env file or export them before running this script.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const pharmacyChains = [
  { id: 'mercury', name: 'Mercury Drug', color: '#00A651' },
  { id: 'watsons', name: 'Watsons', color: '#E31937' },
  { id: 'rose', name: 'Rose Pharmacy', color: '#FF69B4' },
  { id: 'generika', name: 'Generika Drugstore', color: '#0099CC' },
  { id: 'southstar', name: 'South Star Drug', color: '#FFD700' },
  { id: 'citydrug', name: 'CityDrug', color: '#4169E1' },
];

const medicines = [
  {
    brand_name: 'Biogesic',
    generic_name: 'Paracetamol',
    dosage_form: 'Tablet',
    strength: '500mg',
    manufacturer: 'Unilab',
    fda_registration_number: 'FDA-RXY-1234',
    barcode: '4800000000012',
    conditions: ['fever', 'headache'],
  },
  {
    brand_name: 'Tempra',
    generic_name: 'Paracetamol',
    dosage_form: 'Tablet',
    strength: '500mg',
    manufacturer: 'Aristopharma',
    fda_registration_number: 'FDA-RXY-1235',
    barcode: '4800000000013',
    conditions: ['fever', 'headache'],
  },
  {
    brand_name: 'Alaxan',
    generic_name: 'Ibuprofen + Paracetamol',
    dosage_form: 'Capsule',
    strength: '200mg + 325mg',
    manufacturer: 'Unilab',
    fda_registration_number: 'FDA-RXY-1236',
    barcode: '4800000000014',
    conditions: ['headache', 'muscle_pain'],
  },
  {
    brand_name: 'Neozep',
    generic_name: 'Phenylpropanolamine + Chlorpheniramine + Paracetamol',
    dosage_form: 'Tablet',
    strength: '25mg + 2mg + 500mg',
    manufacturer: 'Unilab',
    fda_registration_number: 'FDA-RXY-1237',
    barcode: '4800000000015',
    conditions: ['cold', 'cough'],
  },
  {
    brand_name: 'Decolgen',
    generic_name: 'Phenylpropanolamine + Chlorpheniramine + Paracetamol',
    dosage_form: 'Tablet',
    strength: '25mg + 2mg + 500mg',
    manufacturer: 'Pfizer',
    fda_registration_number: 'FDA-RXY-1238',
    barcode: '4800000000016',
    conditions: ['cold', 'cough'],
  },
  {
    brand_name: 'Amoxicillin',
    generic_name: 'Amoxicillin',
    dosage_form: 'Capsule',
    strength: '500mg',
    manufacturer: 'Generic',
    fda_registration_number: 'FDA-RXY-1239',
    barcode: '4800000000017',
    conditions: ['skin_infection'],
  },
  {
    brand_name: 'Lipitor',
    generic_name: 'Atorvastatin',
    dosage_form: 'Tablet',
    strength: '20mg',
    manufacturer: 'Pfizer',
    fda_registration_number: 'FDA-RXY-1240',
    barcode: '4800000000018',
    conditions: ['hypertension'],
  },
  {
    brand_name: 'Atorvastatin',
    generic_name: 'Atorvastatin',
    dosage_form: 'Tablet',
    strength: '20mg',
    manufacturer: 'Generic',
    fda_registration_number: 'FDA-RXY-1241',
    barcode: '4800000000019',
    conditions: ['hypertension'],
  },
  {
    brand_name: 'Amlodipine',
    generic_name: 'Amlodipine',
    dosage_form: 'Tablet',
    strength: '5mg',
    manufacturer: 'Generic',
    fda_registration_number: 'FDA-RXY-1242',
    barcode: '4800000000020',
    conditions: ['hypertension'],
  },
  {
    brand_name: 'Norvasc',
    generic_name: 'Amlodipine',
    dosage_form: 'Tablet',
    strength: '5mg',
    manufacturer: 'Pfizer',
    fda_registration_number: 'FDA-RXY-1243',
    barcode: '4800000000021',
    conditions: ['hypertension'],
  },
  {
    brand_name: 'Metformin',
    generic_name: 'Metformin',
    dosage_form: 'Tablet',
    strength: '500mg',
    manufacturer: 'Generic',
    fda_registration_number: 'FDA-RXY-1244',
    barcode: '4800000000022',
    conditions: ['diabetes'],
  },
  {
    brand_name: 'Glucophage',
    generic_name: 'Metformin',
    dosage_form: 'Tablet',
    strength: '500mg',
    manufacturer: 'Merck',
    fda_registration_number: 'FDA-RXY-1245',
    barcode: '4800000000023',
    conditions: ['diabetes'],
  },
  {
    brand_name: 'Allerta',
    generic_name: 'Cetirizine',
    dosage_form: 'Tablet',
    strength: '10mg',
    manufacturer: 'Pfizer',
    fda_registration_number: 'FDA-RXY-1246',
    barcode: '4800000000024',
    conditions: ['allergy'],
  },
  {
    brand_name: 'Cetirizine',
    generic_name: 'Cetirizine',
    dosage_form: 'Tablet',
    strength: '10mg',
    manufacturer: 'Generic',
    fda_registration_number: 'FDA-RXY-1247',
    barcode: '4800000000025',
    conditions: ['allergy'],
  },
  {
    brand_name: 'Enervon',
    generic_name: 'Ascorbic Acid + B Complex',
    dosage_form: 'Tablet',
    strength: '500mg + B Complex',
    manufacturer: 'Unilab',
    fda_registration_number: 'FDA-RXY-1248',
    barcode: '4800000000026',
    conditions: [],
  },
  {
    brand_name: 'Buscopan',
    generic_name: 'Hyoscine Butylbromide',
    dosage_form: 'Tablet',
    strength: '10mg',
    manufacturer: 'Boehringer Ingelheim',
    fda_registration_number: 'FDA-RXY-1249',
    barcode: '4800000000027',
    conditions: ['stomachache'],
  },
  {
    brand_name: 'Diatabs',
    generic_name: 'Loperamide + Attapulgite',
    dosage_form: 'Capsule',
    strength: '2mg + 625mg',
    manufacturer: 'Pascual Laboratories',
    fda_registration_number: 'FDA-RXY-1250',
    barcode: '4800000000028',
    conditions: ['stomachache'],
  },
  {
    brand_name: 'Salonpas',
    generic_name: 'Methyl Salicylate + Menthol',
    dosage_form: 'Patch',
    strength: '100mg + 30mg',
    manufacturer: 'Hisamitsu',
    fda_registration_number: 'FDA-RXY-1251',
    barcode: '4800000000029',
    conditions: ['muscle_pain'],
  },
  {
    brand_name: 'Efficascent',
    generic_name: 'Methyl Salicylate + Menthol + Eucalyptus Oil',
    dosage_form: 'Solution',
    strength: '30% + 10% + 5%',
    manufacturer: 'Pascual Laboratories',
    fda_registration_number: 'FDA-RXY-1252',
    barcode: '4800000000030',
    conditions: ['muscle_pain'],
  },
  {
    brand_name: 'Ceelin',
    generic_name: 'Ascorbic Acid',
    dosage_form: 'Drops',
    strength: '100mg/mL',
    manufacturer: 'Unilab',
    fda_registration_number: 'FDA-RXY-1253',
    barcode: '4800000000031',
    conditions: [],
  },
];

const pharmacyBranches = [
  {
    chain_id: 'mercury',
    name: 'Mercury Drug - Makati Ave',
    address: '123 Makati Ave, Makati City',
    latitude: 14.5547,
    longitude: 121.0500,
    city: 'Makati City',
    province: 'Metro Manila',
  },
  {
    chain_id: 'mercury',
    name: 'Mercury Drug - BGC',
    address: '456 5th Ave, BGC, Taguig City',
    latitude: 14.5510,
    longitude: 121.0480,
    city: 'Taguig City',
    province: 'Metro Manila',
  },
  {
    chain_id: 'watsons',
    name: 'Watsons - SM Makati',
    address: 'SM Makati, Ayala Ave, Makati City',
    latitude: 14.5509,
    longitude: 121.0540,
    city: 'Makati City',
    province: 'Metro Manila',
  },
  {
    chain_id: 'rose',
    name: 'Rose Pharmacy - Alabang',
    address: '789 Alabang-Zapote Rd, Muntinlupa City',
    latitude: 14.4150,
    longitude: 121.0350,
    city: 'Muntinlupa City',
    province: 'Metro Manila',
  },
  {
    chain_id: 'generika',
    name: 'Generika - Quezon City',
    address: '321 Quezon Ave, Quezon City',
    latitude: 14.6500,
    longitude: 121.0300,
    city: 'Quezon City',
    province: 'Metro Manila',
  },
  {
    chain_id: 'southstar',
    name: 'South Star Drug - Pasig',
    address: '555 Ortigas Ave, Pasig City',
    latitude: 14.5800,
    longitude: 121.0600,
    city: 'Pasig City',
    province: 'Metro Manila',
  },
];

const prices = [
  // Biogesic
  { medicine_index: 0, branch_index: 0, price: 4.50 },
  { medicine_index: 0, branch_index: 2, price: 4.75 },
  { medicine_index: 0, branch_index: 4, price: 4.25 },
  // Tempra
  { medicine_index: 1, branch_index: 0, price: 5.00 },
  { medicine_index: 1, branch_index: 2, price: 5.25 },
  { medicine_index: 1, branch_index: 3, price: 4.80 },
  // Alaxan
  { medicine_index: 2, branch_index: 0, price: 8.50 },
  { medicine_index: 2, branch_index: 2, price: 8.75 },
  { medicine_index: 2, branch_index: 5, price: 8.25 },
  // Neozep
  { medicine_index: 3, branch_index: 0, price: 6.00 },
  { medicine_index: 3, branch_index: 2, price: 6.25 },
  { medicine_index: 3, branch_index: 4, price: 5.80 },
  // Lipitor (branded)
  { medicine_index: 6, branch_index: 0, price: 45.00 },
  { medicine_index: 6, branch_index: 2, price: 44.50 },
  // Atorvastatin (generic)
  { medicine_index: 7, branch_index: 0, price: 12.00 },
  { medicine_index: 7, branch_index: 2, price: 11.50 },
  { medicine_index: 7, branch_index: 4, price: 11.00 },
  // Amlodipine (generic)
  { medicine_index: 8, branch_index: 0, price: 8.00 },
  { medicine_index: 8, branch_index: 2, price: 7.50 },
  { medicine_index: 8, branch_index: 5, price: 7.80 },
  // Norvasc (branded)
  { medicine_index: 9, branch_index: 0, price: 35.00 },
  { medicine_index: 9, branch_index: 2, price: 34.50 },
  // Metformin (generic)
  { medicine_index: 10, branch_index: 0, price: 6.00 },
  { medicine_index: 10, branch_index: 2, price: 5.80 },
  { medicine_index: 10, branch_index: 4, price: 5.50 },
  // Glucophage (branded)
  { medicine_index: 11, branch_index: 0, price: 25.00 },
  { medicine_index: 11, branch_index: 2, price: 24.50 },
];

async function seed() {
  console.log('Seeding pharmacy chains...');
  for (const chain of pharmacyChains) {
    const { error } = await supabase.from('pharmacy_chains').upsert(chain);
    if (error) console.error('Error seeding chain:', chain.name, error);
  }

  console.log('Seeding medicines...');
  for (const medicine of medicines) {
    const { error } = await supabase.from('medicines').upsert({
      ...medicine,
      fda_registration_number: medicine.fda_registration_number,
    });
    if (error) console.error('Error seeding medicine:', medicine.brand_name, error);
  }

  console.log('Seeding pharmacy branches...');
  const { data: branches } = await supabase.from('pharmacy_branches').select('*');
  
  if (!branches || branches.length === 0) {
    for (const branch of pharmacyBranches) {
      const { error } = await supabase.from('pharmacy_branches').insert(branch);
      if (error) console.error('Error seeding branch:', branch.name, error);
    }
  }

  console.log('Seeding prices...');
  const { data: allMedicines } = await supabase.from('medicines').select('*');
  const { data: allBranches } = await supabase.from('pharmacy_branches').select('*');

  if (allMedicines && allBranches) {
    for (const price of prices) {
      const medicine = allMedicines[price.medicine_index];
      const branch = allBranches[price.branch_index];
      
      if (medicine && branch) {
        const { error } = await supabase.from('prices').insert({
          medicine_id: medicine.id,
          branch_id: branch.id,
          price: price.price,
          source_type: 'official',
          verification_status: 'verified',
        });
        if (error) console.error('Error seeding price:', error);
      }
    }
  }

  console.log('Seeding complete!');
}

seed().catch(console.error);
