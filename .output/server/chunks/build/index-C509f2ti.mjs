import { J as jsxRuntimeExports } from "./server-D0hi5enF.mjs";
import { o as useI18n, L as Link, C as Crown, c as createLucideIcon, k as supabase } from "./router-DWRRqTVM.mjs";
import { u as useQuery } from "./useQuery-BM1s7Agb.mjs";
import { s as settingNumber } from "./useSiteSettings-BD_HlJZu.mjs";
import { S as Star } from "./star-DeX3AOFq.mjs";
import { S as ShieldCheck } from "./shield-check-BwvFbsia.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
const __iconNode$3 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M10.5 3 8 9l4 13 4-13-2.5-6", key: "b3dvk1" }],
  [
    "path",
    {
      d: "M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z",
      key: "7w4byz"
    }
  ],
  ["path", { d: "M2 9h20", key: "16fsjt" }]
];
const Gem = createLucideIcon("gem", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
      key: "nnexq3"
    }
  ],
  ["path", { d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12", key: "mt58a7" }]
];
const Leaf = createLucideIcon("leaf", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
function Home() {
  const {
    tr,
    lang
  } = useI18n();
  const {
    data: services
  } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data;
    }
  });
  const {
    data: stats
  } = useQuery({
    queryKey: ["home-stats"],
    queryFn: async () => {
      const [clientsRes, reviewsRes, settingsRes, servicesRes] = await Promise.all([supabase.from("profiles").select("id", {
        count: "exact",
        head: true
      }), supabase.from("reviews").select("rating").eq("published", true), supabase.from("site_settings").select("key, value").eq("key", "years_experience").maybeSingle(), supabase.from("services").select("id", {
        count: "exact",
        head: true
      }).eq("active", true)]);
      const clientCount = clientsRes.count ?? 0;
      const reviews = reviewsRes.data ?? [];
      const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;
      const yearsVal = settingsRes.data?.value;
      const years = typeof yearsVal === "number" ? yearsVal : settingNumber({
        years_experience: yearsVal
      }, "years_experience", 0);
      return {
        clientCount,
        avgRating,
        years,
        serviceCount: servicesRes.count ?? 0
      };
    }
  });
  const statItems = [stats?.clientCount ? {
    n: `${stats.clientCount}+`,
    k: "hero.clients"
  } : null, stats?.years ? {
    n: `${stats.years}+`,
    k: "hero.years"
  } : null, stats?.avgRating ? {
    n: `${stats.avgRating}★`,
    k: "hero.rating"
  } : null].filter(Boolean);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden px-[8%] py-16 md:py-24 min-h-[calc(100vh-68px)] flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-0", style: {
        backgroundImage: "linear-gradient(rgba(201,168,76,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.06) 1px,transparent 1px)",
        backgroundSize: "80px 80px"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute z-0 pointer-events-none", style: {
        top: "30%",
        insetInlineStart: "10%",
        width: 400,
        height: 400,
        background: "radial-gradient(circle, rgba(201,168,76,.12), transparent 70%)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-[640px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7 animate-fade-up", style: {
          background: "var(--surface-alt)",
          border: "1px solid var(--border-c)",
          fontFamily: "Poppins",
          fontSize: 11,
          fontWeight: 500,
          color: "var(--gold-dark)",
          letterSpacing: 1
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full animate-pulse-gold", style: {
            background: "var(--gold)"
          } }),
          tr("hero.badge")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-black leading-[1.15] mb-3 animate-fade-up", style: {
          fontFamily: "Cairo",
          fontSize: "clamp(36px,5vw,68px)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            fontFamily: "Poppins",
            fontSize: "clamp(13px,1.6vw,20px)",
            fontWeight: 300,
            letterSpacing: 4,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            display: "block",
            marginBottom: 8
          }, children: tr("hero.welcome") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gold-gradient-text block", children: tr("hero.brand") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "my-8 leading-[1.9] animate-fade-up", style: {
          fontSize: 15,
          color: "var(--text-muted)",
          maxWidth: 500
        }, children: tr("hero.desc") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3.5 animate-fade-up", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/booking", className: "btn-primary", children: [
            tr("nav.bookNow"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16, className: "flip-rtl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/services", className: "btn-outline", children: tr("hero.explore") })
        ] }),
        statItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-9 mt-12 animate-fade-up flex-wrap", children: statItems.map((s, i, arr) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-9", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              fontFamily: "Poppins",
              fontSize: 30,
              fontWeight: 700,
              color: "var(--gold)",
              lineHeight: 1
            }, children: s.n }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              fontSize: 11,
              color: "var(--text-muted)",
              marginTop: 4
            }, children: tr(s.k) })
          ] }),
          i < arr.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px self-stretch hidden sm:block", style: {
            background: "var(--border-c)"
          } })
        ] }, s.k)) })
      ] }),
      services && services.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:block absolute z-10", style: {
        insetInlineEnd: "6%",
        top: "50%",
        transform: "translateY(-50%)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-float p-7 backdrop-blur-xl", style: {
        width: 340,
        background: "rgba(255,255,255,.95)",
        border: "1px solid var(--border-c)",
        borderRadius: 32,
        boxShadow: "0 24px 60px rgba(201,168,76,.15)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { size: 64, className: "mx-auto mb-3", style: {
          color: "var(--gold)",
          filter: "drop-shadow(0 0 16px rgba(201,168,76,.25))"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mb-3.5", style: {
          fontFamily: "Poppins",
          fontSize: 11,
          fontWeight: 600,
          color: "var(--gold-dark)",
          letterSpacing: 2,
          textTransform: "uppercase"
        }, children: tr("hero.premium") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          services.slice(0, 3).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-2.5 rounded-[10px]", style: {
            background: "var(--surface-alt)",
            border: "1px solid var(--border-c)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              fontFamily: "Poppins",
              fontSize: 17,
              fontWeight: 700,
              color: "var(--gold-dark)"
            }, children: [
              Number(s.price),
              "₪"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              fontSize: 10,
              color: "var(--text-muted)"
            }, children: lang === "ar" ? s.name_ar : s.name_en })
          ] }, s.id)),
          stats?.avgRating && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-2.5 rounded-[10px]", style: {
            background: "var(--surface-alt)",
            border: "1px solid var(--border-c)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", style: {
              fontFamily: "Poppins",
              fontSize: 17,
              fontWeight: 700,
              color: "var(--gold-dark)"
            }, children: [
              stats.avgRating,
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 14, fill: "currentColor" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              fontSize: 10,
              color: "var(--text-muted)"
            }, children: tr("hero.rating") })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-[8%] py-16", style: {
      background: "var(--surface-alt)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [{
      I: Zap,
      k: "feat.fast"
    }, {
      I: Gem,
      k: "feat.quality"
    }, {
      I: ShieldCheck,
      k: "feat.guarantee"
    }, {
      I: Leaf,
      k: "feat.eco"
    }].map(({
      I,
      k
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(I, { size: 36, className: "mx-auto mb-3", style: {
        color: "var(--gold)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontSize: 14,
        fontWeight: 700,
        color: "var(--text)",
        marginBottom: 8
      }, children: tr(k) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontSize: 12,
        color: "var(--text-muted)",
        lineHeight: 1.7
      }, children: tr(`${k}.d`) })
    ] }, k)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-[8%] py-20 text-center", style: {
      background: "var(--background)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[560px] mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
        fontFamily: "Poppins",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--gold-dark)",
        letterSpacing: 3,
        textTransform: "uppercase"
      }, children: lang === "ar" ? "ابدأ اليوم" : "Get started today" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 mb-4 font-black", style: {
        fontFamily: "Cairo",
        fontSize: "clamp(26px,3.2vw,42px)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gold-gradient-text", children: tr("cta.heading") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-7", style: {
        fontSize: 14,
        color: "var(--text-muted)",
        lineHeight: 1.8
      }, children: tr("cta.sub") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/booking", className: "btn-primary !px-10 !py-4 !text-[15px]", children: [
        tr("nav.bookNow"),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16, className: "flip-rtl" })
      ] })
    ] }) })
  ] });
}
export {
  Home as component
};
