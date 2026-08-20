/**
 * Diagnoses the NextAuth credentials login end-to-end against the dev server.
 * Usage: node scripts/check-login.mjs
 */
const BASE = "http://localhost:3000";

// Tiny cookie jar
let jar = [];
function storeCookies(res) {
  const set = res.headers.getSetCookie?.() ?? [];
  for (const c of set) {
    const [pair] = c.split(";");
    const idx = pair.indexOf("=");
    const name = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    if (value === "" || /deleted/i.test(c)) {
      jar = jar.filter((j) => j.name !== name);
    } else {
      jar = jar.filter((j) => j.name !== name);
      jar.push({ name, value });
    }
  }
}
const cookieHeader = () => jar.map((j) => `${j.name}=${j.value}`).join("; ");

const email = `login-test-${Date.now()}@example.com`;
const password = "login-test-password-123";

// 1. Register a fresh user
{
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Login Test", email, password }),
  });
  console.log(`[1] register → ${res.status}`, (await res.json().catch(() => ({}))).message ?? "");
}

// 2. Get CSRF token (and its cookie)
let csrfToken = "";
{
  const res = await fetch(`${BASE}/api/auth/csrf`);
  storeCookies(res);
  csrfToken = (await res.json()).csrfToken;
  console.log(`[2] csrf → ${res.status}, token=${csrfToken.slice(0, 12)}…, jar: ${jar.map((j) => j.name).join(", ")}`);
}

// 3. Credentials sign-in via the NextAuth callback endpoint
{
  const res = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: "POST",
    redirect: "manual",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookieHeader(),
    },
    body: new URLSearchParams({
      csrfToken,
      email,
      password,
      json: "true",
    }).toString(),
  });
  storeCookies(res);
  console.log(`[3] callback/credentials → ${res.status} ${res.headers.get("location") ?? "(no redirect)"}`);
  console.log(`    set-cookie: ${(res.headers.getSetCookie?.() ?? []).map((c) => c.split("=")[0]).join(", ") || "(none)"}`);
  const hasSession = jar.some((j) => j.name.includes("session-token"));
  console.log(`    session cookie in jar: ${hasSession}`);
}

// 4. Check the session
{
  const res = await fetch(`${BASE}/api/auth/session`, { headers: { Cookie: cookieHeader() } });
  const d = await res.json();
  console.log(`[4] session → ${res.status}:`, JSON.stringify(d));
}

// 5. Check protected page/API with the session cookie
{
  const res = await fetch(`${BASE}/api/settings`, { headers: { Cookie: cookieHeader() }, redirect: "manual" });
  console.log(`[5] GET /api/settings with session → ${res.status}`);
}

// 6. Cleanup the test user (direct DB)
{
  const { readFileSync } = await import("node:fs");
  const { resolve, dirname } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  try {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
    for (const line of readFileSync(resolve(root, ".env.local"), "utf8").split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i === -1) continue;
      const k = t.slice(0, i).trim();
      if (!(k in process.env)) process.env[k] = t.slice(i + 1).trim();
    }
    const mongoose = (await import("mongoose")).default;
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    await mongoose.connection.db.collection("users").deleteOne({ email });
    await mongoose.disconnect();
    console.log("[6] test user cleaned up");
  } catch (e) {
    console.log("[6] cleanup skipped:", e.message);
  }
}
