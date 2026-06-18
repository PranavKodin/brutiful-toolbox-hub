import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Calendar, HardDrive, Tag, Github, ExternalLink, Code2 } from "lucide-react";
import * as Icons from "lucide-react";
import { tools, getTool, colorClass, type Tool } from "@/lib/tools-data";
import { ToolCard } from "@/components/ToolCard";
import { useTool } from "@/hooks/use-tools";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = getTool(params.slug);
    // Seed fallback for SSR/SEO. Live data overrides client-side via useTool.
    if (!tool) {
      // Still allow page since Firestore may have it; we use a stub.
      return { slug: params.slug, fallback: null as Tool | null };
    }
    return { slug: params.slug, fallback: tool };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.fallback?.name ?? "Tool"} — Toolslab` },
      { name: "description", content: loaderData?.fallback?.description ?? "Open-source mini tool." },
      { property: "og:title", content: `${loaderData?.fallback?.name ?? "Tool"} — Toolslab` },
      { property: "og:description", content: loaderData?.fallback?.tagline ?? "" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `/tools/${loaderData?.slug}` },
    ],
    links: [{ rel: "canonical", href: `/tools/${loaderData?.slug}` }],
  }),
  component: ToolDetail,
});

function ToolDetail() {
  const { slug, fallback } = Route.useLoaderData();
  const { tool: live, loading } = useTool(slug);
  const tool = live ?? fallback;

  if (!tool) {
    if (loading) return <div className="mx-auto max-w-3xl px-4 py-20 font-mono">Loading…</div>;
    throw notFound();
  }

  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[tool.icon] ?? Icons.Box;
  const related = tools.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 3);
  const ghRepo = tool.githubUrl?.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");

  return (
    <>
      <section className={`${colorClass[tool.color]} border-b-[3px] border-foreground`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <Link to="/tools" className="inline-flex items-center gap-2 font-bold uppercase text-sm hover:underline mb-6">
            <ArrowLeft className="size-4" /> Back to all tools
          </Link>
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="border-brutal bg-background p-4 shadow-brutal">
                  <Icon className="size-10" />
                </div>
                <div>
                  <div className="font-mono text-xs uppercase">{tool.category}</div>
                  <h1 className="text-4xl md:text-6xl">{tool.name}</h1>
                </div>
              </div>
              <p className="text-xl md:text-2xl font-display mt-4">{tool.tagline}</p>
              <p className="mt-4 max-w-2xl text-lg font-medium">{tool.description}</p>
            </div>
            <aside className="lg:col-span-4 border-brutal bg-background shadow-brutal-lg p-6">
              <div className="font-display text-sm mb-4">Get it</div>
              {tool.githubUrl ? (
                <a
                  href={tool.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full border-brutal bg-foreground text-background px-4 py-3 font-bold uppercase shadow-brutal-sm hover-lift inline-flex items-center justify-between mb-3"
                >
                  <span className="inline-flex items-center gap-2"><Github className="size-4" /> View on GitHub</span>
                  <ExternalLink className="size-4" />
                </a>
              ) : (
                <div className="border-brutal bg-card p-3 text-sm font-medium mb-3">GitHub link coming soon.</div>
              )}
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="border-brutal bg-card p-3">
                  <dt className="font-mono text-xs uppercase flex items-center gap-1"><Tag className="size-3" /> Version</dt>
                  <dd className="font-display mt-1">{tool.version}</dd>
                </div>
                <div className="border-brutal bg-card p-3">
                  <dt className="font-mono text-xs uppercase flex items-center gap-1"><HardDrive className="size-3" /> Size</dt>
                  <dd className="font-display mt-1">{tool.size}</dd>
                </div>
                <div className="border-brutal bg-card p-3 col-span-2">
                  <dt className="font-mono text-xs uppercase flex items-center gap-1"><Calendar className="size-3" /> Released</dt>
                  <dd className="font-display mt-1">{new Date(tool.releaseDate).toLocaleDateString()}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* Code / GitHub embed */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-brutal bg-foreground text-background shadow-brutal-lg overflow-hidden">
          <div className="px-6 py-4 border-b-[3px] border-background/30 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 font-display text-xl"><Code2 className="size-5" /> Source code</div>
            {tool.githubUrl && (
              <a href={tool.githubUrl} target="_blank" rel="noreferrer" className="font-mono text-xs uppercase border-2 border-background px-3 py-1 hover:bg-background hover:text-foreground transition-colors inline-flex items-center gap-1">
                <Github className="size-3" /> {ghRepo ?? "Repo"} <ExternalLink className="size-3" />
              </a>
            )}
          </div>
          <div className="p-6 font-mono text-sm">
            {tool.githubUrl ? (
              <>
                <div className="opacity-60">// Clone the repo</div>
                <div className="mt-1 text-brand-yellow">git clone {tool.githubUrl}.git</div>
                <div className="mt-4 opacity-60">// Or download as zip</div>
                <a className="mt-1 underline text-brand-green block break-all" href={`${tool.githubUrl}/archive/refs/heads/main.zip`} target="_blank" rel="noreferrer">
                  {tool.githubUrl}/archive/refs/heads/main.zip
                </a>
                <div className="mt-4 opacity-60">// Browse the source</div>
                <a className="mt-1 underline text-brand-pink block break-all" href={tool.githubUrl} target="_blank" rel="noreferrer">{tool.githubUrl}</a>
              </>
            ) : (
              <div className="opacity-60">// No source URL configured yet for this tool.</div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 grid lg:grid-cols-2 gap-8">
        <div className="border-brutal bg-card p-8 shadow-brutal">
          <h2 className="text-3xl mb-6">Features</h2>
          <ul className="space-y-3">
            {tool.features.map((f) => (
              <li key={f} className="flex items-start gap-3 font-medium">
                <span className="border-brutal bg-brand-green p-1 mt-0.5"><Check className="size-3" /></span>
                {f}
              </li>
            ))}
            {tool.features.length === 0 && <li className="font-medium text-muted-foreground">No features listed yet.</li>}
          </ul>
        </div>
        <div className="border-brutal bg-card p-8 shadow-brutal">
          <h2 className="text-3xl mb-6">Requirements</h2>
          <ul className="space-y-3">
            {tool.requirements.map((r) => (
              <li key={r} className="border-l-4 border-foreground pl-3 font-medium">{r}</li>
            ))}
            {tool.requirements.length === 0 && <li className="font-medium text-muted-foreground">None listed.</li>}
          </ul>
          <div className="mt-6">
            <div className="font-display text-sm mb-2">Platforms</div>
            <div className="flex flex-wrap gap-2">
              {tool.platform.map((p) => (
                <span key={p} className="border-brutal bg-background px-3 py-1 font-mono text-xs uppercase">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {tool.changelog.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-3xl mb-6">Changelog</h2>
          <div className="border-brutal bg-card shadow-brutal divide-y-[3px] divide-foreground">
            {tool.changelog.map((c) => (
              <div key={c.version} className="p-6 grid md:grid-cols-4 gap-4">
                <div>
                  <div className="font-display text-xl">v{c.version}</div>
                  <div className="font-mono text-xs uppercase text-muted-foreground">{new Date(c.date).toLocaleDateString()}</div>
                </div>
                <ul className="md:col-span-3 space-y-1 list-disc list-inside font-medium">
                  {c.notes.map((n) => <li key={n}>{n}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-3xl mb-6">More {tool.category} tools</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        </section>
      )}
    </>
  );
}
