import { S as reactExports, J as jsxRuntimeExports } from "./server-D0hi5enF.mjs";
import { o as useI18n, u as useAuth, q as useNavigate, v as useQueryClient, R as Route$2, k as supabase, L as Link, c as createLucideIcon, m as toast } from "./router-DWRRqTVM.mjs";
import { u as useQuery } from "./useQuery-BM1s7Agb.mjs";
import { u as useSiteSettings, a as settingStringArray, s as settingNumber } from "./useSiteSettings-BD_HlJZu.mjs";
import { T as Trash2 } from "./trash-2-yiR9p_WP.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
const __iconNode$1 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$1);
const __iconNode = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode);
const MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS_AR = ["أح", "إث", "ثل", "أر", "خم", "جم", "سب"];
const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function fmtDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function BookingPage() {
  const {
    tr,
    lang
  } = useI18n();
  const {
    user
  } = useAuth();
  const nav = useNavigate();
  const qc = useQueryClient();
  const search = Route$2.useSearch();
  const [selService, setSelService] = reactExports.useState(null);
  const [selDate, setSelDate] = reactExports.useState(null);
  const [selTime, setSelTime] = reactExports.useState(null);
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [car, setCar] = reactExports.useState("");
  const [color, setColor] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [month, setMonth] = reactExports.useState(() => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(1);
    return d;
  });
  const [submitting, setSubmitting] = reactExports.useState(false);
  const {
    data: settings
  } = useSiteSettings();
  const hours = settingStringArray(settings, "business_hours");
  const slotCap = settingNumber(settings, "slot_capacity", 4);
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
    data: closedDays
  } = useQuery({
    queryKey: ["closed-days"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("closed_days").select("closed_date");
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.closed_date));
    }
  });
  const {
    data: slotCounts
  } = useQuery({
    queryKey: ["slot-counts", selDate],
    enabled: !!selDate,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.rpc("slot_counts", {
        _date: selDate
      });
      if (error) throw error;
      return Object.fromEntries((data ?? []).map((r) => [r.booking_time, Number(r.cnt)]));
    }
  });
  const {
    data: myBookings
  } = useQuery({
    queryKey: ["my-bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("bookings").select("*, services(name_ar, name_en, emoji)").order("booking_date", {
        ascending: false
      }).limit(10);
      if (error) throw error;
      return data;
    }
  });
  reactExports.useEffect(() => {
    if (!services?.length) return;
    if (search.service) {
      const s = services.find((x) => x.slug === search.service);
      if (s) {
        setSelService(s.id);
        return;
      }
    }
    if (!selService) setSelService(services[0].id);
  }, [services, search.service, selService]);
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle().then(({
      data
    }) => {
      if (data?.full_name && !name) setName(data.full_name);
      if (data?.phone && !phone) setPhone(data.phone);
    });
  }, [user]);
  const selectedSvc = services?.find((s) => s.id === selService);
  const calendar = reactExports.useMemo(() => {
    const y = month.getFullYear(), m = month.getMonth();
    const start = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < start; i++) cells.push(null);
    for (let i = 1; i <= days; i++) cells.push({
      d: i,
      ds: fmtDate(y, m, i)
    });
    return {
      cells,
      label: `${(lang === "ar" ? MONTHS_AR : MONTHS_EN)[m]} ${y}`
    };
  }, [month, lang]);
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  async function submit() {
    if (!user) {
      toast.error(tr("booking.loginRequired"));
      nav({
        to: "/login"
      });
      return;
    }
    if (!selectedSvc) {
      toast.error("Service");
      return;
    }
    if (!name.trim() || !phone.trim() || !car.trim()) {
      toast.warning(lang === "ar" ? "املأ جميع الحقول" : "Fill all fields");
      return;
    }
    if (!selDate || !selTime) {
      toast.warning(lang === "ar" ? "اختر التاريخ والوقت" : "Pick date and time");
      return;
    }
    setSubmitting(true);
    try {
      const {
        error
      } = await supabase.from("bookings").insert({
        user_id: user.id,
        service_id: selectedSvc.id,
        name,
        phone,
        car,
        color: color || null,
        price: Number(selectedSvc.price),
        booking_date: selDate,
        booking_time: selTime,
        notes: notes || null
      });
      if (error) throw error;
      toast.success(tr("booking.success"));
      setSelDate(null);
      setSelTime(null);
      setCar("");
      setColor("");
      setNotes("");
      qc.invalidateQueries({
        queryKey: ["my-bookings"]
      });
      qc.invalidateQueries({
        queryKey: ["slot-counts"]
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setSubmitting(false);
    }
  }
  async function cancelBooking(id) {
    const {
      error
    } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(tr("booking.cancelled"));
    qc.invalidateQueries({
      queryKey: ["my-bookings"]
    });
    qc.invalidateQueries({
      queryKey: ["slot-counts"]
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-[5%] md:px-[8%] py-16", style: {
    background: "var(--background)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
        fontFamily: "Poppins",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--gold-dark)",
        letterSpacing: 3,
        textTransform: "uppercase"
      }, children: tr("booking.label") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 font-black", style: {
        fontFamily: "Cairo",
        fontSize: "clamp(26px,3.2vw,42px)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gold-gradient-text", children: tr("booking.heading") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2", style: {
        fontSize: 14,
        color: "var(--text-muted)"
      }, children: tr("booking.sub") })
    ] }),
    !user && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-6 mb-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3", style: {
        color: "var(--text-light)"
      }, children: tr("booking.loginRequired") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "btn-primary", children: tr("nav.login") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[1.1fr_.9fr] gap-6 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-7", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: 19,
          fontWeight: 700,
          color: "var(--gold-dark)"
        }, children: tr("booking.details") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 mb-2 text-xs", style: {
          color: "var(--text-muted)"
        }, children: tr("booking.selectService") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: services?.map((s) => {
          const sel = selService === s.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSelService(s.id), className: "flex justify-between items-center text-start rounded-[11px] px-4 py-3 transition-colors", style: {
            border: sel ? "1.5px solid var(--gold)" : "1.5px solid rgba(201,168,76,.12)",
            background: sel ? "var(--surface-alt)" : "var(--surface)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                fontSize: 13,
                fontWeight: 600
              }, children: [
                s.emoji,
                " ",
                lang === "ar" ? s.name_ar : s.name_en
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                fontFamily: "Poppins",
                fontSize: 10,
                color: "var(--text-muted)"
              }, children: lang === "ar" ? s.name_en : s.name_ar })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              fontFamily: "Poppins",
              fontWeight: 700,
              color: "var(--gold)"
            }, children: [
              Number(s.price),
              " ₪"
            ] })
          ] }, s.id);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3 mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "form-input", placeholder: tr("booking.fullName"), value: name, onChange: (e) => setName(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "form-input", placeholder: tr("booking.phone"), value: phone, onChange: (e) => setPhone(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "form-input", placeholder: tr("booking.carType"), value: car, onChange: (e) => setCar(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "form-input", placeholder: tr("booking.color"), value: color, onChange: (e) => setColor(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-[16px] p-4", style: {
          background: "var(--surface-alt)",
          border: "1px solid var(--border-c)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1)), className: "p-2 rounded", style: {
              color: "var(--gold-dark)"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "flip-rtl", size: 18 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              fontFamily: "Poppins",
              fontWeight: 600,
              color: "var(--gold-dark)"
            }, children: calendar.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1)), className: "p-2 rounded", style: {
              color: "var(--gold-dark)"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "flip-rtl", size: 18 }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-1.5 text-center", children: [
            (lang === "ar" ? DAYS_AR : DAYS_EN).map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              fontFamily: "Poppins",
              fontSize: 11,
              color: "var(--text-muted)",
              padding: 4
            }, children: d }, d)),
            calendar.cells.map((c, i) => {
              if (!c) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}, i);
              const dObj = new Date(c.ds);
              const past = dObj < today;
              const closed = closedDays?.has(c.ds);
              const sel = selDate === c.ds;
              const disabled = past || closed;
              return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled, onClick: () => {
                setSelDate(c.ds);
                setSelTime(null);
              }, className: "aspect-square rounded-[8px] text-sm font-medium transition-colors", style: {
                fontFamily: "Poppins",
                background: sel ? "var(--gold)" : closed ? "rgba(204,68,68,.08)" : "var(--surface)",
                color: sel ? "#fff" : closed ? "#DD6060" : past ? "rgba(122,110,88,.35)" : "var(--text)",
                border: sel ? "1px solid var(--gold)" : "1px solid var(--border-c)",
                cursor: disabled ? "not-allowed" : "pointer"
              }, children: c.d }, i);
            })
          ] })
        ] }),
        selDate && hours.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-xs", style: {
            color: "var(--text-muted)"
          }, children: tr("booking.selectTime") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-2", children: hours.map((h) => {
            const cnt = slotCounts?.[h] ?? 0;
            const avail = slotCap - cnt;
            const full = avail <= 0;
            const sel = selTime === h;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: full, onClick: () => setSelTime(h), className: "rounded-[10px] py-2 px-2 text-center transition-colors", style: {
              background: sel ? "var(--gold)" : "var(--surface)",
              color: sel ? "#fff" : full ? "#9A8A70" : "var(--text)",
              border: sel ? "1.5px solid var(--gold)" : "1.5px solid var(--border-c)",
              cursor: full ? "not-allowed" : "pointer"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                fontFamily: "Poppins",
                fontSize: 12,
                fontWeight: 600
              }, children: h }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                fontSize: 10,
                marginTop: 2,
                opacity: 0.8
              }, children: full ? tr("booking.full") : `${avail} ${tr("booking.available")}` })
            ] }, h);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "form-input mt-5", placeholder: tr("booking.notes"), value: notes, onChange: (e) => setNotes(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-primary w-full justify-center mt-4 !py-4", onClick: submit, disabled: submitting || !user, children: [
          "✦ ",
          tr("booking.confirm")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-surface p-7 lg:sticky lg:top-[82px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: 17,
          fontWeight: 700,
          color: "var(--gold-dark)"
        }, children: tr("booking.yours") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-col gap-2.5 max-h-[600px] overflow-y-auto", children: [
          !user && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-10", style: {
            color: "var(--text-muted)"
          }, children: tr("booking.loginRequired") }),
          user && (!myBookings || myBookings.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-10", style: {
            color: "var(--text-muted)"
          }, children: [
            "📋",
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm", children: tr("booking.empty") })
          ] }),
          myBookings?.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[16px] p-4 relative overflow-hidden", style: {
            background: "var(--surface-alt)",
            border: "1px solid var(--border-c)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 inset-inline-end-0 w-[3px] h-full", style: {
              background: "linear-gradient(to bottom,var(--gold),var(--gold-dark))",
              insetInlineEnd: 0
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                fontSize: 14,
                fontWeight: 700
              }, children: b.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                fontFamily: "Poppins",
                fontSize: 10,
                background: "rgba(201,168,76,.12)",
                color: "var(--gold-light)",
                padding: "2px 9px",
                borderRadius: 20
              }, children: lang === "ar" ? b.services?.name_ar : b.services?.name_en })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-wrap text-xs", style: {
              color: "var(--text-muted)"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "📅 ",
                b.booking_date
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "🕒 ",
                b.booking_time
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "🚗 ",
                b.car
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
                color: "var(--gold)"
              }, children: [
                Number(b.price),
                " ₪"
              ] })
            ] }),
            b.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => cancelBooking(b.id), className: "mt-2 inline-flex items-center gap-1 text-xs", style: {
              color: "#DD6060"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 }),
              " ",
              tr("booking.cancel")
            ] })
          ] }, b.id))
        ] })
      ] })
    ] })
  ] });
}
export {
  BookingPage as component
};
