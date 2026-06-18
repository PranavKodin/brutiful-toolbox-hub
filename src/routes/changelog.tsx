import { createFileRoute, Link } from "@tanstack/react-router";
import { tools } from "@/lib/tools-data";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — Unit Tools" },
      { name: "description", content: "Every release, every fix, every tiny improvement across the Unit Tools lineup." },
      { property: "og:title", content: "Changelog — Unit Tools" },
      { property: "og:description", content: "Every release across the Unit Tools lineup." },
      { property: "og:url", content: "/changelog" },
    ],
    links: [{ rel: "canonical", href: "/changelog" }],
  }),
  component: ChangelogPage,
});

function ChangelogPage() {
  const entries = tools.flatMap((t) =>
    t.changelog.map((c) => ({ tool: t, ...c }))
  ).sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <>
      <section className="border-b-[3px] border-foreground bg-brand-green">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="font-mono text-xs uppercase mb-2">// Release log</div>
          <h1 className="text-5xl md:text-7xl">Changelog</h1>
          <p className="mt-4 max-w-2xl font-medium text-lg">
            Every shipped version across every tool. Newest first. Subscribe for releases.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="border-l-[3px] border-foreground pl-6 space-y-8">
          {entries.map((e, i) => (
            <article
              key={`${e.tool.slug}-${e.version}`}
              className="relative border-brutal bg-card p-6 shadow-brutal-sm hover-lift animate-pop-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="absolute -left-[34px] top-6 size-4 bg-foreground border-brutal" aria-hidden />
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Link
                  to="/tools/$slug"
                  params={{ slug: e.tool.slug }}
                  className="font-display text-xl underline-offset-2 hover:underline"
                >
                  {e.tool.name}
                </Link>
                <span className="font-mono text-xs uppercase border-brutal bg-background px-2 py-1">v{e.version}</span>
                <span className="font-mono text-xs uppercase ml-auto">{new Date(e.date).toLocaleDateString()}</span>
              </div>
              <ul className="space-y-1 font-medium">
                {e.notes.map((n) => (
                  <li key={n} className="flex gap-2"><span className="text-brand-pink">→</span> {n}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
