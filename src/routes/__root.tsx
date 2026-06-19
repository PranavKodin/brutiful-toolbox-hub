import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/use-auth";
import { AdminFab } from "@/components/AdminFab";

function NotFoundComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-24">
        <div className="border-brutal bg-card shadow-brutal-lg p-10 max-w-md text-center">
          <div className="font-display text-7xl">404</div>
          <h1 className="mt-2 text-2xl">Page not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            That page doesn't exist. Maybe it was a tool that never shipped.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex border-brutal bg-brand-yellow px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift"
          >
            Go home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="border-brutal bg-card shadow-brutal-lg p-10 max-w-md text-center">
        <h1 className="text-2xl">Something broke.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Try again, or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="border-brutal bg-foreground text-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift"
          >
            Try again
          </button>
          <a href="/" className="border-brutal bg-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bytebox — Small, sharp tools for makers" },
      { name: "description", content: "A growing collection of small downloadable tools for designers, developers, and writers. No ads. No tracking." },
      { name: "author", content: "Bytebox" },
      { property: "og:title", content: "Bytebox — Small, sharp tools for makers" },
      { property: "og:description", content: "Small downloadable tools for designers, developers, and writers." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Bytebox" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Bytebox",
          description: "Small downloadable tools for makers.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
        <AdminFab />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
