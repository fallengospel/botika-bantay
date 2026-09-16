export interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  fdaRegistrationNumber: string;
  barcode?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PharmacyChain {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
}

export interface PharmacyBranch {
  id: string;
  chainId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  province: string;
  createdAt: Date;
}

export interface Price {
  id: string;
  medicineId: string;
  branchId: string;
  price: number;
  sourceType: 'official' | 'crowdsourced';
  submittedBy?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  photoUrl?: string;
  lastUpdated: Date;
  createdAt: Date;
}

export interface VerificationRecord {
  id: string;
  medicineId?: string;
  scannedCode: string;
  matchResult: 'found' | 'not_found' | 'ambiguous';
  fdaData?: Record<string, unknown>;
  createdAt: Date;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  displayName: string;
  contributionCount: number;
  createdAt: Date;
}

export interface PriceSubmission {
  id: string;
  userId: string;
  medicineId: string;
  branchId: string;
  price: number;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  outlierFlag: boolean;
  createdAt: Date;
}

export interface SuspiciousProductReport {
  id: string;
  userId?: string;
  medicineId?: string;
  scannedCode: string;
  description: string;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
  moderationStatus: 'pending' | 'reviewed' | 'forwarded_to_fda';
  createdAt: Date;
}

export interface SearchFilters {
  query: string;
  type?: 'brand' | 'generic' | 'condition';
  city?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface PriceComparison {
  medicine: Medicine;
  prices: Array<{
    branch: PharmacyBranch;
    price: number;
    sourceType: 'official' | 'crowdsourced';
    lastUpdated: Date;
    staleness: 'fresh' | 'stale' | 'very_stale';
  }>;
  genericAlternative?: Medicine;
  savings?: number;
}
