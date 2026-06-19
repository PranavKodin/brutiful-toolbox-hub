import { createFileRoute } from "@tanstack/react-router";
import { Newsletter } from "@/components/Newsletter";
import { useRoadmap } from "@/hooks/use-content";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Roadmap — Tools Lab" },
      { name: "description", content: "What we're building next. Vote, comment, and watch tools take shape in public." },
      { property: "og:title", content: "Roadmap — Tools Lab" },
      { property: "og:description", content: "What we're building next." },
      { property: "og:url", content: "/roadmap" },
    ],
    links: [{ rel: "canonical", href: "/roadmap" }],
  }),
  component: RoadmapPage,
});

const COLS = [
  { key: "shipped", label: "Shipped", color: "bg-brand-green" },
  { key: "in-progress", label: "In progress", color: "bg-brand-yellow" },
  { key: "next", label: "Next up", color: "bg-brand-pink" },
  { key: "wishlist", label: "Wishlist", color: "bg-brand-blue" },
] as const;

function RoadmapPage() {
  const { items } = useRoadmap();

  return (
    <>
      <section className="border-b-[3px] border-foreground bg-brand-orange">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="font-mono text-xs uppercase mb-2">// Building in public</div>
          <h1 className="text-5xl md:text-7xl">Roadmap</h1>
          <p className="mt-4 max-w-2xl font-medium text-lg">
            What's shipped, what's cooking, and what's next.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {COLS.map((col, i) => {
            const colItems = items.filter((it) => it.status === col.key);
            return (
              <div
                key={col.key}
                className="border-brutal bg-card shadow-brutal animate-pop-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={`${col.color} border-b-[3px] border-foreground p-4 font-display text-xl`}>
                  {col.label} <span className="font-mono text-xs">({colItems.length})</span>
                </div>
                <ul className="divide-y-[3px] divide-foreground">
                  {colItems.map((it) => (
                    <li key={it.id} className="p-4">
                      <div className="font-display">{it.title}</div>
                      <p className="text-sm mt-1 font-medium">{it.description}</p>
                    </li>
                  ))}
                  {colItems.length === 0 && (
                    <li className="p-4 text-sm font-mono text-muted-foreground">Nothing here yet.</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-16">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
