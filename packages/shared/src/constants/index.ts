export const PHARMACY_CHAINS = [
  { id: 'mercury', name: 'Mercury Drug', color: '#00A651' },
  { id: 'watsons', name: 'Watsons', color: '#E31937' },
  { id: 'rose', name: 'Rose Pharmacy', color: '#FF69B4' },
  { id: 'generika', name: 'Generika Drugstore', color: '#0099CC' },
  { id: 'southstar', name: 'South Star Drug', color: '#FFD700' },
  { id: 'citydrug', name: 'CityDrug', color: '#4169E1' },
] as const;

export const PHARMACY_CHAIN_IDS = PHARMACY_CHAINS.map(c => c.id);

export const DOSAGE_FORMS = [
  'Tablet',
  'Capsule',
  'Syrup',
  'Suspension',
  'Drops',
  'Cream',
  'Ointment',
  'Gel',
  'Inhaler',
  'Injection',
  'Suppository',
  'Patch',
  'Powder',
  'Solution',
] as const;

export const COMMON_CONDITIONS = [
  { id: 'fever', label: 'Fever', labelFil: 'Lagnat' },
  { id: 'headache', label: 'Headache', labelFil: 'Sakit ng Ulo' },
  { id: 'cough', label: 'Cough', labelFil: 'Ubo' },
  { id: 'cold', label: 'Cold', labelFil: 'Sipon' },
  { id: 'hypertension', label: 'High Blood Pressure', labelFil: 'Altapresyon' },
  { id: 'diabetes', label: 'Diabetes', labelFil: 'Diyabetis' },
  { id: 'allergy', label: 'Allergy', labelFil: 'Allergy' },
  { id: 'stomachache', label: 'Stomachache', labelFil: 'Sakit ng Tiyan' },
  { id: 'muscle_pain', label: 'Muscle Pain', labelFil: 'Sakit ng Kalamnan' },
  { id: 'skin_infection', label: 'Skin Infection', labelFil: 'Impeksyon sa Balat' },
] as const;

export const PRICE_STALENESS_THRESHOLDS = {
  fresh: 30,    // days
  stale: 60,    // days
  very_stale: 90, // days
} as const;

export const OUTLIER_THRESHOLD = 0.40; // 40% deviation from median

export const DAILY_SUBMISSION_LIMIT = 10;

export const LANGUAGES = {
  en: 'English',
  fil: 'Filipino',
  ceb: 'Bisaya',
} as const;

export const APP_CONFIG = {
  name: 'BotikaBantay',
  tagline: 'Presyo na Tama, Gamot na Tunay',
  taglineEn: 'The Right Price, The Real Medicine',
  maxSearchRadius: 10, // km
  defaultSearchRadius: 5, // km
} as const;
