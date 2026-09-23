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

    const entry: unknown = JSON.parse(raw);
    if (
      !entry ||
      typeof entry !== 'object' ||
      !('data' in entry) ||
      !('timestamp' in entry) ||
      !('ttl' in entry) ||
      typeof (entry as CacheEntry<T>).timestamp !== 'number' ||
      typeof (entry as CacheEntry<T>).ttl !== 'number'
    ) {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    const parsed = entry as CacheEntry<T>;
    const isExpired = Date.now() - parsed.timestamp > parsed.ttl;

    if (isExpired && !opts?.allowExpired) {
      return null;
    }

    // Reject corrupt list caches (Miguel null/shape guards)
    if (key.startsWith('medicines:') || key.startsWith('prices:')) {
      if (!Array.isArray(parsed.data)) {
        await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
        return null;
      }
    }

    return parsed.data;
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
