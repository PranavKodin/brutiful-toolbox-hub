import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { useTools, saveTool, removeTool, seedFirestore } from "@/hooks/use-tools";
import { usePosts, savePost, removePost, seedPostsToDb, useRoadmap, saveRoadmapItem, removeRoadmapItem, seedRoadmapToDb, type RoadmapItem } from "@/hooks/use-content";
import type { Tool } from "@/lib/tools-data";
import type { Post } from "@/lib/blog-data";
import { toast } from "sonner";
import { Shield, Plus, Trash2, Save, Database, Users, Wrench, Crown, Copy, FileText, Map as MapIcon, Settings as Cog, ShieldOff, Star, Mail, Inbox } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Tools Lab" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type UserRow = { id: string; email?: string; username?: string; createdAt?: { seconds: number } | null };
type AdminRow = { id: string; email?: string };

const TABS = [
  { key: "tools", label: "Tools", icon: Wrench },
  { key: "posts", label: "Blog", icon: FileText },
  { key: "roadmap", label: "Roadmap", icon: MapIcon },
  { key: "users", label: "Users", icon: Users },
  { key: "inbox", label: "Inbox", icon: Inbox },
  { key: "settings", label: "Settings", icon: Cog },
] as const;

function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { tools, refetch: refetchTools, fromDb: toolsFromDb } = useTools();
  const { posts, refetch: refetchPosts, fromDb: postsFromDb } = usePosts();
  const { items: roadmap, refetch: refetchRoadmap, fromDb: roadmapFromDb } = useRoadmap();
  const [tab, setTab] = useState<typeof TABS[number]["key"]>("tools");

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [user, loading, navigate]);

  if (loading) return <div className="mx-auto max-w-5xl px-4 py-20 font-mono">Loading…</div>;
  if (!user) return null;

  if (!isAdmin) return <NotAdminScreen uid={user.uid} email={user.email ?? ""} />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="border-brutal bg-brand-yellow p-2 shadow-brutal-sm"><Crown className="size-5" /></span>
          <div>
            <h1 className="font-display text-3xl md:text-4xl">Admin control panel</h1>
            <div className="font-mono text-xs uppercase mt-1">Signed in as {user.email}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 font-mono text-[11px] uppercase">
          <Badge label="Tools" live={toolsFromDb} />
          <Badge label="Posts" live={postsFromDb} />
          <Badge label="Roadmap" live={roadmapFromDb} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`border-brutal px-4 py-2 font-bold uppercase text-sm shadow-brutal-sm hover-lift inline-flex items-center gap-2 ${tab === t.key ? "bg-foreground text-background" : "bg-background"}`}
            >
              <Icon className="size-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "tools" && <ToolsTab tools={tools} refetch={refetchTools} fromDb={toolsFromDb} />}
      {tab === "posts" && <PostsTab posts={posts} refetch={refetchPosts} fromDb={postsFromDb} />}
      {tab === "roadmap" && <RoadmapTab items={roadmap} refetch={refetchRoadmap} fromDb={roadmapFromDb} />}
      {tab === "users" && <UsersTab />}
      {tab === "inbox" && <InboxTab />}
      {tab === "settings" && <SettingsTab toolsFromDb={toolsFromDb} postsFromDb={postsFromDb} roadmapFromDb={roadmapFromDb} refetchAll={() => { refetchTools(); refetchPosts(); refetchRoadmap(); }} />}
    </section>
  );
}

function Badge({ label, live }: { label: string; live: boolean }) {
  return (
    <span className={`border-brutal px-2 py-0.5 ${live ? "bg-brand-green" : "bg-brand-yellow"}`}>
      {label}: {live ? "Firestore" : "Seed"}
    </span>
  );
}

function NotAdminScreen({ uid, email }: { uid: string; email: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <section className="mx-auto max-w-2xl px-4 py-20">
      <div className="border-brutal bg-card shadow-brutal p-8 text-center">
        <Shield className="size-10 mx-auto mb-4" />
        <h1 className="text-3xl mb-2">Admin only</h1>
        <p className="font-medium mb-4">Your account isn't an admin yet.</p>
        <div className="border-brutal bg-background p-4 text-left font-mono text-xs mb-4">
          <div>UID: <b>{uid}</b></div>
          <div>Email: <b>{email}</b></div>
          <button
            onClick={() => { navigator.clipboard.writeText(uid); toast.success("UID copied"); }}
            className="mt-3 border-brutal bg-foreground text-background px-3 py-1.5 inline-flex items-center gap-2 uppercase font-bold text-xs"
          >
            <Copy className="size-3" /> Copy my UID
          </button>
        </div>
        <button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await setDoc(doc(db, "admins", uid), { email, grantedAt: serverTimestamp(), bootstrap: true });
              toast.success("Bootstrap admin granted. Refresh.");
              setTimeout(() => location.reload(), 800);
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Blocked by Firestore rules — see Firebase console.");
            } finally { setBusy(false); }
          }}
          className="border-brutal bg-brand-yellow px-4 py-2 font-bold uppercase text-sm shadow-brutal-sm hover-lift"
        >
          {busy ? "Trying…" : "Claim admin (works if rules open)"}
        </button>
        <Link to="/" className="mt-6 block underline font-bold uppercase text-sm">← Home</Link>
      </div>
    </section>
  );
}

/* ---------- TOOLS TAB ---------- */
function ToolsTab({ tools, refetch, fromDb }: { tools: Tool[]; refetch: () => void; fromDb: boolean }) {
  const [editing, setEditing] = useState<Tool | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="border-brutal bg-card shadow-brutal p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl">All tools ({tools.length})</h2>
          <button
            onClick={() => { setCreating(true); setEditing(newTool()); }}
            className="border-brutal bg-brand-green px-3 py-1.5 font-bold uppercase text-sm shadow-brutal-sm hover-lift inline-flex items-center gap-1"
          >
            <Plus className="size-4" /> New
          </button>
        </div>
        {!fromDb && <SeedHint where="Settings" />}
        <ul className="divide-y-[3px] divide-foreground border-brutal max-h-[600px] overflow-y-auto">
          {tools.map((t) => (
            <li key={t.slug} className="p-3 flex items-center justify-between gap-2 bg-background">
              <div className="min-w-0">
                <div className="font-display truncate flex items-center gap-2">
                  {t.featured && <Star className="size-3 fill-current" />}{t.name}
                </div>
                <div className="font-mono text-xs uppercase truncate">{t.category} · v{t.version}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => { setCreating(false); setEditing({ ...t }); }} className="border-brutal bg-background px-2 py-1 text-xs uppercase font-bold hover:bg-brand-yellow">Edit</button>
                <button
                  onClick={async () => {
                    if (!confirm(`Delete ${t.name}?`)) return;
                    try { await removeTool(t.slug); toast.success("Deleted"); refetch(); }
                    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                  }}
                  className="border-brutal bg-background px-2 py-1 text-xs uppercase font-bold hover:bg-brand-pink"
                  aria-label={`Delete ${t.name}`}
                ><Trash2 className="size-3" /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-brutal bg-card shadow-brutal p-5">
        <h2 className="text-2xl mb-4">{editing ? (creating ? "New tool" : `Edit: ${editing.name}`) : "Select a tool"}</h2>
        {editing ? (
          <ToolEditor
            tool={editing}
            creating={creating}
            onSave={async (t) => {
              try { await saveTool(t); toast.success("Saved"); setEditing(null); setCreating(false); refetch(); }
              catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
            }}
            onCancel={() => { setEditing(null); setCreating(false); }}
          />
        ) : <p className="font-medium text-muted-foreground">Pick a tool on the left, or hit New.</p>}
      </div>
    </div>
  );
}

function SeedHint({ where }: { where: string }) {
  return (
    <div className="border-brutal bg-brand-yellow p-3 mb-4 text-sm font-medium">
      Showing seed data. Seed Firestore from <b>{where}</b> tab so edits persist.
    </div>
  );
}

function newTool(): Tool {
  return { slug: "", name: "", tagline: "", description: "", category: "Productivity", version: "0.1.0", size: "1 MB", platform: ["Web"], githubUrl: "", releaseDate: new Date().toISOString().slice(0,10), color: "yellow", icon: "Box", features: [], requirements: [], changelog: [], featured: false, order: 99 };
}

function ToolEditor({ tool, creating, onSave, onCancel }: { tool: Tool; creating: boolean; onSave: (t: Tool) => void; onCancel: () => void }) {
  const [t, setT] = useState<Tool>(tool);
  useEffect(() => setT(tool), [tool]);
  const set = <K extends keyof Tool>(k: K, v: Tool[K]) => setT((p) => ({ ...p, [k]: v }));
  const inp = "w-full border-brutal bg-background px-3 py-2 font-medium";
  const cap = "font-mono text-xs uppercase mb-1 block";

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
      <label><span className={cap}>Slug (URL)</span><input className={inp} value={t.slug} disabled={!creating} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} /></label>
      <label><span className={cap}>Name</span><input className={inp} value={t.name} onChange={(e) => set("name", e.target.value)} /></label>
      <label><span className={cap}>Tagline</span><input className={inp} value={t.tagline} onChange={(e) => set("tagline", e.target.value)} /></label>
      <label><span className={cap}>Description</span><textarea className={inp} rows={3} value={t.description} onChange={(e) => set("description", e.target.value)} /></label>
      <div className="grid grid-cols-2 gap-2">
        <label><span className={cap}>Category</span><input className={inp} value={t.category} onChange={(e) => set("category", e.target.value)} /></label>
        <label><span className={cap}>Version</span><input className={inp} value={t.version} onChange={(e) => set("version", e.target.value)} /></label>
        <label><span className={cap}>Icon</span><input className={inp} value={t.icon} onChange={(e) => set("icon", e.target.value)} /></label>
        <label><span className={cap}>Color</span>
          <select className={inp} value={t.color} onChange={(e) => set("color", e.target.value as Tool["color"])}>
            {(["yellow","pink","blue","green","orange"] as const).map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label><span className={cap}>Size</span><input className={inp} value={t.size} onChange={(e) => set("size", e.target.value)} /></label>
        <label><span className={cap}>Release date</span><input type="date" className={inp} value={t.releaseDate} onChange={(e) => set("releaseDate", e.target.value)} /></label>
      </div>
      <label><span className={cap}>GitHub URL</span><input className={inp} value={t.githubUrl ?? ""} onChange={(e) => set("githubUrl", e.target.value)} placeholder="https://github.com/user/repo" /></label>
      <label><span className={cap}>Platforms (comma)</span><input className={inp} value={t.platform.join(", ")} onChange={(e) => set("platform", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} /></label>
      <label><span className={cap}>Features (one per line)</span><textarea className={inp} rows={4} value={t.features.join("\n")} onChange={(e) => set("features", e.target.value.split("\n").map(s=>s.trim()).filter(Boolean))} /></label>
      <label><span className={cap}>Requirements (one per line)</span><textarea className={inp} rows={2} value={t.requirements.join("\n")} onChange={(e) => set("requirements", e.target.value.split("\n").map(s=>s.trim()).filter(Boolean))} /></label>
      <div className="grid grid-cols-2 gap-2">
        <label className="inline-flex items-center gap-2 font-mono uppercase text-xs"><input type="checkbox" checked={!!t.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured</label>
        <label><span className={cap}>Order</span><input type="number" className={inp} value={t.order ?? 99} onChange={(e) => set("order", Number(e.target.value))} /></label>
      </div>
      <details className="border-brutal bg-background p-3">
        <summary className="font-bold uppercase text-xs cursor-pointer">Changelog (JSON)</summary>
        <textarea className="w-full border-brutal bg-background mt-2 p-2 font-mono text-xs" rows={8}
          value={JSON.stringify(t.changelog, null, 2)}
          onChange={(e) => { try { set("changelog", JSON.parse(e.target.value)); } catch { /* */ } }} />
      </details>
      <div className="flex gap-2 pt-2">
        <button onClick={() => { if (!t.slug || !t.name) { toast.error("Slug & name required"); return; } onSave(t); }}
          className="border-brutal bg-foreground text-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift inline-flex items-center gap-2">
          <Save className="size-4" /> Save
        </button>
        <button onClick={onCancel} className="border-brutal bg-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift">Cancel</button>
      </div>
    </div>
  );
}

/* ---------- POSTS TAB ---------- */
function newPost(): Post {
  return { slug: "", title: "", excerpt: "", date: new Date().toISOString().slice(0,10), author: "Tools Lab", readTime: "3 min", tag: "Notes", color: "yellow", body: [""] };
}

function PostsTab({ posts, refetch, fromDb }: { posts: Post[]; refetch: () => void; fromDb: boolean }) {
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="border-brutal bg-card shadow-brutal p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl">Blog posts ({posts.length})</h2>
          <button onClick={() => { setCreating(true); setEditing(newPost()); }}
            className="border-brutal bg-brand-green px-3 py-1.5 font-bold uppercase text-sm shadow-brutal-sm hover-lift inline-flex items-center gap-1">
            <Plus className="size-4" /> New
          </button>
        </div>
        {!fromDb && <SeedHint where="Settings" />}
        <ul className="divide-y-[3px] divide-foreground border-brutal max-h-[600px] overflow-y-auto">
          {posts.map((p) => (
            <li key={p.slug} className="p-3 flex items-center justify-between gap-2 bg-background">
              <div className="min-w-0">
                <div className="font-display truncate">{p.title}</div>
                <div className="font-mono text-xs uppercase truncate">{p.tag} · {new Date(p.date).toLocaleDateString()}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => { setCreating(false); setEditing({ ...p }); }} className="border-brutal bg-background px-2 py-1 text-xs uppercase font-bold hover:bg-brand-yellow">Edit</button>
                <button
                  onClick={async () => {
                    if (!confirm(`Delete "${p.title}"?`)) return;
                    try { await removePost(p.slug); toast.success("Deleted"); refetch(); }
                    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                  }}
                  className="border-brutal bg-background px-2 py-1 text-xs uppercase font-bold hover:bg-brand-pink"
                ><Trash2 className="size-3" /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-brutal bg-card shadow-brutal p-5">
        <h2 className="text-2xl mb-4">{editing ? (creating ? "New post" : `Edit: ${editing.title || "untitled"}`) : "Select a post"}</h2>
        {editing ? (
          <PostEditor
            post={editing} creating={creating}
            onSave={async (p) => {
              try { await savePost(p); toast.success("Saved"); setEditing(null); setCreating(false); refetch(); }
              catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
            }}
            onCancel={() => { setEditing(null); setCreating(false); }}
          />
        ) : <p className="font-medium text-muted-foreground">Pick a post or hit New.</p>}
      </div>
    </div>
  );
}

function PostEditor({ post, creating, onSave, onCancel }: { post: Post; creating: boolean; onSave: (p: Post) => void; onCancel: () => void }) {
  const [p, setP] = useState<Post>(post);
  useEffect(() => setP(post), [post]);
  const set = <K extends keyof Post>(k: K, v: Post[K]) => setP((x) => ({ ...x, [k]: v }));
  const inp = "w-full border-brutal bg-background px-3 py-2 font-medium";
  const cap = "font-mono text-xs uppercase mb-1 block";

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
      <label><span className={cap}>Slug</span><input className={inp} value={p.slug} disabled={!creating} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"-"))} /></label>
      <label><span className={cap}>Title</span><input className={inp} value={p.title} onChange={(e) => set("title", e.target.value)} /></label>
      <label><span className={cap}>Excerpt</span><textarea className={inp} rows={2} value={p.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></label>
      <div className="grid grid-cols-2 gap-2">
        <label><span className={cap}>Date</span><input type="date" className={inp} value={p.date} onChange={(e) => set("date", e.target.value)} /></label>
        <label><span className={cap}>Read time</span><input className={inp} value={p.readTime} onChange={(e) => set("readTime", e.target.value)} /></label>
        <label><span className={cap}>Author</span><input className={inp} value={p.author} onChange={(e) => set("author", e.target.value)} /></label>
        <label><span className={cap}>Tag</span><input className={inp} value={p.tag} onChange={(e) => set("tag", e.target.value)} /></label>
        <label><span className={cap}>Color</span>
          <select className={inp} value={p.color} onChange={(e) => set("color", e.target.value as Post["color"])}>
            {(["yellow","pink","blue","green","orange"] as const).map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
      </div>
      <label><span className={cap}>Body (one paragraph per line)</span>
        <textarea className={inp} rows={10} value={p.body.join("\n")} onChange={(e) => set("body", e.target.value.split("\n").filter(Boolean))} />
      </label>
      <div className="flex gap-2 pt-2">
        <button onClick={() => { if (!p.slug || !p.title) { toast.error("Slug & title required"); return; } onSave(p); }}
          className="border-brutal bg-foreground text-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift inline-flex items-center gap-2">
          <Save className="size-4" /> Save
        </button>
        <button onClick={onCancel} className="border-brutal bg-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift">Cancel</button>
      </div>
    </div>
  );
}

/* ---------- ROADMAP TAB ---------- */
function newRoadmap(): RoadmapItem {
  return { id: "", title: "", description: "", status: "next", order: 99 };
}

function RoadmapTab({ items, refetch, fromDb }: { items: RoadmapItem[]; refetch: () => void; fromDb: boolean }) {
  const [editing, setEditing] = useState<RoadmapItem | null>(null);
  const [creating, setCreating] = useState(false);
  const inp = "w-full border-brutal bg-background px-3 py-2 font-medium";
  const cap = "font-mono text-xs uppercase mb-1 block";

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="border-brutal bg-card shadow-brutal p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl">Roadmap ({items.length})</h2>
          <button onClick={() => { setCreating(true); setEditing(newRoadmap()); }}
            className="border-brutal bg-brand-green px-3 py-1.5 font-bold uppercase text-sm shadow-brutal-sm hover-lift inline-flex items-center gap-1">
            <Plus className="size-4" /> New
          </button>
        </div>
        {!fromDb && <SeedHint where="Settings" />}
        <ul className="divide-y-[3px] divide-foreground border-brutal max-h-[600px] overflow-y-auto">
          {items.map((it) => (
            <li key={it.id} className="p-3 flex items-center justify-between gap-2 bg-background">
              <div className="min-w-0">
                <div className="font-display truncate">{it.title}</div>
                <div className="font-mono text-xs uppercase truncate">{it.status}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => { setCreating(false); setEditing({ ...it }); }} className="border-brutal bg-background px-2 py-1 text-xs uppercase font-bold hover:bg-brand-yellow">Edit</button>
                <button onClick={async () => {
                  if (!confirm(`Delete ${it.title}?`)) return;
                  try { await removeRoadmapItem(it.id); toast.success("Deleted"); refetch(); }
                  catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                }} className="border-brutal bg-background px-2 py-1 text-xs uppercase font-bold hover:bg-brand-pink"><Trash2 className="size-3" /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-brutal bg-card shadow-brutal p-5">
        <h2 className="text-2xl mb-4">{editing ? (creating ? "New item" : `Edit: ${editing.title || "untitled"}`) : "Select an item"}</h2>
        {editing ? (
          <div className="space-y-3">
            <label><span className={cap}>ID (slug)</span><input className={inp} value={editing.id} disabled={!creating} onChange={(e) => setEditing({ ...editing, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} /></label>
            <label><span className={cap}>Title</span><input className={inp} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></label>
            <label><span className={cap}>Description</span><textarea className={inp} rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label>
            <div className="grid grid-cols-2 gap-2">
              <label><span className={cap}>Status</span>
                <select className={inp} value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as RoadmapItem["status"] })}>
                  <option value="shipped">shipped</option>
                  <option value="in-progress">in-progress</option>
                  <option value="next">next</option>
                  <option value="wishlist">wishlist</option>
                </select>
              </label>
              <label><span className={cap}>Order</span><input type="number" className={inp} value={editing.order ?? 99} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></label>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={async () => {
                if (!editing.id || !editing.title) { toast.error("ID & title required"); return; }
                try { await saveRoadmapItem(editing); toast.success("Saved"); setEditing(null); setCreating(false); refetch(); }
                catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
              }} className="border-brutal bg-foreground text-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift inline-flex items-center gap-2">
                <Save className="size-4" /> Save
              </button>
              <button onClick={() => { setEditing(null); setCreating(false); }} className="border-brutal bg-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift">Cancel</button>
            </div>
          </div>
        ) : <p className="font-medium text-muted-foreground">Pick an item or hit New.</p>}
      </div>
    </div>
  );
}

/* ---------- USERS TAB ---------- */
function UsersTab() {
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [favs, setFavs] = useState<Record<string, string[]>>({});

  const refresh = async () => {
    try {
      const [uSnap, aSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "admins")),
      ]);
      setUsers(uSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<UserRow, "id">) })));
      setAdmins(aSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AdminRow, "id">) })));
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  };
  useEffect(() => { refresh(); }, []);

  const loadFavs = async (uid: string) => {
    setExpanded(expanded === uid ? null : uid);
    if (favs[uid]) return;
    try {
      const snap = await getDocs(collection(db, "users", uid, "favorites"));
      setFavs((f) => ({ ...f, [uid]: snap.docs.map((d) => d.id) }));
    } catch { setFavs((f) => ({ ...f, [uid]: [] })); }
  };

  if (err) return <div className="border-brutal bg-card p-6 shadow-brutal">Error: {err}</div>;
  if (!users) return <div className="font-mono">Loading users…</div>;

  const adminIds = new Set(admins.map((a) => a.id));

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-3">
        <Stat label="Total users" value={users.length} />
        <Stat label="Admins" value={admins.length} />
        <Stat label="Signed up this week" value={users.filter((u) => u.createdAt?.seconds && (Date.now() - u.createdAt.seconds*1000) < 7*864e5).length} />
      </div>

      <div className="border-brutal bg-card shadow-brutal overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-foreground text-background">
            <tr>
              <th className="text-left p-3 font-display">Email</th>
              <th className="text-left p-3 font-display">Username</th>
              <th className="text-left p-3 font-display">Role</th>
              <th className="text-left p-3 font-display">Joined</th>
              <th className="text-left p-3 font-display">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <Fragment key={u.id}>
                <tr className="border-t-[3px] border-foreground">
                  <td className="p-3 font-medium">{u.email ?? "—"}</td>
                  <td className="p-3">{u.username ?? "—"}</td>
                  <td className="p-3">
                    {adminIds.has(u.id)
                      ? <span className="border-brutal bg-brand-yellow px-2 py-0.5 font-mono text-xs uppercase">Admin</span>
                      : <span className="font-mono text-xs uppercase">User</span>}
                  </td>
                  <td className="p-3 font-mono text-xs">{u.createdAt?.seconds ? new Date(u.createdAt.seconds*1000).toLocaleDateString() : "—"}</td>
                  <td className="p-3 flex flex-wrap gap-1">
                    <button onClick={() => loadFavs(u.id)} className="border-brutal bg-background px-2 py-1 text-xs uppercase font-bold hover:bg-brand-blue">View</button>
                    {adminIds.has(u.id) ? (
                      <button onClick={async () => {
                        if (!confirm(`Revoke admin from ${u.email}?`)) return;
                        try { await deleteDoc(doc(db, "admins", u.id)); toast.success("Demoted"); refresh(); }
                        catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                      }} className="border-brutal bg-background px-2 py-1 text-xs uppercase font-bold hover:bg-brand-orange inline-flex items-center gap-1">
                        <ShieldOff className="size-3" /> Demote
                      </button>
                    ) : (
                      <button onClick={async () => {
                        try { await setDoc(doc(db, "admins", u.id), { email: u.email, grantedAt: serverTimestamp() }); toast.success("Promoted"); refresh(); }
                        catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                      }} className="border-brutal bg-background px-2 py-1 text-xs uppercase font-bold hover:bg-brand-yellow inline-flex items-center gap-1">
                        <Shield className="size-3" /> Promote
                      </button>
                    )}
                    <button onClick={async () => {
                      if (!confirm(`Delete user profile + favorites for ${u.email}? (Auth account stays — remove in Firebase console.)`)) return;
                      try {
                        const favSnap = await getDocs(collection(db, "users", u.id, "favorites"));
                        await Promise.all(favSnap.docs.map((d) => deleteDoc(d.ref)));
                        await deleteDoc(doc(db, "users", u.id));
                        toast.success("User data deleted"); refresh();
                      } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                    }} className="border-brutal bg-background px-2 py-1 text-xs uppercase font-bold hover:bg-brand-pink inline-flex items-center gap-1">
                      <Trash2 className="size-3" /> Delete
                    </button>
                  </td>
                </tr>
                {expanded === u.id && (
                  <tr className="bg-background">
                    <td colSpan={5} className="p-3 border-t-[3px] border-foreground">
                      <div className="font-mono text-xs uppercase mb-1">UID: {u.id}</div>
                      <div className="font-mono text-xs uppercase mb-1">Favorites ({(favs[u.id] ?? []).length}):</div>
                      <div className="flex flex-wrap gap-1">
                        {(favs[u.id] ?? []).length === 0
                          ? <span className="font-mono text-xs">None</span>
                          : favs[u.id].map((s) => <span key={s} className="border-brutal bg-card px-2 py-0.5 text-xs">{s}</span>)
                        }
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {users.length === 0 && <tr><td colSpan={5} className="p-6 text-center font-medium">No users yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-brutal bg-card shadow-brutal-sm p-4">
      <div className="font-mono text-xs uppercase">{label}</div>
      <div className="font-display text-3xl">{value}</div>
    </div>
  );
}

/* ---------- SETTINGS TAB ---------- */
function SettingsTab({ toolsFromDb, postsFromDb, roadmapFromDb, refetchAll }: { toolsFromDb: boolean; postsFromDb: boolean; roadmapFromDb: boolean; refetchAll: () => void }) {
  const { user } = useAuth();
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <SeedCard title="Tools" live={toolsFromDb} onSeed={seedFirestore} refetch={refetchAll} />
      <SeedCard title="Blog posts" live={postsFromDb} onSeed={seedPostsToDb} refetch={refetchAll} />
      <SeedCard title="Roadmap" live={roadmapFromDb} onSeed={seedRoadmapToDb} refetch={refetchAll} />

      <div className="border-brutal bg-card shadow-brutal p-6">
        <h2 className="text-2xl mb-2">Promote a user</h2>
        <p className="font-medium mb-4 text-sm">Paste a UID to grant admin.</p>
        <PromoteForm />
        <div className="mt-4 text-xs font-mono">Your UID: <span className="bg-background border-brutal px-2 py-0.5">{user?.uid}</span></div>
      </div>

      <div className="md:col-span-2 border-brutal bg-brand-yellow shadow-brutal p-6">
        <h2 className="text-2xl mb-2">Firestore security rules</h2>
        <p className="font-medium mb-2 text-sm">Paste in Firebase Console → Firestore → Rules:</p>
        <pre className="border-brutal bg-background p-3 font-mono text-xs overflow-x-auto">{`rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function isAdmin() {
      return request.auth != null &&
        exists(/databases/$(db)/documents/admins/$(request.auth.uid));
    }
    match /tools/{slug}    { allow read: if true; allow write: if isAdmin(); }
    match /posts/{slug}    { allow read: if true; allow write: if isAdmin(); }
    match /roadmap/{id}    { allow read: if true; allow write: if isAdmin(); }
    match /contacts/{id}   { allow create: if true; allow read, update, delete: if isAdmin(); }
    match /newsletter/{id} { allow create: if true; allow read, delete: if isAdmin(); }
    match /admins/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow write: if isAdmin();
    }
    match /users/{uid} {
      allow read:   if isAdmin() || (request.auth != null && request.auth.uid == uid);
      allow write:  if isAdmin() || (request.auth != null && request.auth.uid == uid);
      match /favorites/{slug} {
        allow read, write: if isAdmin() || (request.auth != null && request.auth.uid == uid);
      }
    }
  }
}`}</pre>
      </div>
    </div>
  );
}

function SeedCard({ title, live, onSeed, refetch }: { title: string; live: boolean; onSeed: () => Promise<void>; refetch: () => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="border-brutal bg-card shadow-brutal p-6">
      <h2 className="text-2xl mb-2">Seed {title}</h2>
      <p className="font-medium mb-4 text-sm">
        {live ? "Already live in Firestore. Re-seed overwrites with defaults." : "Copy defaults into Firestore so edits persist."}
      </p>
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try { await onSeed(); toast.success(`${title} seeded`); refetch(); }
          catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
          finally { setBusy(false); }
        }}
        className="border-brutal bg-foreground text-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift inline-flex items-center gap-2 disabled:opacity-50"
      >
        <Database className="size-4" /> {busy ? "Seeding…" : live ? "Re-seed" : "Seed now"}
      </button>
    </div>
  );
}

function PromoteForm() {
  const [uid, setUid] = useState("");
  const [email, setEmail] = useState("");
  return (
    <div className="space-y-2">
      <input value={uid} onChange={(e) => setUid(e.target.value)} placeholder="User UID" className="w-full border-brutal bg-background px-3 py-2 font-mono text-sm" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email (optional)" className="w-full border-brutal bg-background px-3 py-2 text-sm" />
      <button
        onClick={async () => {
          if (!uid) return;
          try {
            await setDoc(doc(db, "admins", uid), { email, grantedAt: serverTimestamp() });
            toast.success("Promoted"); setUid(""); setEmail("");
          } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
        }}
        className="border-brutal bg-foreground text-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift"
      >
        Grant admin
      </button>
    </div>
  );
}

/* ---------- INBOX TAB ---------- */
type ContactRow = { id: string; name?: string; email?: string; message?: string; status?: string; createdAt?: { seconds: number } | null };
type SubRow = { id: string; email?: string; source?: string; createdAt?: { seconds: number } | null };

function InboxTab() {
  const [contacts, setContacts] = useState<ContactRow[] | null>(null);
  const [subs, setSubs] = useState<SubRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      const [c, n] = await Promise.all([
        getDocs(collection(db, "contacts")),
        getDocs(collection(db, "newsletter")),
      ]);
      setContacts(c.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ContactRow, "id">) })).sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)));
      setSubs(n.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SubRow, "id">) })).sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)));
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  };
  useEffect(() => { load(); }, []);

  const csv = (rows: SubRow[]) => {
    const lines = ["email,source,date", ...rows.map((r) => `${r.email ?? ""},${r.source ?? ""},${r.createdAt?.seconds ? new Date(r.createdAt.seconds*1000).toISOString() : ""}`)];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "newsletter.csv"; a.click(); URL.revokeObjectURL(url);
  };

  if (err) return <div className="border-brutal bg-card p-6 shadow-brutal">Error: {err}. Did you publish the Firestore rules from Settings?</div>;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-3">
        <Stat label="Contact messages" value={contacts?.length ?? 0} />
        <Stat label="Newsletter subs" value={subs?.length ?? 0} />
        <Stat label="New this week" value={(contacts ?? []).filter((c) => c.createdAt?.seconds && (Date.now() - c.createdAt.seconds*1000) < 7*864e5).length} />
      </div>

      <div className="border-brutal bg-card shadow-brutal p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl inline-flex items-center gap-2"><Mail className="size-5" /> Contact messages</h2>
          <button onClick={load} className="border-brutal bg-background px-3 py-1.5 font-bold uppercase text-xs shadow-brutal-sm hover-lift">Refresh</button>
        </div>
        {!contacts ? <div className="font-mono">Loading…</div> : contacts.length === 0 ? <p className="font-medium text-muted-foreground">No messages yet.</p> : (
          <ul className="divide-y-[3px] divide-foreground border-brutal max-h-[500px] overflow-y-auto">
            {contacts.map((c) => (
              <li key={c.id} className="p-4 bg-background">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="font-display text-lg">{c.name ?? "—"}</div>
                    <a href={`mailto:${c.email}`} className="font-mono text-xs uppercase underline">{c.email}</a>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-[10px] uppercase">{c.createdAt?.seconds ? new Date(c.createdAt.seconds*1000).toLocaleString() : "—"}</div>
                    <button
                      onClick={async () => {
                        if (!confirm("Delete this message?")) return;
                        try { await deleteDoc(doc(db, "contacts", c.id)); toast.success("Deleted"); load(); }
                        catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                      }}
                      className="mt-1 border-brutal bg-background px-2 py-1 text-xs uppercase font-bold hover:bg-brand-pink inline-flex items-center gap-1"
                    ><Trash2 className="size-3" /></button>
                  </div>
                </div>
                <p className="font-medium whitespace-pre-wrap text-sm border-l-4 border-foreground pl-3">{c.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-brutal bg-card shadow-brutal p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl inline-flex items-center gap-2"><Inbox className="size-5" /> Newsletter subscribers</h2>
          <div className="flex gap-2">
            <button onClick={() => subs && csv(subs)} disabled={!subs || subs.length === 0} className="border-brutal bg-brand-green px-3 py-1.5 font-bold uppercase text-xs shadow-brutal-sm hover-lift disabled:opacity-50">Export CSV</button>
            <button onClick={load} className="border-brutal bg-background px-3 py-1.5 font-bold uppercase text-xs shadow-brutal-sm hover-lift">Refresh</button>
          </div>
        </div>
        {!subs ? <div className="font-mono">Loading…</div> : subs.length === 0 ? <p className="font-medium text-muted-foreground">No subscribers yet.</p> : (
          <div className="overflow-x-auto border-brutal">
            <table className="w-full text-sm">
              <thead className="bg-foreground text-background">
                <tr><th className="text-left p-3 font-display">Email</th><th className="text-left p-3 font-display">Source</th><th className="text-left p-3 font-display">Date</th><th className="p-3"></th></tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id} className="border-t-[3px] border-foreground bg-background">
                    <td className="p-3 font-medium"><a href={`mailto:${s.email}`} className="underline">{s.email}</a></td>
                    <td className="p-3 font-mono text-xs">{s.source ?? "—"}</td>
                    <td className="p-3 font-mono text-xs">{s.createdAt?.seconds ? new Date(s.createdAt.seconds*1000).toLocaleString() : "—"}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={async () => {
                          if (!confirm(`Remove ${s.email}?`)) return;
                          try { await deleteDoc(doc(db, "newsletter", s.id)); toast.success("Removed"); load(); }
                          catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                        }}
                        className="border-brutal bg-background px-2 py-1 text-xs uppercase font-bold hover:bg-brand-pink"
                      ><Trash2 className="size-3" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
