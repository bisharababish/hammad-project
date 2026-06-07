import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShieldCheck, Trash2 } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Al-Prince" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { tr, lang } = useI18n();
  const { user, isAdmin, loading } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"bookings" | "services" | "closed">(
    "bookings",
  );
  const [newClosed, setNewClosed] = useState("");

  const { data: bookings } = useQuery({
    queryKey: ["admin-bookings"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, services(name_ar, name_en, emoji)")
        .order("booking_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: services } = useQuery({
    queryKey: ["admin-services"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: closed } = useQuery({
    queryKey: ["admin-closed"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("closed_days")
        .select("*")
        .order("closed_date");
      if (error) throw error;
      return data;
    },
  });

  if (loading)
    return (
      <div className="p-10 text-center" style={{ color: "var(--text-muted)" }}>
        {tr("common.loading")}
      </div>
    );
  if (!user)
    return (
      <div className="p-16 text-center">
        <p style={{ color: "var(--text-light)" }} className="mb-4">
          {tr("nav.login")}
        </p>
        <Link to="/login" search={{ redirect: "/admin" }} className="btn-primary">
          {tr("login.adminPortal")}
        </Link>
      </div>
    );
  if (!isAdmin)
    return (
      <div className="p-16 text-center">
        <ShieldCheck
          size={48}
          className="mx-auto mb-3"
          style={{ color: "var(--gold-dark)" }}
        />
        <p style={{ color: "var(--text-light)" }}>{tr("admin.notAdmin")}</p>
      </div>
    );

  const today = new Date().toISOString().split("T")[0];
  const todayCount =
    bookings?.filter((b) => b.booking_date === today).length ?? 0;
  const revenue =
    bookings
      ?.filter((b) => b.status !== "cancelled")
      .reduce((s, b) => s + Number(b.price), 0) ?? 0;

  async function setStatus(id: string, status: string) {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["admin-bookings"] });
  }
  async function delBooking(id: string) {
    if (!confirm(lang === "ar" ? "حذف الحجز؟" : "Delete booking?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["admin-bookings"] });
  }
  async function addClosed() {
    if (!newClosed) return;
    const { error } = await supabase
      .from("closed_days")
      .insert({ closed_date: newClosed });
    if (error) {
      toast.error(error.message);
      return;
    }
    setNewClosed("");
    qc.invalidateQueries({ queryKey: ["admin-closed"] });
  }
  async function delClosed(id: string) {
    const { error } = await supabase.from("closed_days").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["admin-closed"] });
  }

  return (
    <section className="px-[5%] md:px-[8%] py-12">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1
            className="font-black"
            style={{ fontFamily: "Cairo", fontSize: 28, color: "var(--gold)" }}
          >
            {tr("admin.title")}
          </h1>
          <div
            style={{
              fontFamily: "Poppins",
              fontSize: 11,
              color: "var(--text-muted)",
            }}
          >
            {user.email}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { l: tr("admin.totalBookings"), v: bookings?.length ?? 0 },
          { l: tr("admin.todayBookings"), v: todayCount },
          { l: tr("admin.revenue"), v: `${revenue} ₪` },
          { l: tr("admin.services"), v: services?.length ?? 0 },
        ].map((s) => (
          <div key={s.l} className="card-surface p-5">
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontFamily: "Poppins",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {s.l}
            </div>
            <div
              className="mt-1.5"
              style={{
                fontFamily: "Poppins",
                fontSize: 26,
                fontWeight: 800,
                color: "var(--gold)",
              }}
            >
              {s.v}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(
          [
            ["bookings", tr("admin.bookings")],
            ["services", tr("admin.services")],
            ["closed", tr("admin.closedDays")],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className="px-4 py-2 rounded-[10px]"
            style={{
              fontFamily: "Poppins",
              fontSize: 13,
              fontWeight: 600,
              background: tab === k ? "var(--gold)" : "transparent",
              color: tab === k ? "#fff" : "var(--text-muted)",
              border: "1px solid var(--border-c)",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "bookings" && (
        <div className="card-surface p-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  color: "var(--text-muted)",
                  fontSize: 11,
                  textAlign: "start",
                  fontFamily: "Poppins",
                }}
              >
                {[
                  tr("common.customer"),
                  tr("common.service"),
                  tr("common.date"),
                  tr("common.time"),
                  tr("common.price"),
                  tr("common.status"),
                  "",
                ].map((h) => (
                  <th key={h} className="text-start py-2 px-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings?.map((b) => (
                <tr
                  key={b.id}
                  style={{ borderTop: "1px solid var(--border-c)" }}
                >
                  <td className="py-3 px-2">
                    <div style={{ fontWeight: 600 }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {b.phone} • {b.car}
                    </div>
                  </td>
                  <td className="px-2">
                    {lang === "ar" ? b.services?.name_ar : b.services?.name_en}
                  </td>
                  <td className="px-2">{b.booking_date}</td>
                  <td className="px-2">{b.booking_time}</td>
                  <td className="px-2" style={{ color: "var(--gold)" }}>
                    {Number(b.price)} ₪
                  </td>
                  <td className="px-2">
                    <select
                      value={b.status}
                      onChange={(e) => setStatus(b.id, e.target.value)}
                      className="form-input !py-1 !px-2 !text-xs"
                    >
                      <option value="pending">{tr("admin.pending")}</option>
                      <option value="confirmed">{tr("admin.confirmed")}</option>
                      <option value="completed">{tr("admin.completed")}</option>
                      <option value="cancelled">{tr("admin.cancelled")}</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => delBooking(b.id)}
                      style={{ color: "#DD6060" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "services" && (
        <div className="card-surface p-5">
          <div className="grid md:grid-cols-3 gap-3">
            {services?.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-[14px]"
                style={{
                  background: "rgba(255,255,255,.02)",
                  border: "1px solid var(--border-c)",
                }}
              >
                <div className="text-2xl mb-2">{s.emoji}</div>
                <div style={{ fontWeight: 700 }}>{s.name_ar}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {s.name_en}
                </div>
                <div
                  className="mt-2"
                  style={{
                    color: "var(--gold)",
                    fontFamily: "Poppins",
                    fontWeight: 700,
                  }}
                >
                  {Number(s.price)} ₪
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "closed" && (
        <div className="card-surface p-5">
          <div className="flex gap-2 mb-4 flex-wrap">
            <input
              type="date"
              className="form-input"
              style={{ width: 200, direction: "ltr" }}
              value={newClosed}
              onChange={(e) => setNewClosed(e.target.value)}
            />
            <button className="btn-primary" onClick={addClosed}>
              {tr("admin.addClosed")}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {closed?.map((c) => (
              <div
                key={c.id}
                className="px-3 py-1.5 rounded-[10px] flex items-center gap-2"
                style={{
                  background: "rgba(204,68,68,.12)",
                  border: "1px solid rgba(204,68,68,.3)",
                  color: "#DD6060",
                  fontFamily: "Poppins",
                  fontSize: 12,
                }}
              >
                {c.closed_date}
                <button onClick={() => delClosed(c.id)}>
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
