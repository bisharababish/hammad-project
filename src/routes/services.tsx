import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Al-Prince Car Wash" },
      { name: "description", content: "Basic wash, full service, and pro polishing — three premium packages." },
    ],
  }),
  component: ServicesPage,
});

function parseFeatures(raw: unknown, lang: "ar" | "en"): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string");
}

function ServicesPage() {
  const { tr, lang } = useI18n();
  const nav = useNavigate();
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="px-[8%] py-20" style={{ background: "var(--surface-alt)" }}>
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <span style={{ fontFamily: "Poppins", fontSize: 11, fontWeight: 600, color: "var(--gold-dark)", letterSpacing: 3, textTransform: "uppercase" }}>{tr("services.label")}</span>
        <h2 className="mt-3 mb-4 font-black" style={{ fontFamily: "Cairo", fontSize: "clamp(26px,3.2vw,42px)" }}>
          <span className="gold-gradient-text">{tr("services.heading")}</span>
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>{tr("services.sub")}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {services?.map((s) => {
          const popular = s.slug === "full";
          const features = parseFeatures(lang === "ar" ? s.features_ar : s.features_en, lang);
          return (
            <article
              key={s.id}
              className="card-surface overflow-hidden flex flex-col"
              style={popular ? { borderColor: "rgba(201,168,76,.45)" } : undefined}
            >
              <div
                className="h-44 flex items-center justify-center relative"
                style={{
                  background: popular
                    ? "linear-gradient(135deg,#FFF0D6,#FFFBF5)"
                    : s.slug === "pro"
                      ? "linear-gradient(135deg,#FFF6E8,#FFFBF5)"
                      : "linear-gradient(135deg,#FFF9EE,#FFFBF5)",
                }}
              >
                <span style={{ fontSize: 62 }}>{s.emoji}</span>
                <span
                  className="absolute top-3.5 px-2.5 py-0.5 rounded-full"
                  style={{
                    insetInlineStart: 14,
                    background: "var(--surface-alt)",
                    border: "1px solid var(--border-hover)",
                    color: "var(--gold-dark)",
                    fontFamily: "Poppins",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: 1.5,
                  }}
                >
                  {popular ? tr("services.popular") : s.slug === "pro" ? "PREMIUM" : "BASIC"}
                </span>
              </div>
              <div className="p-6 flex flex-col gap-3 flex-1">
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
                    {lang === "ar" ? s.name_ar : s.name_en}
                  </div>
                  <div style={{ fontFamily: "Poppins", fontSize: 10, color: "var(--gold-dark)", letterSpacing: 1, textTransform: "uppercase" }}>
                    {lang === "ar" ? s.name_en : s.name_ar}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>
                  {lang === "ar" ? s.description_ar : s.description_en}
                </p>
                {features.length > 0 && (
                  <ul className="flex flex-col gap-2 my-2 flex-1">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2" style={{ fontSize: 13, color: "var(--text-light)" }}>
                        <Check size={14} style={{ color: "var(--gold)" }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--border-c)" }}>
                  <div style={{ fontFamily: "Poppins", fontSize: 26, fontWeight: 800, color: "var(--gold-dark)" }}>
                    {Number(s.price)}<span style={{ fontSize: 14, fontWeight: 400, color: "var(--text-muted)" }}> ₪</span>
                  </div>
                  <button
                    className="btn-primary !py-2.5 !px-5 !text-[12px]"
                    onClick={() => nav({ to: "/booking", search: { service: s.slug } as never })}
                  >
                    {tr("services.book")}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
