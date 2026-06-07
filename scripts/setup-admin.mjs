/**
 * Creates hammad@gmail.com as admin in Supabase.
 *
 * Usage:
 *   1. Add SUPABASE_SERVICE_ROLE_KEY to .env (Dashboard → Settings → API → service_role)
 *   2. node scripts/setup-admin.mjs
 *
 * Default password: Hammad123!  (change after first login)
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  try {
    const raw = readFileSync(resolve(root, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z_]+)="?(.*)"?$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {
    /* no .env */
  }
}

loadEnv();

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = "hammad@gmail.com";
const password = process.env.ADMIN_PASSWORD || "Hammad123!";

if (!url || !serviceKey) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env\n" +
      "Get the service role key from Supabase Dashboard → Settings → API",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: existing } = await admin.auth.admin.listUsers();
const found = existing?.users?.find((u) => u.email === email);

let userId = found?.id;

if (!userId) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Hammad" },
  });
  if (error) {
    console.error("Failed to create user:", error.message);
    process.exit(1);
  }
  userId = data.user.id;
  console.log("Created user:", email);
} else {
  console.log("User already exists:", email);
}

const { error: roleErr } = await admin.from("user_roles").upsert(
  { user_id: userId, role: "admin" },
  { onConflict: "user_id,role" },
);

if (roleErr) {
  console.error("Failed to set admin role:", roleErr.message);
  process.exit(1);
}

console.log("\nAdmin ready!");
console.log("  Email:   ", email);
console.log("  Password:", password);
console.log("  Login:   /login?redirect=/admin");
