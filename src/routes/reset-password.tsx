import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Bytebox" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({ to: "/profile" });
  }

  return (
    <section className="bg-brand-pink border-b-[3px] border-foreground min-h-[80vh]">
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="border-brutal bg-background shadow-brutal-lg p-8">
          <h1 className="font-display text-3xl mb-6">SET NEW PASSWORD</h1>
          <form onSubmit={submit} className="space-y-3">
            <label className="block">
              <span className="font-mono text-xs uppercase mb-1 flex items-center gap-1"><Lock className="size-3" /> New password</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-brutal bg-background px-3 py-2 font-medium"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="w-full border-brutal bg-foreground text-background px-4 py-3 font-bold uppercase shadow-brutal hover-lift disabled:opacity-50"
            >
              {busy ? "..." : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
