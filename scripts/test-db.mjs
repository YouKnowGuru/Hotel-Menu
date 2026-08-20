/**
 * Standalone MongoDB Atlas connection test.
 * Usage: node scripts/test-db.mjs
 * Reads MONGODB_URI from .env.local without printing the password.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Minimal .env.local parser (KEY=VALUE lines, # comments).
function loadEnv(path) {
  try {
    const text = readFileSync(path, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    /* fall back to existing process.env */
  }
}

loadEnv(resolve(root, ".env.local"));

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set in .env.local");
  process.exit(1);
}

function redact(u) {
  try {
    const parsed = new URL(u);
    if (parsed.password) parsed.password = "****";
    return parsed.toString();
  } catch {
    return "<invalid uri>";
  }
}

console.log(`Connecting to: ${redact(uri)}`);

try {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  });

  const db = mongoose.connection.db;
  const adminResult = await db.admin().ping();
  console.log("✔ ping:", JSON.stringify(adminResult));
  console.log("✔ connected to database:", db.databaseName);

  const collections = await db.listCollections().toArray();
  console.log("✔ collections:", collections.map((c) => c.name).join(", ") || "(none yet)");

  for (const name of ["users", "projects", "templates", "brandkits", "userSettings", "exporthistories"]) {
    if (collections.some((c) => c.name === name)) {
      const count = await db.collection(name).countDocuments();
      console.log(`  - ${name}: ${count} document(s)`);
    }
  }

  await mongoose.disconnect();
  console.log("✔ disconnected cleanly — Atlas connection works.");
  process.exit(0);
} catch (error) {
  console.error("✘ connection failed:", error.message);
  process.exit(1);
}
