import { Link, useRouterState } from "@tanstack/react-router";
import { Crown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function AdminFab() {
  const { isAdmin } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (!isAdmin || path.startsWith("/admin")) return null;

  return (
    <Link
      to="/admin"
      className="fixed bottom-5 right-5 z-50 border-brutal bg-brand-yellow shadow-brutal hover-lift px-4 py-3 inline-flex items-center gap-2 font-bold uppercase text-sm"
      aria-label="Open admin panel"
    >
      <Crown className="size-4" /> Admin
    </Link>
  );
}
