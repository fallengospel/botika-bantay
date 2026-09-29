// CSRF Protection: generate and validate tokens
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 32; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

export function validateCsrfToken(token: string, stored: string): boolean {
  if (!token || !stored) return false;
  return token === stored;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

// ---------------------------------------------------------------------------
// In-memory fallback (local dev / Redis not configured / Redis unavailable).
// Per-instance only — not shared across serverless instances.
// ---------------------------------------------------------------------------

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
let pruneCursor = 0;

function pruneExpired(now: number): void {
  if (rateLimitStore.size < 10_000) return;
  // Amortized scan: visit a slice of keys per call instead of the whole map.
  const keys = Array.from(rateLimitStore.keys());
  const slice = Math.min(keys.length, 500);
  for (let i = 0; i < slice; i++) {
    const key = keys[(pruneCursor + i) % keys.length];
    const rec = rateLimitStore.get(key);
    if (rec && now > rec.resetAt) rateLimitStore.delete(key);
  }
  pruneCursor = (pruneCursor + slice) % Math.max(keys.length, 1);
}

function memoryRateLimit(key: string, maxRequests: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  pruneExpired(now);
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
}

// ---------------------------------------------------------------------------
// Upstash Redis (REST) shared limiter — QA-008.
// Enabled when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set
// (e.g. on Vercel). Falls back to in-memory if unset or unreachable.
// ---------------------------------------------------------------------------

// Atomic fixed-window counter: INCR + PEXPIRE on first hit, returns [count, ttl].
const RATE_LIMIT_SCRIPT = `
local c = redis.call('INCR', KEYS[1])
if c == 1 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
end
local t = redis.call('PTTL', KEYS[1])
return { tostring(c), tostring(t) }
`;

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
let redisWarned = false;

async function redisRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult | null> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;

  try {
    const res = await fetch(`${REDIS_URL}/eval`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: RATE_LIMIT_SCRIPT,
        keys: [`ratelimit:${key}`],
        arguments: [String(windowMs)],
      }),
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) throw new Error(`Upstash ${res.status}`);

    const data = (await res.json()) as { result?: [string, string] };
    const count = parseInt(data.result?.[0] ?? '1', 10);
    let ttl = parseInt(data.result?.[1] ?? String(windowMs), 10);
    if (ttl <= 0) ttl = windowMs;

    const now = Date.now();
    return {
      allowed: count <= maxRequests,
      remaining: Math.max(0, maxRequests - count),
      resetAt: now + ttl,
    };
  } catch {
    if (!redisWarned) {
      redisWarned = true;
      console.warn('Rate limit Redis unavailable — falling back to in-memory (per-instance).');
    }
    return null;
  }
}

export async function checkRateLimit(
  key: string,
  maxRequests: number = 60,
  windowMs: number = 60000
): Promise<RateLimitResult> {
  const redis = await redisRateLimit(key, maxRequests, windowMs);
  if (redis) return redis;
  return memoryRateLimit(key, maxRequests, windowMs);
}

// Pagination helper
export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function paginateResponse(data: any[], total: number, page: number, limit: number) {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
}
