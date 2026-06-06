import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type SettingsMap = Record<string, unknown>;

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw error;
      const map: SettingsMap = {};
      for (const row of data ?? []) map[row.key] = row.value;
      return map;
    },
    staleTime: 60_000,
  });
}

export function settingString(settings: SettingsMap | undefined, key: string, fallback = ""): string {
  const v = settings?.[key];
  return typeof v === "string" ? v : fallback;
}

export function settingNumber(settings: SettingsMap | undefined, key: string, fallback: number): number {
  const v = settings?.[key];
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

export function settingStringArray(settings: SettingsMap | undefined, key: string): string[] {
  const v = settings?.[key];
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  return [];
}
