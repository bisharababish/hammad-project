import { J as jsxRuntimeExports } from "./server-BMK628Pq.mjs";
import { u as useQuery } from "./useQuery-Bpq8_YCx.mjs";
import { o as useI18n, k as supabase } from "./router-CAv_LuLj.mjs";
import { S as Star } from "./star-GH3WhEph.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
function ReviewsPage() {
  const {
    tr,
    lang
  } = useI18n();
  const {
    data: reviews,
    isLoading
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("reviews").select("*").eq("published", true).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-[8%] py-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
        fontFamily: "Poppins",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--gold-dark)",
        letterSpacing: 3,
        textTransform: "uppercase"
      }, children: tr("reviews.label") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-black", style: {
        fontFamily: "Cairo",
        fontSize: "clamp(26px,3.2vw,42px)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gold-gradient-text", children: tr("reviews.heading") }) })
    ] }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center", style: {
      color: "var(--text-muted)"
    }, children: tr("common.loading") }),
    !isLoading && (!reviews || reviews.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center card-surface p-10 max-w-lg mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
      color: "var(--text-muted)",
      fontSize: 14
    }, children: tr("reviews.empty") }) }),
    reviews && reviews.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto", children: reviews.map((r) => {
      const text = lang === "ar" ? r.review_text_ar : r.review_text_en;
      const initial = r.customer_name?.charAt(0) ?? "?";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "card-surface p-7", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mb-3", style: {
          color: "var(--gold)"
        }, children: [...Array(5)].map((_, k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 14, fill: k < r.rating ? "currentColor" : "none" }, k)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "italic mb-5", style: {
          fontSize: 13,
          color: "var(--text-light)",
          lineHeight: 1.8
        }, children: [
          '"',
          text,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center font-bold", style: {
            background: "linear-gradient(135deg,var(--gold-light),var(--gold))",
            color: "#fff"
          }, children: initial }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              fontSize: 13,
              fontWeight: 700,
              color: "var(--text)"
            }, children: r.customer_name }),
            r.car_info && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              fontFamily: "Poppins",
              fontSize: 11,
              color: "var(--text-muted)"
            }, children: r.car_info })
          ] })
        ] })
      ] }, r.id);
    }) })
  ] });
}
export {
  ReviewsPage as component
};
