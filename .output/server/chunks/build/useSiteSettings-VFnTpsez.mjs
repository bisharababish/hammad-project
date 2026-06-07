import { u as useQuery } from "./useQuery-Bpq8_YCx.mjs";
import { k as supabase } from "./router-CAv_LuLj.mjs";
function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw error;
      const map = {};
      for (const row of data ?? []) map[row.key] = row.value;
      return map;
    },
    staleTime: 6e4
  });
}
function settingNumber(settings, key, fallback) {
  const v = settings?.[key];
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}
function settingStringArray(settings, key) {
  const v = settings?.[key];
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string");
  return [];
}
export {
  settingStringArray as a,
  settingNumber as s,
  useSiteSettings as u
};
