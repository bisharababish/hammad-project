import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { I18nProvider, useI18n } from "@/contexts/I18nContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

function NotFoundComponent() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold gold-gradient-text">404</h1>
        <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
          Page not found
        </p>
        <Link to="/" className="mt-6 inline-block btn-primary">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-md text-center">
        <h1
          className="text-xl font-semibold"
          style={{ color: "var(--gold-light)" }}
        >
          Something went wrong
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          {error.message}
        </p>
        <button
          className="btn-primary mt-6"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "مغسلة البرنس | Al-Prince Car Wash" },
        {
          name: "description",
          content:
            "خدمات غسيل وتلميع سيارات فاخرة — Premium car wash and detailing services.",
        },
      ],
      links: [
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "stylesheet", href: appCss },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Poppins:wght@300;400;500;600;700;800&display=swap",
        },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  },
);

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
    });
    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

function AppShell() {
  const { dir } = useI18n();
  return (
    <div
      dir={dir}
      style={{ minHeight: "100vh", background: "var(--background)" }}
    >
      <Navbar />
      <main style={{ paddingTop: 68 }}>
        <Outlet />
      </main>
      <Footer />
      <Toaster theme="light" position="bottom-center" richColors />
    </div>
  );
}
