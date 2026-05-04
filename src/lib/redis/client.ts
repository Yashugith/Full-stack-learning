import Redis from "ioredis";

let redis: Redis | null = null;

function getRedisConfig() {
  const url = process.env.REDIS_URL;
  if (url) {
    return {
      host: new URL(url).hostname,
      port: parseInt(new URL(url).port || "6379"),
      password: decodeURIComponent(new URL(url).password) || undefined,
      tls: url.startsWith("rediss://") ? { rejectUnauthorized: false } : undefined,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => Math.min(times * 100, 3000)
    };
  }
  return {
    host: "localhost",
    port: 6379,
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => Math.min(times * 100, 3000)
  };
}

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis(getRedisConfig() as ConstructorParameters<typeof Redis>[0]);
    redis.on("error", err => {
      // Don't crash the app if Redis is unavailable
      console.warn("[Redis] Connection error (non-fatal):", err.message);
    });
  }
  return redis;
}

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const val = await getRedisClient().get(key);
      return val ? (JSON.parse(val) as T) : null;
    } catch { return null; }
  },
  async set(key: string, value: unknown, ttl = 3600): Promise<void> {
    try {
      await getRedisClient().setex(key, ttl, JSON.stringify(value));
    } catch { /* non-fatal */ }
  },
  async del(key: string): Promise<void> {
    try {
      await getRedisClient().del(key);
    } catch { /* non-fatal */ }
  },
  async rateLimit(key: string, limit: number, windowMs: number): Promise<{ success: boolean; remaining: number }> {
    try {
      const current = await getRedisClient().incr(key);
      if (current === 1) await getRedisClient().pexpire(key, windowMs);
      return { success: current <= limit, remaining: Math.max(0, limit - current) };
    } catch {
      return { success: true, remaining: limit }; // fail open
    }
  }
};

export const CACHE_KEYS = {
  conversations: (uid: string) => `convs:${uid}`,
  stats:         (uid: string) => `stats:${uid}`,
  rateLimit:     (uid: string) => `rl:chat:${uid}`
};
