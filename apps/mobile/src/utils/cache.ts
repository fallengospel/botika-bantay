import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@botika_bantay_cache:';
const DEFAULT_TTL = 5 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface ReadOpts {
  /** When true, return expired entries too (offline fallback). */
  allowExpired?: boolean;
}

export async function setCache<T>(key: string, data: T, ttl: number = DEFAULT_TTL): Promise<void> {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttl,
  };
  await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
}

export async function getCache<T>(key: string, opts?: ReadOpts): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    const isExpired = Date.now() - entry.timestamp > entry.ttl;

    if (isExpired && !opts?.allowExpired) {
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

export async function clearCache(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const cacheKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX));
  await AsyncStorage.multiRemove(cacheKeys);
}

export async function getMedicinesCached(search?: string, opts?: ReadOpts) {
  const cacheKey = `medicines:${search || 'all'}`;
  return getCache<any[]>(cacheKey, opts);
}

export async function setMedicinesCached(data: any[], search?: string) {
  const cacheKey = `medicines:${search || 'all'}`;
  await setCache(cacheKey, data, 10 * 60 * 1000);
}

export async function getMedicineDetailCached(id: string, opts?: ReadOpts) {
  return getCache<any>(`medicine:${id}`, opts);
}

export async function setMedicineDetailCached(id: string, data: any) {
  await setCache(`medicine:${id}`, data, 10 * 60 * 1000);
}

export async function getPricesCached(medicineId: string, opts?: ReadOpts) {
  return getCache<any[]>(`prices:${medicineId}`, opts);
}

export async function setPricesCached(medicineId: string, data: any[]) {
  await setCache(`prices:${medicineId}`, data, 5 * 60 * 1000);
}
