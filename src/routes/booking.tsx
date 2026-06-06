import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { settingNumber, settingStringArray, useSiteSettings } from "@/hooks/useSiteSettings";

type SearchParams = { service?: string };

export const Route = createFileRoute("/booking")({
  head: () => ({ meta: [{ title: "Book — Al-Prince" }] }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({ service: typeof s.service === "string" ? s.service : undefined }),
  component: BookingPage,
});

const MONTHS_AR = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_AR = ["أح","إث","ثل","أر","خم","جم","سب"];
const DAYS_EN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function fmtDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function BookingPage() {
  const { tr, lang } = useI18n();
  const { user } = useAuth();
  const nav = useNavigate();
  const qc = useQueryClient();
  const search = Route.useSearch();

  const [selService, setSelService] = useState<string | null>(null);
  const [selDate, setSelDate] = useState<string | null>(null);
  const [selTime, setSelTime] = useState<string | null>(null);
  const [name, setName] = useState(""); const [phone, setPhone] = useState("");
  const [car, setCar] = useState(""); const [color, setColor] = useState(""); const [notes, setNotes] = useState("");
  const [month, setMonth] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [submitting, setSubmitting] = useState(false);

  const { data: settings } = useSiteSettings();
  const hours = settingStringArray(settings, "business_hours");
  const slotCap = settingNumber(settings, "slot_capacity", 4);

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: closedDays } = useQuery({
    queryKey: ["closed-days"],
    queryFn: async () => {
      const { data, error } = await supabase.from("closed_days").select("closed_date");
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.closed_date));
    },
  });

  const { data: slotCounts } = useQuery({
    queryKey: ["slot-counts", selDate],
    enabled: !!selDate,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("slot_counts", { _date: selDate });
      if (error) throw error;
      return Object.fromEntries((data ?? []).map((r) => [r.booking_time, Number(r.cnt)]));
    },
  });

  const { data: myBookings } = useQuery({
    queryKey: ["my-bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, services(name_ar, name_en, emoji)")
        .order("booking_date", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  // Initialize selected service
  useEffect(() => {
    if (!services?.length) return;
    if (search.service) {
      const s = services.find((x) => x.slug === search.service);
      if (s) { setSelService(s.id); return; }
    }
    if (!selService) setSelService(services[0].id);
  }, [services, search.service, selService]);

  // Prefill name/phone from profile
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data?.full_name && !name) setName(data.full_name);
      if (data?.phone && !phone) setPhone(data.phone);
    });
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedSvc = services?.find((s) => s.id === selService);

  const calendar = useMemo(() => {
    const y = month.getFullYear(), m = month.getMonth();
    const start = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const cells: ({ d: number; ds: string } | null)[] = [];
    for (let i = 0; i < start; i++) cells.push(null);
    for (let i = 1; i <= days; i++) cells.push({ d: i, ds: fmtDate(y, m, i) });
    return { cells, label: `${(lang === "ar" ? MONTHS_AR : MONTHS_EN)[m]} ${y}` };
  }, [month, lang]);

  const today = new Date(); today.setHours(0, 0, 0, 0);

  async function submit() {
    if (!user) { toast.error(tr("booking.loginRequired")); nav({ to: "/login" }); return; }
    if (!selectedSvc) { toast.error("Service"); return; }
    if (!name.trim() || !phone.trim() || !car.trim()) { toast.warning(lang === "ar" ? "املأ جميع الحقول" : "Fill all fields"); return; }
    if (!selDate || !selTime) { toast.warning(lang === "ar" ? "اختر التاريخ والوقت" : "Pick date and time"); return; }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id, service_id: selectedSvc.id, name, phone, car,
        color: color || null, price: Number(selectedSvc.price),
        booking_date: selDate, booking_time: selTime, notes: notes || null,
      });
      if (error) throw error;
      toast.success(tr("booking.success"));
      setSelDate(null); setSelTime(null); setCar(""); setColor(""); setNotes("");
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
      qc.invalidateQueries({ queryKey: ["slot-counts"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally { setSubmitting(false); }
  }

  async function cancelBooking(id: string) {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(tr("booking.cancelled"));
    qc.invalidateQueries({ queryKey: ["my-bookings"] });
    qc.invalidateQueries({ queryKey: ["slot-counts"] });
  }

  return (
    <section className="px-[5%] md:px-[8%] py-16" style={{ background: "var(--background)" }}>
      <div className="mb-10">
        <span style={{ fontFamily: "Poppins", fontSize: 11, fontWeight: 600, color: "var(--gold-dark)", letterSpacing: 3, textTransform: "uppercase" }}>{tr("booking.label")}</span>
        <h2 className="mt-2 font-black" style={{ fontFamily: "Cairo", fontSize: "clamp(26px,3.2vw,42px)" }}>
          <span className="gold-gradient-text">{tr("booking.heading")}</span>
        </h2>
        <p className="mt-2" style={{ fontSize: 14, color: "var(--text-muted)" }}>{tr("booking.sub")}</p>
      </div>

      {!user && (
        <div className="card-surface p-6 mb-6 text-center">
          <p className="mb-3" style={{ color: "var(--text-light)" }}>{tr("booking.loginRequired")}</p>
          <Link to="/login" className="btn-primary">{tr("nav.login")}</Link>
        </div>
      )}

      <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-6 items-start">
        {/* FORM */}
        <div className="card-surface p-7">
          <div style={{ fontSize: 19, fontWeight: 700, color: "var(--gold-dark)" }}>{tr("booking.details")}</div>

          {/* Service picker */}
          <div className="mt-4 mb-2 text-xs" style={{ color: "var(--text-muted)" }}>{tr("booking.selectService")}</div>
          <div className="flex flex-col gap-2">
            {services?.map((s) => {
              const sel = selService === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelService(s.id)}
                  className="flex justify-between items-center text-start rounded-[11px] px-4 py-3 transition-colors"
                  style={{
                    border: sel ? "1.5px solid var(--gold)" : "1.5px solid rgba(201,168,76,.12)",
                    background: sel ? "var(--surface-alt)" : "var(--surface)",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.emoji} {lang === "ar" ? s.name_ar : s.name_en}</div>
                    <div style={{ fontFamily: "Poppins", fontSize: 10, color: "var(--text-muted)" }}>{lang === "ar" ? s.name_en : s.name_ar}</div>
                  </div>
                  <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--gold)" }}>{Number(s.price)} ₪</div>
                </button>
              );
            })}
          </div>

          {/* Inputs */}
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            <input className="form-input" placeholder={tr("booking.fullName")} value={name} onChange={(e) => setName(e.target.value)} />
            <input className="form-input" placeholder={tr("booking.phone")} value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className="form-input" placeholder={tr("booking.carType")} value={car} onChange={(e) => setCar(e.target.value)} />
            <input className="form-input" placeholder={tr("booking.color")} value={color} onChange={(e) => setColor(e.target.value)} />
          </div>

          {/* Calendar */}
          <div className="mt-6 rounded-[16px] p-4" style={{ background: "var(--surface-alt)", border: "1px solid var(--border-c)" }}>
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="p-2 rounded" style={{ color: "var(--gold-dark)" }}><ChevronRight className="flip-rtl" size={18} /></button>
              <div style={{ fontFamily: "Poppins", fontWeight: 600, color: "var(--gold-dark)" }}>{calendar.label}</div>
              <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="p-2 rounded" style={{ color: "var(--gold-dark)" }}><ChevronLeft className="flip-rtl" size={18} /></button>
            </div>
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {(lang === "ar" ? DAYS_AR : DAYS_EN).map((d) => (
                <div key={d} style={{ fontFamily: "Poppins", fontSize: 11, color: "var(--text-muted)", padding: 4 }}>{d}</div>
              ))}
              {calendar.cells.map((c, i) => {
                if (!c) return <div key={i} />;
                const dObj = new Date(c.ds);
                const past = dObj < today;
                const closed = closedDays?.has(c.ds);
                const sel = selDate === c.ds;
                const disabled = past || closed;
                return (
                  <button
                    key={i}
                    disabled={disabled}
                    onClick={() => { setSelDate(c.ds); setSelTime(null); }}
                    className="aspect-square rounded-[8px] text-sm font-medium transition-colors"
                    style={{
                      fontFamily: "Poppins",
                      background: sel ? "var(--gold)" : closed ? "rgba(204,68,68,.08)" : "var(--surface)",
                      color: sel ? "#fff" : closed ? "#DD6060" : past ? "rgba(122,110,88,.35)" : "var(--text)",
                      border: sel ? "1px solid var(--gold)" : "1px solid var(--border-c)",
                      cursor: disabled ? "not-allowed" : "pointer",
                    }}
                  >
                    {c.d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slots */}
          {selDate && hours.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-xs" style={{ color: "var(--text-muted)" }}>{tr("booking.selectTime")}</div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {hours.map((h) => {
                  const cnt = slotCounts?.[h] ?? 0;
                  const avail = slotCap - cnt;
                  const full = avail <= 0;
                  const sel = selTime === h;
                  return (
                    <button
                      key={h} disabled={full}
                      onClick={() => setSelTime(h)}
                      className="rounded-[10px] py-2 px-2 text-center transition-colors"
                      style={{
                        background: sel ? "var(--gold)" : "var(--surface)",
                        color: sel ? "#fff" : full ? "#9A8A70" : "var(--text)",
                        border: sel ? "1.5px solid var(--gold)" : "1.5px solid var(--border-c)",
                        cursor: full ? "not-allowed" : "pointer",
                      }}
                    >
                      <div style={{ fontFamily: "Poppins", fontSize: 12, fontWeight: 600 }}>{h}</div>
                      <div style={{ fontSize: 10, marginTop: 2, opacity: .8 }}>{full ? tr("booking.full") : `${avail} ${tr("booking.available")}`}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <input className="form-input mt-5" placeholder={tr("booking.notes")} value={notes} onChange={(e) => setNotes(e.target.value)} />
          <button className="btn-primary w-full justify-center mt-4 !py-4" onClick={submit} disabled={submitting || !user}>
            ✦ {tr("booking.confirm")}
          </button>
        </div>

        {/* MY BOOKINGS */}
        <div className="card-surface p-7 lg:sticky lg:top-[82px]">
          <div style={{ fontSize: 17, fontWeight: 700, color: "var(--gold-dark)" }}>{tr("booking.yours")}</div>
          <div className="mt-4 flex flex-col gap-2.5 max-h-[600px] overflow-y-auto">
            {!user && <div className="text-center py-10" style={{ color: "var(--text-muted)" }}>{tr("booking.loginRequired")}</div>}
            {user && (!myBookings || myBookings.length === 0) && (
              <div className="text-center py-10" style={{ color: "var(--text-muted)" }}>📋<div className="mt-2 text-sm">{tr("booking.empty")}</div></div>
            )}
            {myBookings?.map((b) => (
              <div key={b.id} className="rounded-[16px] p-4 relative overflow-hidden" style={{ background: "var(--surface-alt)", border: "1px solid var(--border-c)" }}>
                <div className="absolute top-0 inset-inline-end-0 w-[3px] h-full" style={{ background: "linear-gradient(to bottom,var(--gold),var(--gold-dark))", insetInlineEnd: 0 }} />
                <div className="flex justify-between items-start mb-2">
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{b.name}</div>
                  <span style={{ fontFamily: "Poppins", fontSize: 10, background: "rgba(201,168,76,.12)", color: "var(--gold-light)", padding: "2px 9px", borderRadius: 20 }}>
                    {lang === "ar" ? b.services?.name_ar : b.services?.name_en}
                  </span>
                </div>
                <div className="flex gap-3 flex-wrap text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>📅 {b.booking_date}</span>
                  <span>🕒 {b.booking_time}</span>
                  <span>🚗 {b.car}</span>
                  <span style={{ color: "var(--gold)" }}>{Number(b.price)} ₪</span>
                </div>
                {b.status === "pending" && (
                  <button onClick={() => cancelBooking(b.id)} className="mt-2 inline-flex items-center gap-1 text-xs" style={{ color: "#DD6060" }}>
                    <Trash2 size={12} /> {tr("booking.cancel")}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
