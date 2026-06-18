import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download, Sparkles, Shield, Zap, Star, Quote, Hammer, Heart } from "lucide-react";
import { tools, categories } from "@/lib/tools-data";
import { ToolCard } from "@/components/ToolCard";
import { Newsletter } from "@/components/Newsletter";
import { NewsTicker } from "@/components/NewsTicker";
import { posts } from "@/lib/blog-data";

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

const stats = [
  { v: "8", l: "Tools shipped" },
  { v: "42K", l: "Downloads" },
  { v: "1.2K", l: "Subscribers" },
  { v: "0", l: "Trackers" },
];

const testimonials = [
  { q: "Replaced four bloated apps with three of these.", a: "Maya R.", r: "Product Designer" },
  { q: "JSON Anvil saved my sanity during a migration.", a: "Devon K.", r: "Backend Engineer" },
  { q: "Looks unhinged. Works perfectly. Love it.", a: "Sora T.", r: "Indie Hacker" },
];

function Index() {
  const featured = tools.slice(0, 6);
  const latest = [...tools]
    .sort((a, b) => +new Date(b.releaseDate) - +new Date(a.releaseDate))
    .slice(0, 3);
  const recentPosts = posts.slice(0, 3);

  return (
    <>
      {/* News ticker */}
      <NewsTicker />

      {/* Hero */}
      <section className="relative border-b-[3px] border-foreground bg-brand-yellow overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" aria-hidden />
        <div className="absolute -top-10 -right-10 size-48 border-brutal bg-brand-pink rotate-12 animate-float hidden md:block" aria-hidden />
        <div className="absolute bottom-10 -left-10 size-32 border-brutal bg-brand-blue -rotate-6 animate-float hidden md:block" aria-hidden style={{ animationDelay: "1s" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-28 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 animate-pop-in">
            <div className="inline-flex items-center gap-2 border-brutal bg-background px-3 py-1 font-mono text-xs uppercase mb-6 shadow-brutal-sm">
              <span className="size-2 bg-brand-green inline-block animate-blink" />
              <Sparkles className="size-3" /> {tools.length} tools live · v3.0 just shipped
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-6">
              Small tools.<br />
              <span className="bg-foreground text-background px-2 inline-block animate-wiggle">Sharp results.</span>
            </h1>
            <p className="text-lg md:text-xl max-w-xl font-medium mb-8">
              A growing toolbox of focused mini-apps for designers, developers, and writers. Download once. Own forever. Updates land in your inbox.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/tools" className="border-brutal bg-foreground text-background px-6 py-3 font-bold uppercase shadow-brutal hover-lift inline-flex items-center gap-2">
                Browse all tools <ArrowRight className="size-4" />
              </Link>
              <a href="#newsletter" className="border-brutal bg-background px-6 py-3 font-bold uppercase shadow-brutal hover-lift">
                Get updates
              </a>
              <Link to="/roadmap" className="border-brutal bg-brand-pink px-6 py-3 font-bold uppercase shadow-brutal hover-lift">
                See roadmap
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-xs font-mono uppercase">
              <span className="inline-flex items-center gap-2"><Star className="size-3 fill-foreground" /> 4.9 avg rating</span>
              <span className="inline-flex items-center gap-2"><Download className="size-3" /> 42,000+ downloads</span>
              <span className="inline-flex items-center gap-2"><Shield className="size-3" /> Local-first</span>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Download, label: "One-click install", color: "bg-brand-pink" },
                { icon: Shield, label: "Local-first & private", color: "bg-brand-blue" },
                { icon: Zap, label: "Stupidly fast", color: "bg-brand-green" },
                { icon: Sparkles, label: "Free forever", color: "bg-brand-orange" },
              ].map((f, i) => (
                <div
                  key={f.label}
                  className={`${f.color} border-brutal shadow-brutal p-5 animate-pop-in hover-lift`}
                  style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                >
                  <f.icon className="size-7 mb-3" />
                  <div className="font-display text-sm">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b-[3px] border-foreground bg-background">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 divide-x-[3px] divide-foreground">
          {stats.map((s) => (
            <div key={s.l} className="px-4 py-8 text-center">
              <div className="font-display text-4xl md:text-6xl">{s.v}</div>
              <div className="font-mono text-xs uppercase tracking-wider mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Marquee */}
      <div className="border-b-[3px] border-foreground bg-foreground text-background overflow-hidden">
        <div className="flex gap-8 py-3 animate-marquee whitespace-nowrap font-display text-sm uppercase">
          {[...Array(2)].flatMap((_, i) =>
            tools.map((t) => (
              <span key={`${i}-${t.slug}`} className="flex items-center gap-8">
                <span className="text-brand-yellow">★</span>
                <span>{t.name}</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Latest releases */}
      <section className="bg-card border-b-[3px] border-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="font-mono text-xs uppercase mb-2">// Fresh out of the forge</div>
              <h2 className="text-4xl md:text-5xl">Latest releases</h2>
            </div>
            <Link to="/changelog" className="border-brutal bg-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift inline-flex items-center gap-2">
              Full changelog <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {latest.map((t, i) => (
              <Link
                to="/tools/$slug"
                params={{ slug: t.slug }}
                key={t.slug}
                className="border-brutal bg-background p-6 shadow-brutal hover-lift block animate-pop-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs uppercase bg-brand-green border-brutal px-2 py-1">NEW</span>
                  <span className="font-mono text-xs">{new Date(t.releaseDate).toLocaleDateString()}</span>
                </div>
                <div className="font-display text-2xl">{t.name}</div>
                <div className="font-mono text-xs uppercase mt-1">v{t.version}</div>
                <p className="mt-3 font-medium">{t.tagline}</p>
                <ul className="mt-4 space-y-1 text-sm font-medium">
                  {t.changelog[0]?.notes.slice(0, 2).map((n) => (
                    <li key={n} className="flex gap-2"><span className="text-brand-pink">→</span> {n}</li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

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

      {/* Categories */}
      <section className="bg-brand-blue border-y-[3px] border-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="font-mono text-xs uppercase mb-2">// Categories</div>
          <h2 className="text-4xl md:text-5xl mb-8">Pick your poison</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <Link
                key={c}
                to="/tools"
                className="border-brutal bg-background px-5 py-3 font-display text-lg shadow-brutal hover-lift"
              >
                {c} <span className="font-mono text-xs ml-1">({tools.filter(t => t.category === c).length})</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pitch / How it works */}
      <section className="bg-card border-b-[3px] border-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-3 gap-6">
          {[
            { n: "01", t: "Pick a tool", d: "Browse the toolbox. Each tool does one thing well." },
            { n: "02", t: "Download it", d: "One click. No accounts. No installers asking for your soul." },
            { n: "03", t: "Get back to work", d: "Tools stay out of your way. Updates ship in your inbox." },
          ].map((s, i) => (
            <div
              key={s.n}
              className="border-brutal bg-background p-6 shadow-brutal hover-lift animate-pop-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="font-display text-5xl text-brand-pink">{s.n}</div>
              <h3 className="mt-3 text-2xl">{s.t}</h3>
              <p className="mt-2 font-medium">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="font-mono text-xs uppercase mb-2">// Word on the street</div>
        <h2 className="text-4xl md:text-5xl mb-10">Loved by makers</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={t.a}
              className={`border-brutal p-6 shadow-brutal hover-lift ${["bg-brand-yellow","bg-brand-pink","bg-brand-green"][i]}`}
            >
              <Quote className="size-6 mb-3" />
              <blockquote className="font-display text-xl leading-tight">"{t.q}"</blockquote>
              <figcaption className="mt-4 font-mono text-xs uppercase">{t.a} · {t.r}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Blog preview */}
      <section className="bg-card border-y-[3px] border-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <div className="font-mono text-xs uppercase mb-2">// From the workshop</div>
              <h2 className="text-4xl md:text-5xl">Notes & dispatches</h2>
            </div>
            <Link to="/blog" className="border-brutal bg-background px-4 py-2 font-bold uppercase shadow-brutal-sm hover-lift inline-flex items-center gap-2">
              All posts <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {recentPosts.map((p, i) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="border-brutal bg-background shadow-brutal hover-lift block animate-pop-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={`border-b-[3px] border-foreground p-5 bg-brand-${p.color}`}>
                  <span className="font-mono text-xs uppercase border-brutal bg-background px-2 py-1">{p.tag}</span>
                </div>
                <div className="p-5">
                  <div className="font-mono text-xs uppercase mb-2">{new Date(p.date).toLocaleDateString()} · {p.readTime}</div>
                  <h3 className="text-2xl">{p.title}</h3>
                  <p className="mt-2 font-medium text-sm">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Built by one CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="border-brutal bg-foreground text-background p-10 md:p-16 shadow-brutal-lg relative overflow-hidden">
          <div className="absolute inset-0 stripes opacity-10 pointer-events-none" aria-hidden />
          <div className="relative grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <Hammer className="size-10 mb-4 animate-wiggle" />
              <h2 className="text-4xl md:text-6xl">Made by one human. <span className="text-brand-yellow">Yours forever.</span></h2>
              <p className="mt-4 font-medium text-background/80 max-w-2xl">
                No VCs. No subscription traps. Just small tools that respect your time and your disk space.
                If you like what you see, tell a friend or buy me a coffee.
              </p>
            </div>
            <div className="md:col-span-4 flex flex-col gap-3">
              <Link to="/about" className="border-2 border-background bg-brand-yellow text-foreground px-5 py-3 font-bold uppercase shadow-brutal hover-lift inline-flex items-center justify-center gap-2">
                <Heart className="size-4" /> Read the story
              </Link>
              <Link to="/contact" className="border-2 border-background px-5 py-3 font-bold uppercase hover-lift inline-flex items-center justify-center">
                Say hi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <Newsletter />
      </section>
    </>
  );
}
