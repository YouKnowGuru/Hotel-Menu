import mongoose from "mongoose";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// When running outside Next.js (scripts, tests) .env.local is not loaded
// automatically, so read it as a fallback without overriding real env vars.
if (!process.env.MONGODB_URI) {
  try {
    const text = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      if (!(key in process.env)) process.env[key] = trimmed.slice(idx + 1).trim();
    }
  } catch {
    /* no .env.local present — fall back to the default below */
  }
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/menu-studio";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      // Generous timeouts: Atlas TLS handshakes can exceed 3s on cold starts.
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
