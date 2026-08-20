/**
 * End-to-end API smoke test against the running dev server + live Atlas DB.
 * Usage: node scripts/check-api.mjs   (requires `npm run dev` running)
 */
import mongoose from "mongoose";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Load MONGODB_URI from .env.local for the direct DB verification step.
try {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const text = readFileSync(resolve(root, ".env.local"), "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    if (!(key in process.env)) process.env[key] = trimmed.slice(idx + 1).trim();
  }
} catch {
  /* no .env.local */
}

const BASE = "http://localhost:3000";
let failures = 0;

function check(name, ok, detail = "") {
  console.log(`${ok ? "✔" : "✘"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

// 1. Templates served from the database (with preview + gradient)
{
  const res = await fetch(`${BASE}/api/templates`);
  const d = await res.json();
  check("GET /api/templates", res.ok && d.success, `${d.data?.length ?? 0} templates`);
  const withPreview = (d.data ?? []).filter((t) => t.preview).length;
  check("templates carry preview data", withPreview === (d.data ?? []).length, `${withPreview}/${d.data?.length ?? 0}`);
}

// 2. Category filtering
{
  const res = await fetch(`${BASE}/api/templates?category=coffee`);
  const d = await res.json();
  const allCoffee = (d.data ?? []).every((t) => t.category === "coffee");
  check("GET /api/templates?category=coffee", res.ok && allCoffee, `${d.data?.length ?? 0} result(s)`);
}

// 3. Settings require authentication
{
  const res = await fetch(`${BASE}/api/settings`);
  check("GET /api/settings without session → 401", res.status === 401, `status ${res.status}`);
}

// 4. Contact validation rejects bad payloads
{
  const res = await fetch(`${BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "A", email: "not-an-email", subject: "x", message: "short" }),
  });
  check("POST /api/contact invalid body → 400", res.status === 400, `status ${res.status}`);
}

// 5. Forgot-password is enumeration-safe (200 even for unknown emails)
{
  const res = await fetch(`${BASE}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "nobody-here@example.com" }),
  });
  const d = await res.json().catch(() => ({}));
  check("POST /api/auth/forgot-password unknown email → 200", res.ok && d.success === true, `status ${res.status}`);
}

// 6. Register round-trip: create a user in Atlas, verify it, then clean up
{
  const email = `smoke-test-${Date.now()}@example.com`;
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Smoke Test", email, password: "test-password-123" }),
  });
  const d = await res.json().catch(() => ({}));
  check("POST /api/auth/register → 201", res.status === 201, d.message ?? d.error ?? "");

  // Verify the document landed in Atlas, then remove it.
  const uri = process.env.MONGODB_URI;
  if (uri) {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
    const count = await mongoose.connection.db.collection("users").countDocuments({ email });
    check("user persisted in Atlas", count === 1, `${count} document(s)`);
    await mongoose.connection.db.collection("users").deleteOne({ email });
    await mongoose.disconnect();
    console.log("  (test user cleaned up)");
  } else {
    console.log("  ! MONGODB_URI not in env — skipped DB verification (Next.js loads .env.local itself)");
  }
}

console.log(failures === 0 ? "\nAll API checks passed." : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
