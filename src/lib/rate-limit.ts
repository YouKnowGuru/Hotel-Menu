const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export function rateLimit(ip: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (entry.count >= limit) {
    return true;
  }

  entry.count++;
  return false;
}

/** Clear a rate-limit bucket, e.g. after a successful sign-in. */
export function resetRateLimit(key: string) {
  rateLimitMap.delete(key);
}

/** Periodically drop stale buckets so the map cannot grow unbounded. */
if (typeof setInterval === "function") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      // Keep entries seen within the last hour at most.
      if (now - entry.timestamp > 60 * 60 * 1000) rateLimitMap.delete(key);
    }
  }, 10 * 60 * 1000);
  // Don't keep the event loop alive just for cleanup.
  if (typeof timer === "object" && "unref" in timer) timer.unref();
}
