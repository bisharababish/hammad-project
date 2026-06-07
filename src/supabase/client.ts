import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

function createSupabaseClient() {
  const SUPABASE_URL =
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    (typeof import.meta !== "undefined"
      ? import.meta.env?.VITE_SUPABASE_URL
      : undefined);

  const SUPABASE_PUBLISHABLE_KEY =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    (typeof import.meta !== "undefined"
      ? import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY
      : undefined);

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    console.error(`[Supabase] Missing env vars — rendering without Supabase`);
    return null;
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy(
  {} as NonNullable<ReturnType<typeof createSupabaseClient>>,
  {
    get(_, prop, receiver) {
      if (!_supabase) _supabase = createSupabaseClient();
      if (!_supabase)
        return () =>
          Promise.resolve({
            data: null,
            error: new Error("Supabase not configured"),
          });
      return Reflect.get(_supabase, prop, receiver);
    },
  },
);
