import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Unit Tools" },
      { name: "description", content: "Get in touch about bugs, ideas, partnerships, or just to say hi." },
      { property: "og:title", content: "Contact — Unit Tools" },
      { property: "og:description", content: "Get in touch with the Unit Tools studio." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(80),
  email: z.string().trim().email("Valid email required").max(255),
  message: z.string().trim().min(10, "Message must be at least 10 chars").max(2000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Message sent. I'll reply within 48 hours.");
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    }, 600);
  }

  return (
    <>
      <section className="border-b-[3px] border-foreground bg-brand-green">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="font-mono text-xs uppercase mb-3">// Contact</div>
          <h1 className="text-5xl md:text-7xl">Say hello.</h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl mb-4">Bugs, ideas, or just hi.</h2>
          <p className="font-medium mb-6">
            Drop a note and I'll get back to you within 48 hours. For bug reports include your OS and tool version.
          </p>
          <a href="mailto:hello@unit-tools.dev" className="border-brutal bg-foreground text-background px-4 py-3 font-bold uppercase shadow-brutal hover-lift inline-flex items-center gap-2">
            <Mail className="size-4" /> hello@unit-tools.dev
          </a>
        </div>
        <form onSubmit={submit} className="border-brutal bg-card p-6 shadow-brutal space-y-4">
          <div>
            <label htmlFor="name" className="block font-display text-sm mb-1">Name</label>
            <input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full border-brutal bg-background px-3 py-2 font-mono focus:outline-none" />
          </div>
          <div>
            <label htmlFor="email" className="block font-display text-sm mb-1">Email</label>
            <input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full border-brutal bg-background px-3 py-2 font-mono focus:outline-none" />
          </div>
          <div>
            <label htmlFor="message" className="block font-display text-sm mb-1">Message</label>
            <textarea id="message" rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} className="w-full border-brutal bg-background px-3 py-2 font-mono focus:outline-none resize-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full border-brutal bg-foreground text-background px-4 py-3 font-bold uppercase shadow-brutal-sm hover-lift inline-flex items-center justify-center gap-2 disabled:opacity-60">
            <Send className="size-4" /> Send message
          </button>
        </form>
      </section>
    </>
  );
}
