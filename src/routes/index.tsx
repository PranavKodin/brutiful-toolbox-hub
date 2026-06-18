import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download, Sparkles, Shield, Zap } from "lucide-react";
import { tools } from "@/lib/tools-data";
import { ToolCard } from "@/components/ToolCard";
import { Newsletter } from "@/components/Newsletter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Unit Tools — Small, sharp tools for makers" },
      { name: "description", content: "Download tiny, focused tools for design, code, and writing. No ads. No tracking. Made by one person." },
      { property: "og:title", content: "Unit Tools — Small, sharp tools for makers" },
      { property: "og:description", content: "Tiny, focused tools for design, code, and writing." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const featured = tools.slice(0, 6);
  return (
    <>
      {/* Hero */}
      <section className="border-b-[3px] border-foreground bg-brand-yellow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-28 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 border-brutal bg-background px-3 py-1 font-mono text-xs uppercase mb-6 shadow-brutal-sm">
              <Sparkles className="size-3" /> {tools.length} tools shipped
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-6">
              Small tools.<br />
              <span className="bg-foreground text-background px-2">Sharp results.</span>
            </h1>
            <p className="text-lg md:text-xl max-w-xl font-medium mb-8">
              A growing toolbox of focused mini-apps for designers, developers, and writers. Download once. Own forever.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/tools" className="border-brutal bg-foreground text-background px-6 py-3 font-bold uppercase shadow-brutal hover-lift inline-flex items-center gap-2">
                Browse all tools <ArrowRight className="size-4" />
              </Link>
              <a href="#newsletter" className="border-brutal bg-background px-6 py-3 font-bold uppercase shadow-brutal hover-lift">
                Get updates
              </a>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Download, label: "One-click install", color: "bg-brand-pink" },
                { icon: Shield, label: "Local-first & private", color: "bg-brand-blue" },
                { icon: Zap, label: "Stupidly fast", color: "bg-brand-green" },
                { icon: Sparkles, label: "Free forever", color: "bg-brand-orange" },
              ].map((f) => (
                <div key={f.label} className={`${f.color} border-brutal shadow-brutal p-5`}>
                  <f.icon className="size-7 mb-3" />
                  <div className="font-display text-sm">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-b-[3px] border-foreground bg-background overflow-hidden">
        <div className="flex gap-8 py-3 animate-[scroll_30s_linear_infinite] whitespace-nowrap font-display text-sm uppercase">
          {[...Array(2)].flatMap((_, i) =>
            tools.map((t) => (
              <span key={`${i}-${t.slug}`} className="flex items-center gap-8">
                <span>★</span>
                <span>{t.name}</span>
              </span>
            ))
          )}
        </div>
        <style>{`@keyframes scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* Featured tools */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <div className="font-mono text-xs uppercase mb-2">// The toolbox</div>
            <h2 className="text-4xl md:text-6xl">Featured tools</h2>
          </div>
          <Link to="/tools" className="border-brutal bg-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift inline-flex items-center gap-2">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((t) => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>

      {/* Pitch */}
      <section className="border-y-[3px] border-foreground bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-3 gap-6">
          {[
            { n: "01", t: "Pick a tool", d: "Browse the toolbox. Each tool does one thing well." },
            { n: "02", t: "Download it", d: "One click. No accounts. No installers asking for your soul." },
            { n: "03", t: "Get back to work", d: "Tools stay out of your way. Updates ship in your inbox." },
          ].map((s) => (
            <div key={s.n} className="border-brutal bg-background p-6 shadow-brutal">
              <div className="font-display text-5xl text-brand-pink">{s.n}</div>
              <h3 className="mt-3 text-2xl">{s.t}</h3>
              <p className="mt-2 font-medium">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <Newsletter />
      </section>
    </>
  );
}
