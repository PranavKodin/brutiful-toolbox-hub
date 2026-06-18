import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { tools } from "@/lib/tools-data";
import { ToolCard } from "@/components/ToolCard";
import { toast } from "sonner";
import { LogOut, Save, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Bytebox" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: profile }, { data: favs }] = await Promise.all([
        supabase.from("profiles").select("username, avatar_url").eq("id", user.id).maybeSingle(),
        supabase.from("favorites").select("tool_slug").eq("user_id", user.id),
      ]);
      setUsername(profile?.username ?? "");
      setAvatarUrl(profile?.avatar_url ?? "");
      setFavorites(favs?.map((f) => f.tool_slug) ?? []);
      setReady(true);
    })();
  }, [user]);

  async function save() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ username: username || null, avatar_url: avatarUrl || null })
      .eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  }

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  if (loading || !user || !ready) {
    return <div className="mx-auto max-w-3xl px-4 py-20 font-mono">Loading...</div>;
  }

  const savedTools = tools.filter((t) => favorites.includes(t.slug));

  return (
    <>
      <section className="bg-brand-blue border-b-[3px] border-foreground">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="size-20 border-brutal shadow-brutal-sm object-cover bg-background" />
              ) : (
                <div className="size-20 border-brutal shadow-brutal-sm bg-background flex items-center justify-center">
                  <UserIcon className="size-10" />
                </div>
              )}
              <div>
                <div className="font-mono text-xs uppercase">Signed in as</div>
                <h1 className="font-display text-3xl md:text-4xl">{username || user.email}</h1>
                <div className="font-mono text-xs">{user.email}</div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="border-brutal bg-foreground text-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift inline-flex items-center gap-2"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 grid lg:grid-cols-2 gap-6">
        <div className="border-brutal bg-card shadow-brutal p-6">
          <h2 className="text-2xl mb-4">Edit profile</h2>
          <div className="space-y-3">
            <label className="block">
              <span className="font-mono text-xs uppercase mb-1 block">Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-brutal bg-background px-3 py-2 font-medium"
              />
            </label>
            <label className="block">
              <span className="font-mono text-xs uppercase mb-1 block">Avatar URL</span>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full border-brutal bg-background px-3 py-2 font-medium"
              />
              <span className="text-xs font-mono mt-1 block opacity-70">Paste a link to your profile image.</span>
            </label>
            <button
              onClick={save}
              disabled={saving}
              className="border-brutal bg-foreground text-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="size-4" /> {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div className="border-brutal bg-card shadow-brutal p-6">
          <h2 className="text-2xl mb-4">Saved tools <span className="font-mono text-sm">({savedTools.length})</span></h2>
          {savedTools.length === 0 ? (
            <p className="font-medium">
              No favorites yet. <Link to="/tools" className="underline">Browse tools</Link> and tap the heart to save them here.
            </p>
          ) : (
            <ul className="space-y-2">
              {savedTools.map((t) => (
                <li key={t.slug}>
                  <Link
                    to="/tools/$slug"
                    params={{ slug: t.slug }}
                    className="block border-brutal bg-background px-3 py-2 font-bold uppercase text-sm shadow-brutal-sm hover-lift"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
