import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Sparkles, Shield, Zap, Star, Quote, Hammer, Heart, Search, Wrench, Github } from "lucide-react";
import { categories } from "@/lib/tools-data";
import { useTools } from "@/hooks/use-tools";
import { ToolCard } from "@/components/ToolCard";
import { Newsletter } from "@/components/Newsletter";
import { NewsTicker } from "@/components/NewsTicker";
import { posts } from "@/lib/blog-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TOOLS LAB — Small, sharp tools for makers" },
      { name: "description", content: "A free, open-source toolbox of tiny apps for designers, developers, and writers. Browse, search, and grab the source on GitHub." },
      { property: "og:title", content: "TOOLS LAB — Small, sharp tools for makers" },
      { property: "og:description", content: "A free, open-source toolbox of tiny apps for designers, developers, and writers." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const testimonials = [
  { q: "Replaced four bloated apps with three of these.", a: "Maya R.", r: "Product Designer" },
  { q: "JSON Anvil saved my sanity during a migration.", a: "Devon K.", r: "Backend Engineer" },
  { q: "Looks unhinged. Works perfectly. Love it.", a: "Sora T.", r: "Indie Hacker" },
];

function Index() {
  const { tools } = useTools();
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const featured = tools.filter((t) => t.featured !== false).slice(0, 6);
  const latest = [...tools]
    .sort((a, b) => +new Date(b.releaseDate) - +new Date(a.releaseDate))
    .slice(0, 3);
  const recentPosts = posts.slice(0, 3);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/tools", search: { q: q.trim() || undefined } });
  }

  return (
    <>
      <NewsTicker />

      {/* HERO */}
      <section className="relative border-b-[3px] border-foreground bg-brand-yellow overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 animate-pop-in">
            <div className="inline-flex items-center gap-2 border-brutal bg-background px-3 py-1 font-mono text-xs uppercase mb-6 shadow-brutal-sm">
              <span className="size-2 bg-brand-green inline-block animate-blink" />
              <Wrench className="size-3" /> {tools.length} free open-source mini-apps
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-5 uppercase whitespace-pre-line">
              A TOOLBOX{"\u00a0\n"}
              <span className="bg-foreground text-background px-2 inline-block animate-wiggle">SMALL TOOLS</span>{"\n"}
              FOR MAKERS
            </h1>
            <p className="text-lg md:text-xl max-w-xl font-medium mb-7">
              Tiny apps that knows one thing well - productivity.
            </p>

            {/* Search bar */}
            <form onSubmit={submitSearch} className="border-brutal bg-background shadow-brutal flex items-stretch max-w-xl mb-6 focus-within:translate-x-[-2px] focus-within:translate-y-[-2px] transition-transform">
              <div className="pl-4 flex items-center"><Search className="size-5" /></div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search tools — try 'json', 'image', 'regex'…"
                className="flex-1 px-3 py-4 font-medium bg-transparent focus:outline-none"
                aria-label="Search tools"
              />
              <button type="submit" className="bg-foreground text-background px-5 font-bold uppercase text-sm inline-flex items-center gap-2 hover:bg-brand-pink hover:text-foreground transition-colors">
                Search <ArrowRight className="size-4" />
              </button>
            </form>

            <div className="flex flex-wrap gap-3 items-center">
              <Link to="/tools" className="border-brutal bg-foreground text-background px-7 py-4 font-display text-lg uppercase shadow-brutal hover-lift inline-flex items-center gap-3 group">
                Browse all tools
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#newsletter" className="border-brutal bg-transparent px-5 py-3 font-bold uppercase text-sm hover:bg-background transition-colors">
                Get updates
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono uppercase">
              <span className="inline-flex items-center gap-2"><Github className="size-3" /> Open source</span>
              <span className="inline-flex items-center gap-2"><Shield className="size-3" /> Local-first</span>
              <span className="inline-flex items-center gap-2"><Heart className="size-3" /> Built by one human</span>
            </div>
          </div>

          {/* CREATIVE BENTO — asymmetric, rotated, layered */}
          <div className="lg:col-span-5">
            <div className="relative h-[420px] md:h-[480px]">
              {/* Big rotated card */}
              <div className="absolute top-0 left-2 w-[58%] h-[58%] border-brutal bg-brand-pink shadow-brutal-lg -rotate-3 p-5 hover:-rotate-1 transition-transform animate-pop-in">
                <Zap className="size-9 mb-2" />
                <div className="font-display text-2xl leading-tight">Stupidly<br />fast</div>
                <div className="font-mono text-[10px] uppercase mt-2 opacity-70">// 0ms startup</div>
              </div>
              {/* Circle */}
              <div className="absolute top-4 right-0 size-36 md:size-44 border-brutal bg-brand-blue shadow-brutal rounded-full flex flex-col items-center justify-center text-center rotate-6 hover:rotate-3 transition-transform animate-pop-in" style={{ animationDelay: "0.08s" }}>
                <Shield className="size-8 mb-1" />
                <div className="font-display text-base px-3 leading-tight">Local-first<br />& private</div>
              </div>
              {/* Tall thin */}
              <div className="absolute bottom-0 left-0 w-[38%] h-[50%] border-brutal bg-brand-green shadow-brutal rotate-2 p-4 hover:rotate-0 transition-transform animate-pop-in" style={{ animationDelay: "0.16s" }}>
                <Sparkles className="size-7 mb-2" />
                <div className="font-display text-xl leading-tight">Free<br />forever</div>
                <div className="mt-3 inline-block border-brutal bg-background px-2 py-0.5 font-mono text-[10px] uppercase">$0</div>
              </div>
              {/* Wide bottom-right */}
              <div className="absolute bottom-4 right-2 w-[55%] h-[42%] border-brutal bg-brand-orange shadow-brutal-lg -rotate-2 p-4 hover:rotate-0 transition-transform animate-pop-in" style={{ animationDelay: "0.24s" }}>
                <Github className="size-7 mb-2" />
                <div className="font-display text-xl leading-tight">Source on<br />GitHub</div>
                <div className="font-mono text-[10px] uppercase mt-2 opacity-70">// MIT licensed</div>
              </div>
              {/* Little sticker */}
              <div className="absolute top-[42%] left-[42%] size-16 border-brutal bg-foreground text-background rounded-full flex items-center justify-center rotate-12 shadow-brutal-sm animate-float">
                <Star className="size-7 fill-brand-yellow text-brand-yellow" />
              </div>
            </div>
          </div>
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
                search={{ q: undefined }}
                className="border-brutal bg-background px-5 py-3 font-display text-lg shadow-brutal hover-lift"
              >
                {c} <span className="font-mono text-xs ml-1">({tools.filter(t => t.category === c).length})</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-card border-b-[3px] border-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-3 gap-6">
          {[
            { n: "01", t: "Pick a tool", d: "Browse the toolbox. Each tool does one thing well." },
            { n: "02", t: "Use it free", d: "Open it in the browser or grab the source from GitHub." },
            { n: "03", t: "Get back to work", d: "Tools stay out of your way. Updates ship when ready." },
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

      <section id="newsletter" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <Newsletter />
      </section>
    </>
  );
}
