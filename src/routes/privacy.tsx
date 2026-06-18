import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Unit Tools" },
      { name: "description", content: "How Unit Tools handles your data: it doesn't." },
      { property: "og:title", content: "Privacy — Unit Tools" },
      { property: "og:description", content: "How Unit Tools handles your data." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 prose-content">
      <h1 className="text-5xl mb-6">Privacy</h1>
      <div className="space-y-6 font-medium">
        <p>Unit Tools is built local-first. The short version: we don't collect or store your personal data through the tools themselves.</p>
        <div className="border-brutal bg-card p-6 shadow-brutal">
          <h2 className="text-2xl mb-2">What we collect</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Email address if you subscribe to the newsletter.</li>
            <li>Anonymous, aggregated download counts.</li>
          </ul>
        </div>
        <div className="border-brutal bg-card p-6 shadow-brutal">
          <h2 className="text-2xl mb-2">What we don't collect</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Your files, clipboard, or anything your tools process.</li>
            <li>Trackers, fingerprints, ad IDs.</li>
          </ul>
        </div>
        <p>Questions? Email <a className="underline" href="mailto:hello@unit-tools.dev">hello@unit-tools.dev</a>.</p>
      </div>
    </section>
  );
}
