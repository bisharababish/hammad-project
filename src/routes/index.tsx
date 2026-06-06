import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Crown, Zap, Gem, ShieldCheck, Leaf, ArrowRight, Star } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { settingNumber } from "@/hooks/useSiteSettings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مغسلة البرنس | Al-Prince Car Wash" },
      { name: "description", content: "Premium car wash and detailing in your city. Book in under a minute." },
    ],
  }),
  component: Home,
});

function Home() {
  const { tr, lang } = useI18n();

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["home-stats"],
    queryFn: async () => {
      const [clientsRes, reviewsRes, settingsRes, servicesRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("rating").eq("published", true),
        supabase.from("site_settings").select("key, value").eq("key", "years_experience").maybeSingle(),
        supabase.from("services").select("id", { count: "exact", head: true }).eq("active", true),
      ]);
      const clientCount = clientsRes.count ?? 0;
      const reviews = reviewsRes.data ?? [];
      const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : null;
      const yearsVal = settingsRes.data?.value;
      const years = typeof yearsVal === "number" ? yearsVal : settingNumber({ years_experience: yearsVal }, "years_experience", 0);
      return { clientCount, avgRating, years, serviceCount: servicesRes.count ?? 0 };
    },
  });

  const statItems = [
    stats?.clientCount ? { n: `${stats.clientCount}+`, k: "hero.clients" } : null,
    stats?.years ? { n: `${stats.years}+`, k: "hero.years" } : null,
    stats?.avgRating ? { n: `${stats.avgRating}★`, k: "hero.rating" } : null,
  ].filter(Boolean) as { n: string; k: string }[];

  return (
    <>
      <section className="relative overflow-hidden px-[8%] py-16 md:py-24 min-h-[calc(100vh-68px)] flex items-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,168,76,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.06) 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div
          className="absolute z-0 pointer-events-none"
          style={{
            top: "30%",
            insetInlineStart: "10%",
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(201,168,76,.12), transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-[640px]">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7 animate-fade-up"
            style={{
              background: "var(--surface-alt)",
              border: "1px solid var(--border-c)",
              fontFamily: "Poppins",
              fontSize: 11,
              fontWeight: 500,
              color: "var(--gold-dark)",
              letterSpacing: 1,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-gold" style={{ background: "var(--gold)" }} />
            {tr("hero.badge")}
          </div>

          <h1
            className="font-black leading-[1.15] mb-3 animate-fade-up"
            style={{ fontFamily: "Cairo", fontSize: "clamp(36px,5vw,68px)" }}
          >
            <span style={{ fontFamily: "Poppins", fontSize: "clamp(13px,1.6vw,20px)", fontWeight: 300, letterSpacing: 4, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              {tr("hero.welcome")}
            </span>
            <span className="gold-gradient-text block">{tr("hero.brand")}</span>
          </h1>

          <p className="my-8 leading-[1.9] animate-fade-up" style={{ fontSize: 15, color: "var(--text-muted)", maxWidth: 500 }}>
            {tr("hero.desc")}
          </p>

          <div className="flex flex-wrap gap-3.5 animate-fade-up">
            <Link to="/booking" className="btn-primary">
              {tr("nav.bookNow")} <ArrowRight size={16} className="flip-rtl" />
            </Link>
            <Link to="/services" className="btn-outline">{tr("hero.explore")}</Link>
          </div>

          {statItems.length > 0 && (
            <div className="flex gap-9 mt-12 animate-fade-up flex-wrap">
              {statItems.map((s, i, arr) => (
                <div key={s.k} className="flex items-center gap-9">
                  <div className="text-center">
                    <div style={{ fontFamily: "Poppins", fontSize: 30, fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>{s.n}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{tr(s.k)}</div>
                  </div>
                  {i < arr.length - 1 && <div className="w-px self-stretch hidden sm:block" style={{ background: "var(--border-c)" }} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {services && services.length > 0 && (
          <div className="hidden lg:block absolute z-10" style={{ insetInlineEnd: "6%", top: "50%", transform: "translateY(-50%)" }}>
            <div
              className="animate-float p-7 backdrop-blur-xl"
              style={{
                width: 340,
                background: "rgba(255,255,255,.95)",
                border: "1px solid var(--border-c)",
                borderRadius: 32,
                boxShadow: "0 24px 60px rgba(201,168,76,.15)",
              }}
            >
              <Crown size={64} className="mx-auto mb-3" style={{ color: "var(--gold)", filter: "drop-shadow(0 0 16px rgba(201,168,76,.25))" }} />
              <div className="text-center mb-3.5" style={{ fontFamily: "Poppins", fontSize: 11, fontWeight: 600, color: "var(--gold-dark)", letterSpacing: 2, textTransform: "uppercase" }}>
                {tr("hero.premium")}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {services.slice(0, 3).map((s) => (
                  <div key={s.id} className="text-center p-2.5 rounded-[10px]" style={{ background: "var(--surface-alt)", border: "1px solid var(--border-c)" }}>
                    <div style={{ fontFamily: "Poppins", fontSize: 17, fontWeight: 700, color: "var(--gold-dark)" }}>{Number(s.price)}₪</div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{lang === "ar" ? s.name_ar : s.name_en}</div>
                  </div>
                ))}
                {stats?.avgRating && (
                  <div className="text-center p-2.5 rounded-[10px]" style={{ background: "var(--surface-alt)", border: "1px solid var(--border-c)" }}>
                    <div className="flex items-center justify-center gap-1" style={{ fontFamily: "Poppins", fontSize: 17, fontWeight: 700, color: "var(--gold-dark)" }}>
                      {stats.avgRating}<Star size={14} fill="currentColor" />
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{tr("hero.rating")}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="px-[8%] py-16" style={{ background: "var(--surface-alt)" }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { I: Zap, k: "feat.fast" },
            { I: Gem, k: "feat.quality" },
            { I: ShieldCheck, k: "feat.guarantee" },
            { I: Leaf, k: "feat.eco" },
          ].map(({ I, k }) => (
            <div key={k} className="card-surface p-6 text-center">
              <I size={36} className="mx-auto mb-3" style={{ color: "var(--gold)" }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{tr(k)}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>{tr(`${k}.d`)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-[8%] py-20 text-center" style={{ background: "var(--background)" }}>
        <div className="max-w-[560px] mx-auto">
          <span style={{ fontFamily: "Poppins", fontSize: 11, fontWeight: 600, color: "var(--gold-dark)", letterSpacing: 3, textTransform: "uppercase" }}>
            {lang === "ar" ? "ابدأ اليوم" : "Get started today"}
          </span>
          <h2 className="mt-3 mb-4 font-black" style={{ fontFamily: "Cairo", fontSize: "clamp(26px,3.2vw,42px)" }}>
            <span className="gold-gradient-text">{tr("cta.heading")}</span>
          </h2>
          <p className="mb-7" style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8 }}>{tr("cta.sub")}</p>
          <Link to="/booking" className="btn-primary !px-10 !py-4 !text-[15px]">
            {tr("nav.bookNow")} <ArrowRight size={16} className="flip-rtl" />
          </Link>
        </div>
      </section>
    </>
  );
}
