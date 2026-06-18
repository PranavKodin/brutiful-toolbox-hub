import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { collection, getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { useTools, saveTool, removeTool, seedFirestore } from "@/hooks/use-tools";
import type { Tool } from "@/lib/tools-data";
import { toast } from "sonner";
import { Shield, Plus, Trash2, Save, Database, Users, Wrench, Crown, Copy } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Toolslab" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type UserRow = { id: string; email?: string; username?: string; createdAt?: { seconds: number } | null };

function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { tools, refetch, fromDb } = useTools();
  const [tab, setTab] = useState<"tools" | "users" | "settings">("tools");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  if (loading) return <div className="mx-auto max-w-5xl px-4 py-20 font-mono">Loading…</div>;
  if (!user) return null;

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20">
        <div className="border-brutal bg-card shadow-brutal p-8 text-center">
          <Shield className="size-10 mx-auto mb-4" />
          <h1 className="text-3xl mb-2">Admin only</h1>
          <p className="font-medium mb-4">Your account isn't an admin yet.</p>
          <div className="border-brutal bg-background p-4 text-left font-mono text-xs">
            <div className="mb-2 uppercase">To grant yourself admin, in Firebase console → Firestore, create:</div>
            <div>Collection: <b>admins</b></div>
            <div>Document ID: <b>{user.uid}</b></div>
            <div>Field: <b>email</b> = <b>{user.email}</b></div>
            <button
              onClick={() => { navigator.clipboard.writeText(user.uid); toast.success("UID copied"); }}
              className="mt-3 border-brutal bg-foreground text-background px-3 py-1.5 inline-flex items-center gap-2 uppercase font-bold text-xs"
            >
              <Copy className="size-3" /> Copy my UID
            </button>
          </div>
          <Link to="/" className="mt-6 inline-block underline font-bold uppercase text-sm">← Home</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="border-brutal bg-brand-yellow p-2 shadow-brutal-sm"><Crown className="size-5" /></span>
          <h1 className="font-display text-3xl md:text-4xl">Admin panel</h1>
        </div>
        <div className="font-mono text-xs uppercase border-brutal bg-card px-3 py-1.5">
          {fromDb ? "Live data: Firestore" : "Showing seed data (not yet seeded)"}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(["tools", "users", "settings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-brutal px-4 py-2 font-bold uppercase text-sm shadow-brutal-sm hover-lift inline-flex items-center gap-2 ${tab === t ? "bg-foreground text-background" : "bg-background"}`}
          >
            {t === "tools" ? <Wrench className="size-4" /> : t === "users" ? <Users className="size-4" /> : <Database className="size-4" />}
            {t}
          </button>
        ))}
      </div>

      {tab === "tools" && <ToolsTab tools={tools} refetch={refetch} fromDb={fromDb} />}
      {tab === "users" && <UsersTab />}
      {tab === "settings" && <SettingsTab fromDb={fromDb} refetch={refetch} />}
    </section>
  );
}

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
        {!fromDb && (
          <div className="border-brutal bg-brand-yellow p-3 mb-4 text-sm font-medium">
            Seed Firestore first (Settings tab) so edits persist.
          </div>
        )}
        <ul className="divide-y-[3px] divide-foreground border-brutal max-h-[600px] overflow-y-auto">
          {tools.map((t) => (
            <li key={t.slug} className="p-3 flex items-center justify-between gap-2 bg-background">
              <div className="min-w-0">
                <div className="font-display truncate">{t.name}</div>
                <div className="font-mono text-xs uppercase truncate">{t.category} · v{t.version}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => { setCreating(false); setEditing({ ...t }); }}
                  className="border-brutal bg-background px-2 py-1 text-xs uppercase font-bold hover:bg-brand-yellow"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (!confirm(`Delete ${t.name}?`)) return;
                    try { await removeTool(t.slug); toast.success("Deleted"); refetch(); }
                    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                  }}
                  className="border-brutal bg-background px-2 py-1 text-xs uppercase font-bold hover:bg-brand-pink"
                  aria-label={`Delete ${t.name}`}
                >
                  <Trash2 className="size-3" />
                </button>
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
        ) : (
          <p className="font-medium text-muted-foreground">Pick a tool on the left, or hit New.</p>
        )}
      </div>
    </div>
  );
}

function newTool(): Tool {
  return {
    slug: "",
    name: "",
    tagline: "",
    description: "",
    category: "Developer",
    version: "0.1.0",
    size: "1 MB",
    platform: ["Web"],
    githubUrl: "",
    releaseDate: new Date().toISOString().slice(0, 10),
    color: "yellow",
    icon: "Box",
    features: [],
    requirements: [],
    changelog: [],
    featured: false,
    order: 99,
  };
}

function ToolEditor({ tool, creating, onSave, onCancel }: { tool: Tool; creating: boolean; onSave: (t: Tool) => void; onCancel: () => void }) {
  const [t, setT] = useState<Tool>(tool);
  useEffect(() => setT(tool), [tool]);
  const set = <K extends keyof Tool>(k: K, v: Tool[K]) => setT((p) => ({ ...p, [k]: v }));
  const inp = "w-full border-brutal bg-background px-3 py-2 font-medium";
  const lbl = "block";
  const cap = "font-mono text-xs uppercase mb-1 block";

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
      <label className={lbl}>
        <span className={cap}>Slug (URL)</span>
        <input className={inp} value={t.slug} disabled={!creating} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} />
      </label>
      <label className={lbl}><span className={cap}>Name</span><input className={inp} value={t.name} onChange={(e) => set("name", e.target.value)} /></label>
      <label className={lbl}><span className={cap}>Tagline</span><input className={inp} value={t.tagline} onChange={(e) => set("tagline", e.target.value)} /></label>
      <label className={lbl}><span className={cap}>Description</span><textarea className={inp} rows={3} value={t.description} onChange={(e) => set("description", e.target.value)} /></label>
      <div className="grid grid-cols-2 gap-2">
        <label className={lbl}><span className={cap}>Category</span><input className={inp} value={t.category} onChange={(e) => set("category", e.target.value)} /></label>
        <label className={lbl}><span className={cap}>Version</span><input className={inp} value={t.version} onChange={(e) => set("version", e.target.value)} /></label>
        <label className={lbl}><span className={cap}>Icon (lucide name)</span><input className={inp} value={t.icon} onChange={(e) => set("icon", e.target.value)} /></label>
        <label className={lbl}><span className={cap}>Color</span>
          <select className={inp} value={t.color} onChange={(e) => set("color", e.target.value as Tool["color"])}>
            {(["yellow","pink","blue","green","orange"] as const).map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className={lbl}><span className={cap}>Size</span><input className={inp} value={t.size} onChange={(e) => set("size", e.target.value)} /></label>
        <label className={lbl}><span className={cap}>Release date</span><input type="date" className={inp} value={t.releaseDate} onChange={(e) => set("releaseDate", e.target.value)} /></label>
      </div>
      <label className={lbl}><span className={cap}>GitHub URL</span><input className={inp} value={t.githubUrl ?? ""} onChange={(e) => set("githubUrl", e.target.value)} placeholder="https://github.com/user/repo" /></label>
      <label className={lbl}><span className={cap}>Platforms (comma)</span><input className={inp} value={t.platform.join(", ")} onChange={(e) => set("platform", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} /></label>
      <label className={lbl}><span className={cap}>Features (one per line)</span><textarea className={inp} rows={4} value={t.features.join("\n")} onChange={(e) => set("features", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))} /></label>
      <label className={lbl}><span className={cap}>Requirements (one per line)</span><textarea className={inp} rows={2} value={t.requirements.join("\n")} onChange={(e) => set("requirements", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))} /></label>
      <div className="grid grid-cols-2 gap-2">
        <label className="inline-flex items-center gap-2 font-mono uppercase text-xs">
          <input type="checkbox" checked={!!t.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured
        </label>
        <label className={lbl}><span className={cap}>Order</span><input type="number" className={inp} value={t.order ?? 99} onChange={(e) => set("order", Number(e.target.value))} /></label>
      </div>

      <details className="border-brutal bg-background p-3">
        <summary className="font-bold uppercase text-xs cursor-pointer">Changelog (JSON)</summary>
        <textarea
          className="w-full border-brutal bg-background mt-2 p-2 font-mono text-xs"
          rows={8}
          value={JSON.stringify(t.changelog, null, 2)}
          onChange={(e) => {
            try { set("changelog", JSON.parse(e.target.value)); } catch { /* ignore */ }
          }}
        />
      </details>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => { if (!t.slug || !t.name) { toast.error("Slug & name required"); return; } onSave(t); }}
          className="border-brutal bg-foreground text-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift inline-flex items-center gap-2"
        >
          <Save className="size-4" /> Save
        </button>
        <button onClick={onCancel} className="border-brutal bg-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift">
          Cancel
        </button>
      </div>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        setUsers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<UserRow, "id">) })));
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Failed");
      }
    })();
  }, []);

  if (err) return <div className="border-brutal bg-card p-6 shadow-brutal">Error: {err}</div>;
  if (!users) return <div className="font-mono">Loading users…</div>;

  return (
    <div className="border-brutal bg-card shadow-brutal overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-foreground text-background">
          <tr>
            <th className="text-left p-3 font-display">Email</th>
            <th className="text-left p-3 font-display">Username</th>
            <th className="text-left p-3 font-display">Joined</th>
            <th className="text-left p-3 font-display">UID</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t-[3px] border-foreground">
              <td className="p-3 font-medium">{u.email ?? "—"}</td>
              <td className="p-3">{u.username ?? "—"}</td>
              <td className="p-3 font-mono text-xs">{u.createdAt?.seconds ? new Date(u.createdAt.seconds * 1000).toLocaleDateString() : "—"}</td>
              <td className="p-3 font-mono text-xs truncate max-w-[200px]">{u.id}</td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr><td colSpan={4} className="p-6 text-center font-medium">No users yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function SettingsTab({ fromDb, refetch }: { fromDb: boolean; refetch: () => void }) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="border-brutal bg-card shadow-brutal p-6">
        <h2 className="text-2xl mb-2">Seed tools to Firestore</h2>
        <p className="font-medium mb-4 text-sm">
          Copies the 8 default tools from code into Firestore so you can edit them. Re-running overwrites every tool back to seed values.
        </p>
        <button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try { await seedFirestore(); toast.success("Seeded"); refetch(); }
            catch (e) { toast.error(e instanceof Error ? e.message : "Failed — check Firestore rules"); }
            finally { setBusy(false); }
          }}
          className="border-brutal bg-foreground text-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Database className="size-4" /> {busy ? "Seeding…" : fromDb ? "Re-seed (overwrites)" : "Seed now"}
        </button>
      </div>

      <div className="border-brutal bg-card shadow-brutal p-6">
        <h2 className="text-2xl mb-2">Promote a user to admin</h2>
        <p className="font-medium mb-4 text-sm">Paste their UID (from Users tab) to grant admin.</p>
        <PromoteForm />
        <div className="mt-4 text-xs font-mono">
          Your UID: <span className="bg-background border-brutal px-2 py-0.5">{user?.uid}</span>
        </div>
      </div>

      <div className="md:col-span-2 border-brutal bg-brand-yellow shadow-brutal p-6">
        <h2 className="text-2xl mb-2">Required Firestore security rules</h2>
        <p className="font-medium mb-2 text-sm">Paste in Firebase Console → Firestore → Rules:</p>
        <pre className="border-brutal bg-background p-3 font-mono text-xs overflow-x-auto">{`rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function isAdmin() {
      return request.auth != null &&
        exists(/databases/$(db)/documents/admins/$(request.auth.uid));
    }
    match /tools/{slug} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /admins/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow write: if isAdmin();
    }
    match /users/{uid} {
      allow read: if isAdmin() || (request.auth != null && request.auth.uid == uid);
      allow write: if request.auth != null && request.auth.uid == uid;
      match /favorites/{slug} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }
  }
}`}</pre>
      </div>
    </div>
  );
}

function PromoteForm() {
  const [uid, setUid] = useState("");
  const [email, setEmail] = useState("");
  return (
    <div className="space-y-2">
      <input value={uid} onChange={(e) => setUid(e.target.value)} placeholder="User UID" className="w-full border-brutal bg-background px-3 py-2 font-mono text-sm" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email (optional, for label)" className="w-full border-brutal bg-background px-3 py-2 text-sm" />
      <button
        onClick={async () => {
          if (!uid) return;
          try {
            await setDoc(doc(db, "admins", uid), { email, grantedAt: serverTimestamp() });
            toast.success("Promoted");
            setUid(""); setEmail("");
          } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
        }}
        className="border-brutal bg-foreground text-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift"
      >
        Grant admin
      </button>
    </div>
  );
}
