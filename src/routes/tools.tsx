import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { categories } from "@/lib/tools-data";
import { useTools } from "@/hooks/use-tools";
import { ToolCard } from "@/components/ToolCard";
import { Newsletter } from "@/components/Newsletter";

type ToolsSearch = { q?: string };

export const Route = createFileRoute("/tools")({
  validateSearch: (search: Record<string, unknown>): ToolsSearch => ({
    q: typeof search.q === "string" && search.q.length > 0 ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "All tools — Toolslab" },
      { name: "description", content: "Browse all mini tools — for design, code, writing, productivity, and media." },
      { property: "og:title", content: "All tools — Toolslab" },
      { property: "og:description", content: "Browse all mini tools for design, code, writing, productivity, and media." },
      { property: "og:url", content: "/tools" },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  const { q: initialQ } = Route.useSearch();
  const navigate = useNavigate();
  const { tools } = useTools();
  const [q, setQ] = useState(initialQ ?? "");
  const [cat, setCat] = useState<string>("All");

  // keep URL in sync (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      navigate({
        to: "/tools",
        search: { q: q.trim() || undefined },
        replace: true,
      });
    }, 250);
    return () => clearTimeout(t);
  }, [q, navigate]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return tools.filter((t) => {
      const matchesCat = cat === "All" || t.category === cat;
      const matchesQ = !term || [t.name, t.tagline, t.description, t.category].join(" ").toLowerCase().includes(term);
      return matchesCat && matchesQ;
    });
  }, [q, cat, tools]);

  return (
    <>
      <section className="border-b-[3px] border-foreground bg-brand-pink">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="font-mono text-xs uppercase mb-3">// The toolbox</div>
          <h1 className="text-5xl md:text-7xl mb-4">All tools</h1>
          <p className="font-medium text-lg max-w-2xl mb-6">
            {tools.length} small apps. Search, filter, and grab whatever you need.
          </p>
          <div className="border-brutal bg-background shadow-brutal flex items-stretch max-w-2xl">
            <div className="pl-4 flex items-center"><Search className="size-5" /></div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, category, or what it does…"
              className="flex-1 px-3 py-3 font-medium bg-transparent focus:outline-none"
              aria-label="Search tools"
              autoFocus
            />
            {q && (
              <button onClick={() => setQ("")} className="px-4 font-mono uppercase text-xs hover:bg-brand-yellow border-l-[3px] border-foreground">
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
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

        {filtered.length === 0 ? (
          <div className="border-brutal bg-card p-12 text-center shadow-brutal">
            <h3 className="text-2xl">No tools matched "{q}".</h3>
            <p className="mt-2 font-medium">Try a different search or category.</p>
          </div>
        ) : (
          <>
            <div className="font-mono text-xs uppercase mb-4">// {filtered.length} result{filtered.length === 1 ? "" : "s"}</div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((t) => <ToolCard key={t.slug} tool={t} />)}
            </div>
          </>
        )}

        <div className="mt-20">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
