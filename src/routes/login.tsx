import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Crown, Mail, Lock, User as UserIcon, Phone } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Al-Prince" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { tr, lang } = useI18n();
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  async function handleEmail(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: name, phone },
          },
        });
        if (error) throw error;
        toast.success(tr("login.checkEmail"));
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success(tr("login.welcome"));
        nav({ to: "/" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) {
      toast.error(error.message || "Google sign-in failed");
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[calc(100vh-68px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md card-surface p-8">
        <div className="text-center mb-6">
          <Crown
            size={36}
            className="mx-auto mb-2"
            style={{ color: "var(--gold)" }}
          />
          <h1
            className="font-black"
            style={{ fontFamily: "Cairo", fontSize: 26 }}
          >
            <span className="gold-gradient-text">
              {mode === "signin" ? tr("login.title") : tr("login.signup")}
            </span>
          </h1>
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="btn-outline w-full justify-center mb-4"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {tr("login.google")}
        </button>

        <div
          className="flex items-center gap-3 my-5 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <div
            className="flex-1 h-px"
            style={{ background: "var(--border-c)" }}
          />
          {tr("login.or")}
          <div
            className="flex-1 h-px"
            style={{ background: "var(--border-c)" }}
          />
        </div>

        <form onSubmit={handleEmail} className="flex flex-col gap-3">
          {mode === "signup" && (
            <>
              <Field icon={<UserIcon size={14} />}>
                <input
                  className="form-input"
                  placeholder={tr("login.name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>
              <Field icon={<Phone size={14} />}>
                <input
                  className="form-input"
                  placeholder={tr("login.phone")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Field>
            </>
          )}
          <Field icon={<Mail size={14} />}>
            <input
              type="email"
              className="form-input"
              placeholder={tr("login.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field icon={<Lock size={14} />}>
            <input
              type="password"
              className="form-input"
              placeholder={tr("login.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </Field>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-2"
          >
            {loading
              ? "..."
              : mode === "signin"
                ? tr("login.title")
                : tr("login.signup")}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full mt-5 text-xs"
          style={{ color: "var(--text-muted)", fontFamily: "Poppins" }}
        >
          {mode === "signin" ? tr("login.noAccount") : tr("login.haveAccount")}
        </button>

        <p
          className="mt-4 text-center text-xs leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {lang === "ar"
            ? "مسؤول؟ سجّل الدخول بنفس البريد الذي أضفته في Supabase، ثم افتح /admin"
            : "Admin? Sign in with the same email you promoted in Supabase, then open /admin"}
        </p>

        <div
          className="mt-4 text-center text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <Link to="/" style={{ color: "var(--gold-dark)" }}>
            {lang === "ar" ? "العودة للرئيسية" : "Back to home"}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Field({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span
        className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ insetInlineEnd: 13, color: "var(--gold-dark)" }}
      >
        {icon}
      </span>
      {children}
    </div>
  );
}
