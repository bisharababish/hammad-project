import { Link, useRouterState } from "@tanstack/react-router";
import { Crown, Menu, X } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";

const NAV = [
  { to: "/", key: "nav.home" },
  { to: "/services", key: "nav.services" },
  { to: "/booking", key: "nav.booking" },
  { to: "/reviews", key: "nav.reviews" },
] as const;

export function Navbar() {
  const { tr, lang, toggle } = useI18n();
  const { user, isAdmin, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-md"
      style={{
        height: 68,
        background: "rgba(255, 251, 245, 0.92)",
        borderBottom: "1px solid var(--border-c)",
        boxShadow: "0 2px 20px rgba(201,168,76,.08)",
      }}
    >
      <div className="h-full px-[5%] md:px-[8%] flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <Crown size={28} style={{ color: "var(--gold)" }} />
          <div>
            <div className="font-black leading-tight" style={{ fontFamily: "Cairo", fontSize: 17, color: "var(--text)" }}>
              {lang === "ar" ? "مغسلة البرنس" : "Al-Prince"}
            </div>
            <div style={{ fontFamily: "Poppins", fontSize: 9, color: "var(--text-muted)", letterSpacing: 1.5, textTransform: "uppercase" }}>
              {tr("brand.sub")}
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map(({ to, key }) => (
            <Link
              key={to}
              to={to}
              className="px-3.5 py-2 rounded-[10px] transition-colors"
              style={{
                fontFamily: "Poppins",
                fontSize: 13,
                fontWeight: pathname === to ? 600 : 500,
                color: pathname === to ? "var(--gold-dark)" : "var(--text-muted)",
                background: pathname === to ? "var(--surface-alt)" : "transparent",
              }}
            >
              {tr(key)}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="px-3.5 py-2 rounded-[10px]"
              style={{ fontFamily: "Poppins", fontSize: 13, fontWeight: pathname === "/admin" ? 600 : 500, color: "var(--gold-dark)" }}
            >
              {tr("nav.admin")}
            </Link>
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <button onClick={toggle} className="btn-outline !py-2 !px-3 !text-xs">
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          {user ? (
            <>
              <span className="text-xs truncate max-w-[140px]" style={{ color: "var(--text-muted)", fontFamily: "Poppins" }}>
                {user.email}
              </span>
              <button onClick={() => signOut()} className="btn-outline !py-2 !px-3 !text-xs">
                {tr("nav.logout")}
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-outline !py-2 !px-4 !text-xs">{tr("nav.login")}</Link>
          )}
          <Link to="/booking" className="btn-primary !py-2.5 !px-5 !text-xs">{tr("nav.bookNow")}</Link>
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} style={{ color: "var(--gold-dark)" }} /> : <Menu size={22} style={{ color: "var(--gold-dark)" }} />}
        </button>
      </div>

      {open && (
        <div
          className="lg:hidden absolute top-[68px] inset-x-0 p-4 flex flex-col gap-2"
          style={{ background: "var(--surface)", borderBottom: "1px solid var(--border-c)", boxShadow: "0 8px 24px rgba(201,168,76,.1)" }}
        >
          {NAV.map(({ to, key }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl" style={{ background: "var(--surface-alt)", fontWeight: 600 }}>
              {tr(key)}
            </Link>
          ))}
          {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl" style={{ background: "var(--surface-alt)" }}>{tr("nav.admin")}</Link>}
          <div className="flex gap-2 pt-2">
            <button onClick={toggle} className="btn-outline flex-1 justify-center">{lang === "ar" ? "EN" : "عربي"}</button>
            {user ? (
              <button onClick={() => { signOut(); setOpen(false); }} className="btn-outline flex-1 justify-center">{tr("nav.logout")}</button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="btn-outline flex-1 justify-center">{tr("nav.login")}</Link>
            )}
            <Link to="/booking" onClick={() => setOpen(false)} className="btn-primary flex-1 justify-center">{tr("nav.bookNow")}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
