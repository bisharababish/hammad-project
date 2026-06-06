import { S as reactExports, J as jsxRuntimeExports } from "./server-D0hi5enF.mjs";
import { o as useI18n, q as useNavigate, C as Crown, L as Link, k as supabase, m as toast, c as createLucideIcon } from "./router-DWRRqTVM.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
const __iconNode$3 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode$1);
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
function LoginPage() {
  const {
    tr,
    lang
  } = useI18n();
  const nav = useNavigate();
  const [mode, setMode] = reactExports.useState("signin");
  const [loading, setLoading] = reactExports.useState(false);
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  async function handleEmail(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: name,
              phone
            }
          }
        });
        if (error) throw error;
        toast.success(tr("login.checkEmail"));
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast.success(tr("login.welcome"));
        nav({
          to: "/"
        });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }
  async function handleGoogle() {
    setLoading(true);
    const {
      error
    } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    if (error) {
      toast.error(error.message || "Google sign-in failed");
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "min-h-[calc(100vh-68px)] flex items-center justify-center px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md card-surface p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { size: 36, className: "mx-auto mb-2", style: {
        color: "var(--gold)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-black", style: {
        fontFamily: "Cairo",
        fontSize: 26
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gold-gradient-text", children: mode === "signin" ? tr("login.title") : tr("login.signup") }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleGoogle, disabled: loading, className: "btn-outline w-full justify-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })
      ] }),
      tr("login.google")
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 my-5 text-xs", style: {
      color: "var(--text-muted)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px", style: {
        background: "var(--border-c)"
      } }),
      tr("login.or"),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px", style: {
        background: "var(--border-c)"
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleEmail, className: "flex flex-col gap-3", children: [
      mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 14 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "form-input", placeholder: tr("login.name"), value: name, onChange: (e) => setName(e.target.value), required: true }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 14 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "form-input", placeholder: tr("login.phone"), value: phone, onChange: (e) => setPhone(e.target.value) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 14 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", className: "form-input", placeholder: tr("login.email"), value: email, onChange: (e) => setEmail(e.target.value), required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 14 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", className: "form-input", placeholder: tr("login.password"), value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 6 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "btn-primary w-full justify-center mt-2", children: loading ? "..." : mode === "signin" ? tr("login.title") : tr("login.signup") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode(mode === "signin" ? "signup" : "signin"), className: "w-full mt-5 text-xs", style: {
      color: "var(--text-muted)",
      fontFamily: "Poppins"
    }, children: mode === "signin" ? tr("login.noAccount") : tr("login.haveAccount") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-center text-xs leading-relaxed", style: {
      color: "var(--text-muted)"
    }, children: lang === "ar" ? "مسؤول؟ سجّل الدخول بنفس البريد الذي أضفته في Supabase، ثم افتح /admin" : "Admin? Sign in with the same email you promoted in Supabase, then open /admin" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-center text-xs", style: {
      color: "var(--text-muted)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", style: {
      color: "var(--gold-dark)"
    }, children: lang === "ar" ? "العودة للرئيسية" : "Back to home" }) })
  ] }) });
}
function Field({
  icon,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1/2 -translate-y-1/2 pointer-events-none", style: {
      insetInlineEnd: 13,
      color: "var(--gold-dark)"
    }, children: icon }),
    children
  ] });
}
export {
  LoginPage as component
};
