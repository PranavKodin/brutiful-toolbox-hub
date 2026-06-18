import { createFileRoute } from "@tanstack/react-router";
import { Newsletter } from "@/components/Newsletter";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Roadmap — Unit Tools" },
      { name: "description", content: "What we're building next. Vote, comment, and watch tools take shape in public." },
      { property: "og:title", content: "Roadmap — Unit Tools" },
      { property: "og:description", content: "What we're building next." },
      { property: "og:url", content: "/roadmap" },
    ],
    links: [{ rel: "canonical", href: "/roadmap" }],
  }),
  component: RoadmapPage,
});

const columns = [
  {
    label: "Shipped",
    color: "bg-brand-green",
    items: [
      { t: "JSON Anvil 3.0", d: "Rewritten in Rust. New diff viewer." },
      { t: "FocusBlock stats dashboard", d: "Weekly insights & streaks." },
      { t: "Color Stack OKLCH", d: "Native OKLCH support across exports." },
    ],
  },
  {
    label: "In progress",
    color: "bg-brand-yellow",
    items: [
      { t: "Font Manager", d: "Activate, preview, and tag families. Mac-first." },
      { t: "CSV Grinder", d: "Stream, filter, and transform huge CSVs locally." },
      { t: "ClipVault for Linux", d: "Final native build, GTK + Qt themes." },
    ],
  },
  {
    label: "Next up",
    color: "bg-brand-pink",
    items: [
      { t: "Screen Recorder", d: "Tiny screen + cam capture with edit-on-export." },
      { t: "Regex Forge desktop", d: "Native app with file-batch testing." },
      { t: "Tool Sync", d: "Optional E2EE sync of settings across machines." },
    ],
  },
  {
    label: "Wishlist",
    color: "bg-brand-blue",
    items: [
      { t: "Mobile companions", d: "Quick capture apps for iOS/Android." },
      { t: "Tool packs", d: "Bundle discounts for studios." },
      { t: "Plugin API", d: "Third-party extensions to the toolbox." },
    ],
  },
];

function RoadmapPage() {
  return (
    <>
      <section className="border-b-[3px] border-foreground bg-brand-orange">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="font-mono text-xs uppercase mb-2">// Building in public</div>
          <h1 className="text-5xl md:text-7xl">Roadmap</h1>
          <p className="mt-4 max-w-2xl font-medium text-lg">
            What's shipped, what's cooking, and what's next. Subscribe to hear about the moment something lands.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {columns.map((col, i) => (
            <div
              key={col.label}
              className="border-brutal bg-card shadow-brutal animate-pop-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`${col.color} border-b-[3px] border-foreground p-4 font-display text-xl`}>{col.label}</div>
              <ul className="divide-y-[3px] divide-foreground">
                {col.items.map((it) => (
                  <li key={it.t} className="p-4">
                    <div className="font-display">{it.t}</div>
                    <p className="text-sm mt-1 font-medium">{it.d}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
