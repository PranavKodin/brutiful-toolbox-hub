import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { tools, categories } from "@/lib/tools-data";
import { ToolCard } from "@/components/ToolCard";
import { Newsletter } from "@/components/Newsletter";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "All Tools — Unit Tools" },
      { name: "description", content: `Browse all ${tools.length} mini tools — for design, code, writing, productivity, and media.` },
      { property: "og:title", content: "All Tools — Unit Tools" },
      { property: "og:description", content: "Browse all mini tools for design, code, writing, productivity, and media." },
      { property: "og:url", content: "/tools" },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return tools.filter((t) => {
      const matchesCat = cat === "All" || t.category === cat;
      const matchesQ = !term || [t.name, t.tagline, t.description, t.category].join(" ").toLowerCase().includes(term);
      return matchesCat && matchesQ;
    });
  }, [q, cat]);

  return (
    <>
      <section className="border-b-[3px] border-foreground bg-brand-pink">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="font-mono text-xs uppercase mb-3">// The toolbox</div>
          <h1 className="text-5xl md:text-7xl mb-4">All tools</h1>
          <p className="font-medium text-lg max-w-2xl">
            {tools.length} small apps. Search, filter, and grab whatever you need.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tools..."
              className="w-full border-brutal bg-background pl-10 pr-4 py-3 font-mono shadow-brutal-sm focus:outline-none"
              aria-label="Search tools"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`border-brutal px-4 py-2 font-bold uppercase text-sm shadow-brutal-sm hover-lift ${cat === c ? "bg-foreground text-background" : "bg-background"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="border-brutal bg-card p-12 text-center shadow-brutal">
            <h3 className="text-2xl">No tools matched.</h3>
            <p className="mt-2 font-medium">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        )}

        <div className="mt-20">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
