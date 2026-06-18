import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Send } from "lucide-react";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
});

export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const key = "unit-tools-newsletter";
      const existing = JSON.parse(localStorage.getItem(key) || "[]") as string[];
      if (existing.includes(parsed.data.email)) {
        toast.info("You're already subscribed.");
      } else {
        existing.push(parsed.data.email);
        localStorage.setItem(key, JSON.stringify(existing));
        toast.success("Subscribed! Watch your inbox for new tools.");
      }
      setEmail("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={compact ? "" : "border-brutal bg-brand-yellow p-8 md:p-12 shadow-brutal-lg"}>
      {!compact && (
        <>
          <h2 className="text-3xl md:text-5xl mb-3">Get new tools in your inbox.</h2>
          <p className="mb-6 max-w-xl font-medium">
            One email when a new tool ships or an existing one gets a big update. No spam. Unsubscribe anytime.
          </p>
        </>
      )}
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
          className="border-brutal bg-background px-4 py-3 font-mono flex-1 focus:outline-none focus:shadow-brutal-sm"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={loading}
          className="border-brutal bg-foreground text-background px-6 py-3 font-bold uppercase shadow-brutal-sm hover-lift inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Send className="size-4" />
          Subscribe
        </button>
      </form>
    </section>
  );
}
