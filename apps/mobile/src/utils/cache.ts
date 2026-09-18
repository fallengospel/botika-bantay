import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@botika_bantay_cache:';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export async function setCache<T>(key: string, data: T, ttl: number = DEFAULT_TTL): Promise<void> {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttl,
  };
  await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    const isExpired = Date.now() - entry.timestamp > entry.ttl;

    if (isExpired) {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
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

export async function getMedicinesCached(search?: string) {
  const cacheKey = `medicines:${search || 'all'}`;
  return getCache<any[]>(cacheKey);
}

export async function setMedicinesCached(data: any[], search?: string) {
  const cacheKey = `medicines:${search || 'all'}`;
  await setCache(cacheKey, data, 10 * 60 * 1000); // 10 minutes for medicines
}

export async function getMedicineDetailCached(id: string) {
  return getCache<any>(`medicine:${id}`);
}

export async function setMedicineDetailCached(id: string, data: any) {
  await setCache(`medicine:${id}`, data, 10 * 60 * 1000);
}

export async function getPricesCached(medicineId: string) {
  return getCache<any[]>(`prices:${medicineId}`);
}

export async function setPricesCached(medicineId: string, data: any[]) {
  await setCache(`prices:${medicineId}`, data, 5 * 60 * 1000); // 5 minutes for prices
}
