import { createFileRoute } from "@tanstack/react-router";
import { Newsletter } from "@/components/Newsletter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Unit Tools" },
      { name: "description", content: "Unit Tools is a one-person studio making small, focused, local-first software." },
      { property: "og:title", content: "About — Unit Tools" },
      { property: "og:description", content: "A one-person studio making small, focused, local-first software." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="border-b-[3px] border-foreground bg-brand-blue">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="font-mono text-xs uppercase mb-3">// About</div>
          <h1 className="text-5xl md:text-7xl">A studio of one.</h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 space-y-10 font-medium text-lg">
        <p>
          Unit Tools is a small studio building tiny, sharp software. Every tool is made by one
          person, polished obsessively, and shipped only when it's actually useful.
        </p>
        <div className="border-brutal bg-card p-8 shadow-brutal">
          <h2 className="text-3xl mb-4">The rules</h2>
          <ul className="space-y-3 list-disc list-inside">
            <li>No ads, ever.</li>
            <li>No tracking, ever.</li>
            <li>Local-first. Your data stays yours.</li>
            <li>Tools do one thing well.</li>
            <li>If a tool stops being useful, it gets retired — not bloated.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-3xl mb-4">Why brutalism?</h2>
          <p>
            Because honest software deserves an honest interface. No drop shadows pretending to be
            glass. No purple gradients. Just type, color, and enough contrast to read across the room.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <Newsletter />
      </section>
    </>
  );
}
