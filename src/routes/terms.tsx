import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — Unit Tools" },
      { name: "description", content: "Terms of use for Unit Tools software and website." },
      { property: "og:title", content: "Terms — Unit Tools" },
      { property: "og:description", content: "Terms of use for Unit Tools." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: Terms,
});

function Terms() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-5xl mb-6">Terms</h1>
      <div className="space-y-6 font-medium">
        <p>By downloading and using Unit Tools software you agree to these terms.</p>
        <div className="border-brutal bg-card p-6 shadow-brutal">
          <h2 className="text-2xl mb-2">License</h2>
          <p>Tools are free for personal and commercial use. Redistribution requires written permission.</p>
        </div>
        <div className="border-brutal bg-card p-6 shadow-brutal">
          <h2 className="text-2xl mb-2">Warranty</h2>
          <p>Tools are provided "as is", without warranty of any kind. You use them at your own risk.</p>
        </div>
        <div className="border-brutal bg-card p-6 shadow-brutal">
          <h2 className="text-2xl mb-2">Changes</h2>
          <p>These terms may change. Material changes will be announced via the newsletter.</p>
        </div>
      </div>
    </section>
  );
}
