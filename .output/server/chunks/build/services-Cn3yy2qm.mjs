import { J as jsxRuntimeExports } from "./server-CWnAiUxG.mjs";
import { o as useI18n, q as useNavigate, c as createLucideIcon, k as supabase } from "./router-CYHpOlYa.mjs";
import { u as useQuery } from "./useQuery-DAZfHufn.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
const __iconNode = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode);
function parseFeatures(raw, lang) {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x) => typeof x === "string");
}
function ServicesPage() {
  const {
    tr,
    lang
  } = useI18n();
  const nav = useNavigate();
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-[8%] py-20", style: {
    background: "var(--surface-alt)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-12 text-center max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
        fontFamily: "Poppins",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--gold-dark)",
        letterSpacing: 3,
        textTransform: "uppercase"
      }, children: tr("services.label") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 mb-4 font-black", style: {
        fontFamily: "Cairo",
        fontSize: "clamp(26px,3.2vw,42px)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gold-gradient-text", children: tr("services.heading") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
        fontSize: 14,
        color: "var(--text-muted)"
      }, children: tr("services.sub") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto", children: services?.map((s) => {
      const popular = s.slug === "full";
      const features = parseFeatures(lang === "ar" ? s.features_ar : s.features_en);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "card-surface overflow-hidden flex flex-col", style: popular ? {
        borderColor: "rgba(201,168,76,.45)"
      } : void 0, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-44 flex items-center justify-center relative", style: {
          background: popular ? "linear-gradient(135deg,#FFF0D6,#FFFBF5)" : s.slug === "pro" ? "linear-gradient(135deg,#FFF6E8,#FFFBF5)" : "linear-gradient(135deg,#FFF9EE,#FFFBF5)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            fontSize: 62
          }, children: s.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3.5 px-2.5 py-0.5 rounded-full", style: {
            insetInlineStart: 14,
            background: "var(--surface-alt)",
            border: "1px solid var(--border-hover)",
            color: "var(--gold-dark)",
            fontFamily: "Poppins",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 1.5
          }, children: popular ? tr("services.popular") : s.slug === "pro" ? "PREMIUM" : "BASIC" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 flex flex-col gap-3 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              fontSize: 20,
              fontWeight: 700,
              color: "var(--text)"
            }, children: lang === "ar" ? s.name_ar : s.name_en }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              fontFamily: "Poppins",
              fontSize: 10,
              color: "var(--gold-dark)",
              letterSpacing: 1,
              textTransform: "uppercase"
            }, children: lang === "ar" ? s.name_en : s.name_ar })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
            fontSize: 13,
            color: "var(--text-muted)",
            lineHeight: 1.7
          }, children: lang === "ar" ? s.description_ar : s.description_en }),
          features.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-2 my-2 flex-1", children: features.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", style: {
            fontSize: 13,
            color: "var(--text-light)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14, style: {
              color: "var(--gold)"
            } }),
            f
          ] }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-4 border-t", style: {
            borderColor: "var(--border-c)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              fontFamily: "Poppins",
              fontSize: 26,
              fontWeight: 800,
              color: "var(--gold-dark)"
            }, children: [
              Number(s.price),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
                fontSize: 14,
                fontWeight: 400,
                color: "var(--text-muted)"
              }, children: [
                " ",
                "₪"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary !py-2.5 !px-5 !text-[12px]", onClick: () => nav({
              to: "/booking",
              search: {
                service: s.slug
              }
            }), children: tr("services.book") })
          ] })
        ] })
      ] }, s.id);
    }) })
  ] });
}
export {
  ServicesPage as component
};
