import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Hammer, Mail, Lock, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Bytebox" },
      { name: "description", content: "Sign in or create your Bytebox account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/profile" });
  }, [user, loading, navigate]);

  async function ensureProfile(uid: string, data: { username?: string | null; avatar_url?: string | null; email: string | null }) {
    await setDoc(
      doc(db, "users", uid),
      {
        username: data.username ?? null,
        avatar_url: data.avatar_url ?? null,
        email: data.email,
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const displayName = username || email.split("@")[0];
        await updateProfile(cred.user, { displayName });
        await ensureProfile(cred.user.uid, { username: displayName, avatar_url: null, email: cred.user.email });
        toast.success("Account created");
      } else if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back");
      } else {
        await sendPasswordResetEmail(auth, email);
        toast.success("Reset email sent if the account exists.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await ensureProfile(cred.user.uid, {
        username: cred.user.displayName,
        avatar_url: cred.user.photoURL,
        email: cred.user.email,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-brand-yellow border-b-[3px] border-foreground min-h-[80vh]">
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="border-brutal bg-background shadow-brutal-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="border-brutal bg-brand-pink p-2 shadow-brutal-sm"><Hammer className="size-5" /></span>
            <h1 className="font-display text-3xl">
              {mode === "signup" ? "CREATE ACCOUNT" : mode === "forgot" ? "RESET PASSWORD" : "SIGN IN"}
            </h1>
          </div>

          {mode !== "forgot" && (
            <>
              <button
                onClick={handleGoogle}
                disabled={busy}
                className="w-full border-brutal bg-background px-4 py-3 font-bold uppercase shadow-brutal-sm hover-lift mb-4 disabled:opacity-50"
              >
                Continue with Google
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[3px] flex-1 bg-foreground" />
                <span className="font-mono text-xs uppercase">or</span>
                <div className="h-[3px] flex-1 bg-foreground" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <label className="block">
                <span className="font-mono text-xs uppercase mb-1 flex items-center gap-1"><UserIcon className="size-3" /> Username</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border-brutal bg-background px-3 py-2 font-medium"
                  placeholder="yourhandle"
                />
              </label>
            )}
            <label className="block">
              <span className="font-mono text-xs uppercase mb-1 flex items-center gap-1"><Mail className="size-3" /> Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-brutal bg-background px-3 py-2 font-medium"
                placeholder="you@example.com"
              />
            </label>
            {mode !== "forgot" && (
              <label className="block">
                <span className="font-mono text-xs uppercase mb-1 flex items-center gap-1"><Lock className="size-3" /> Password</span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-brutal bg-background px-3 py-2 font-medium"
                  placeholder="••••••••"
                />
              </label>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full border-brutal bg-foreground text-background px-4 py-3 font-bold uppercase shadow-brutal hover-lift disabled:opacity-50"
            >
              {busy ? "..." : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-sm font-mono uppercase">
            {mode === "signin" && (
              <>
                <button onClick={() => setMode("signup")} className="underline">No account? Sign up</button>
                <div><button onClick={() => setMode("forgot")} className="underline">Forgot password?</button></div>
              </>
            )}
            {mode === "signup" && (
              <button onClick={() => setMode("signin")} className="underline">Already have an account? Sign in</button>
            )}
            {mode === "forgot" && (
              <button onClick={() => setMode("signin")} className="underline">Back to sign in</button>
            )}
          </div>

          <div className="mt-6 text-xs">
            <Link to="/" className="underline">← Back to home</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
