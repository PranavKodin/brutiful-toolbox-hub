import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Download, Calendar, HardDrive, Tag } from "lucide-react";
import * as Icons from "lucide-react";
import { tools, getTool, colorClass, type Tool } from "@/lib/tools-data";
import { ToolCard } from "@/components/ToolCard";
import { toast } from "sonner";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = getTool(params.slug);
    if (!tool) throw notFound();
    return tool;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Tool"} — Bytebox` },
      { name: "description", content: loaderData?.description ?? "" },
      { property: "og:title", content: `${loaderData?.name} — Bytebox` },
      { property: "og:description", content: loaderData?.tagline ?? "" },
      { property: "og:type", content: "product" },
      { property: "og:url", content: `/tools/${loaderData?.slug}` },
    ],
    links: [{ rel: "canonical", href: `/tools/${loaderData?.slug}` }],
    scripts: loaderData
      ? [{
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: loaderData.name,
            description: loaderData.description,
            applicationCategory: loaderData.category,
            operatingSystem: loaderData.platform.join(", "),
            softwareVersion: loaderData.version,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }]
      : [],
  }),
  component: ToolDetail,
});

function ToolDetail() {
  const tool = Route.useLoaderData() as Tool;
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[tool.icon] ?? Icons.Box;
  const related = tools.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 3);

  function handleDownload(platform: string) {
    toast.success(`Starting ${tool.name} download for ${platform}`);
  }

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
              <div className="font-display text-sm mb-4">Download</div>
              <div className="space-y-2 mb-6">
                {tool.platform.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleDownload(p)}
                    className="w-full border-brutal bg-foreground text-background px-4 py-3 font-bold uppercase shadow-brutal-sm hover-lift inline-flex items-center justify-between"
                  >
                    <span className="inline-flex items-center gap-2"><Download className="size-4" /> {p}</span>
                    <span className="font-mono text-xs">{tool.size}</span>
                  </button>
                ))}
              </div>
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

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-8">
        <div className="border-brutal bg-card p-8 shadow-brutal">
          <h2 className="text-3xl mb-6">Features</h2>
          <ul className="space-y-3">
            {tool.features.map((f) => (
              <li key={f} className="flex items-start gap-3 font-medium">
                <span className="border-brutal bg-brand-green p-1 mt-0.5"><Check className="size-3" /></span>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="border-brutal bg-card p-8 shadow-brutal">
          <h2 className="text-3xl mb-6">Requirements</h2>
          <ul className="space-y-3">
            {tool.requirements.map((r) => (
              <li key={r} className="border-l-4 border-foreground pl-3 font-medium">{r}</li>
            ))}
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
