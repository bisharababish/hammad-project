import { Link } from "@tanstack/react-router";
import { Crown } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

export function Footer() {
  const { tr, lang } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--surface-alt)", borderTop: "1px solid var(--border-c)" }}>
      <div className="px-[8%] py-12 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Crown size={22} style={{ color: "var(--gold)" }} />
            <span className="font-bold" style={{ fontFamily: "Cairo", fontSize: 16 }}>{lang === "ar" ? "مغسلة البرنس" : "Al-Prince"}</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>{tr("hero.desc")}</p>
        </div>
        <div>
          <div className="mb-3 font-semibold" style={{ fontSize: 13, color: "var(--gold-dark)" }}>{lang === "ar" ? "روابط سريعة" : "Quick Links"}</div>
          <div className="flex flex-col gap-2">
            {[
              { to: "/", label: tr("nav.home") },
              { to: "/services", label: tr("nav.services") },
              { to: "/booking", label: tr("nav.booking") },
              { to: "/reviews", label: tr("nav.reviews") },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{ fontSize: 13, color: "var(--text-muted)" }} className="hover:opacity-80">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-3 font-semibold" style={{ fontSize: 13, color: "var(--gold-dark)" }}>{lang === "ar" ? "تواصل معنا" : "Contact"}</div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.8 }}>
            {lang === "ar" ? "احجز موعدك عبر الموقع أو زرنا مباشرة." : "Book online or visit us in person."}
          </p>
          <Link to="/booking" className="btn-primary !text-xs !py-2 !px-4 mt-3 inline-flex">{tr("nav.bookNow")}</Link>
        </div>
      </div>
      <div className="px-[8%] py-4 text-center" style={{ borderTop: "1px solid var(--border-c)", fontSize: 12, color: "var(--text-muted)", fontFamily: "Poppins" }}>
        {tr("footer.rights").replace("2025", String(year))}
      </div>
    </footer>
  );
}
