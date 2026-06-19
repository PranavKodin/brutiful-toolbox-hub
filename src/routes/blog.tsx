import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { usePosts } from "@/hooks/use-content";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Tools Lab" },
      { name: "description", content: "Notes, dispatches, and release stories from the Tools Lab workshop." },
      { property: "og:title", content: "Blog — Tools Lab" },
      { property: "og:description", content: "Notes & release stories from the workshop." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogLayout,
});

function BlogLayout() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId === "/blog/$slug");
  if (isChild) return <Outlet />;

  const { posts } = usePosts();

  return (
    <>
      <section className="border-b-[3px] border-foreground bg-brand-pink">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="font-mono text-xs uppercase mb-2">// Workshop notes</div>
          <h1 className="text-5xl md:text-7xl">Blog</h1>
          <p className="mt-4 max-w-2xl font-medium text-lg">
            Release stories, design rants, and the occasional postmortem.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="border-brutal bg-card shadow-brutal hover-lift block animate-pop-in"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className={`bg-brand-${p.color} border-b-[3px] border-foreground p-5`}>
                <span className="font-mono text-xs uppercase border-brutal bg-background px-2 py-1">{p.tag}</span>
              </div>
              <div className="p-5">
                <div className="font-mono text-xs uppercase mb-2">
                  {new Date(p.date).toLocaleDateString()} · {p.readTime}
                </div>
                <h2 className="text-2xl">{p.title}</h2>
                <p className="mt-2 font-medium text-sm">{p.excerpt}</p>
                <div className="mt-4 font-mono text-xs uppercase">By {p.author}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
