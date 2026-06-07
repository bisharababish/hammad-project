import { S as reactExports, J as jsxRuntimeExports } from "./server-CWnAiUxG.mjs";
import { o as useI18n, u as useAuth, v as useQueryClient, L as Link, k as supabase, m as toast } from "./router-CYHpOlYa.mjs";
import { u as useQuery } from "./useQuery-DAZfHufn.mjs";
import { S as ShieldCheck } from "./shield-check-BjsJBYRf.mjs";
import { T as Trash2 } from "./trash-2-DWn1vY3C.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
function AdminPage() {
  const {
    tr,
    lang
  } = useI18n();
  const {
    user,
    isAdmin,
    loading
  } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = reactExports.useState("bookings");
  const [newClosed, setNewClosed] = reactExports.useState("");
  const {
    data: bookings
  } = useQuery({
    queryKey: ["admin-bookings"],
    enabled: isAdmin,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("bookings").select("*, services(name_ar, name_en, emoji)").order("booking_date", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const {
    data: services
  } = useQuery({
    queryKey: ["admin-services"],
    enabled: isAdmin,
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
    data: closed
  } = useQuery({
    queryKey: ["admin-closed"],
    enabled: isAdmin,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("closed_days").select("*").order("closed_date");
      if (error) throw error;
      return data;
    }
  });
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center", style: {
    color: "var(--text-muted)"
  }, children: tr("common.loading") });
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-16 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
      color: "var(--text-light)"
    }, className: "mb-4", children: tr("nav.login") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "btn-primary", children: tr("nav.login") })
  ] });
  if (!isAdmin) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-16 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 48, className: "mx-auto mb-3", style: {
      color: "var(--gold-dark)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
      color: "var(--text-light)"
    }, children: tr("admin.notAdmin") })
  ] });
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const todayCount = bookings?.filter((b) => b.booking_date === today).length ?? 0;
  const revenue = bookings?.filter((b) => b.status !== "cancelled").reduce((s, b) => s + Number(b.price), 0) ?? 0;
  async function setStatus(id, status) {
    const {
      error
    } = await supabase.from("bookings").update({
      status
    }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({
      queryKey: ["admin-bookings"]
    });
  }
  async function delBooking(id) {
    if (!confirm(lang === "ar" ? "حذف الحجز؟" : "Delete booking?")) return;
    const {
      error
    } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({
      queryKey: ["admin-bookings"]
    });
  }
  async function addClosed() {
    if (!newClosed) return;
    const {
      error
    } = await supabase.from("closed_days").insert({
      closed_date: newClosed
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setNewClosed("");
    qc.invalidateQueries({
      queryKey: ["admin-closed"]
    });
  }
  async function delClosed(id) {
    const {
      error
    } = await supabase.from("closed_days").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({
      queryKey: ["admin-closed"]
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-[5%] md:px-[8%] py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between flex-wrap gap-3 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-black", style: {
        fontFamily: "Cairo",
        fontSize: 28,
        color: "var(--gold)"
      }, children: tr("admin.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontFamily: "Poppins",
        fontSize: 11,
        color: "var(--text-muted)"
      }, children: user.email })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-6", children: [{
      l: tr("admin.totalBookings"),
      v: bookings?.length ?? 0
    }, {
      l: tr("admin.todayBookings"),
      v: todayCount
    }, {
      l: tr("admin.revenue"),
      v: `${revenue} ₪`
    }, {
      l: tr("admin.services"),
      v: services?.length ?? 0
    }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontSize: 11,
        color: "var(--text-muted)",
        fontFamily: "Poppins",
        letterSpacing: 1,
        textTransform: "uppercase"
      }, children: s.l }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5", style: {
        fontFamily: "Poppins",
        fontSize: 26,
        fontWeight: 800,
        color: "var(--gold)"
      }, children: s.v })
    ] }, s.l)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-4 flex-wrap", children: [["bookings", tr("admin.bookings")], ["services", tr("admin.services")], ["closed", tr("admin.closedDays")]].map(([k, l]) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(k), className: "px-4 py-2 rounded-[10px]", style: {
      fontFamily: "Poppins",
      fontSize: 13,
      fontWeight: 600,
      background: tab === k ? "var(--gold)" : "transparent",
      color: tab === k ? "#fff" : "var(--text-muted)",
      border: "1px solid var(--border-c)"
    }, children: l }, k)) }),
    tab === "bookings" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-surface p-5 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: {
        color: "var(--text-muted)",
        fontSize: 11,
        textAlign: "start",
        fontFamily: "Poppins"
      }, children: [tr("common.customer"), tr("common.service"), tr("common.date"), tr("common.time"), tr("common.price"), tr("common.status"), ""].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start py-2 px-2 font-medium", children: h }, h)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: bookings?.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: {
        borderTop: "1px solid var(--border-c)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 px-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            fontWeight: 600
          }, children: b.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            fontSize: 11,
            color: "var(--text-muted)"
          }, children: [
            b.phone,
            " • ",
            b.car
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2", children: lang === "ar" ? b.services?.name_ar : b.services?.name_en }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2", children: b.booking_date }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2", children: b.booking_time }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-2", style: {
          color: "var(--gold)"
        }, children: [
          Number(b.price),
          " ₪"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: b.status, onChange: (e) => setStatus(b.id, e.target.value), className: "form-input !py-1 !px-2 !text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: tr("admin.pending") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "confirmed", children: tr("admin.confirmed") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "completed", children: tr("admin.completed") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cancelled", children: tr("admin.cancelled") })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => delBooking(b.id), style: {
          color: "#DD6060"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }) }) })
      ] }, b.id)) })
    ] }) }),
    tab === "services" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-surface p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-3", children: services?.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-[14px]", style: {
      background: "rgba(255,255,255,.02)",
      border: "1px solid var(--border-c)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl mb-2", children: s.emoji }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontWeight: 700
      }, children: s.name_ar }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontSize: 12,
        color: "var(--text-muted)"
      }, children: s.name_en }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", style: {
        color: "var(--gold)",
        fontFamily: "Poppins",
        fontWeight: 700
      }, children: [
        Number(s.price),
        " ₪"
      ] })
    ] }, s.id)) }) }),
    tab === "closed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-4 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", className: "form-input", style: {
          width: 200,
          direction: "ltr"
        }, value: newClosed, onChange: (e) => setNewClosed(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", onClick: addClosed, children: tr("admin.addClosed") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: closed?.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1.5 rounded-[10px] flex items-center gap-2", style: {
        background: "rgba(204,68,68,.12)",
        border: "1px solid rgba(204,68,68,.3)",
        color: "#DD6060",
        fontFamily: "Poppins",
        fontSize: 12
      }, children: [
        c.closed_date,
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => delClosed(c.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 }) })
      ] }, c.id)) })
    ] })
  ] });
}
export {
  AdminPage as component
};
