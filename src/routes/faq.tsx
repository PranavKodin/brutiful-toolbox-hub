import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Unit Tools" },
      { name: "description", content: "Common questions about pricing, privacy, platforms, updates, and licensing for Unit Tools." },
      { property: "og:title", content: "FAQ — Unit Tools" },
      { property: "og:description", content: "Common questions about Unit Tools." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    }],
  }),
  component: FAQPage,
});

const faqs = [
  { q: "Are the tools really free?", a: "Yes. Every tool listed on this site is free to download and use forever. Some may eventually offer optional paid upgrades for power features, but the core stays free." },
  { q: "Do you collect any data?", a: "No analytics, no telemetry, no accounts required. Tools run locally. The only data we ever store is your email if you subscribe to the newsletter — and you can leave anytime." },
  { q: "What platforms are supported?", a: "Most tools ship for macOS, Windows, and Linux. A few are web-only. Each tool's detail page lists the exact platforms supported." },
  { q: "How do I get updates?", a: "Subscribe to the newsletter or check the Changelog page. Desktop tools also notify you in-app when a new version is available." },
  { q: "Can I use these commercially?", a: "Yes. Use them at work, in a studio, for client projects — no restrictions." },
  { q: "Can I request a tool?", a: "Absolutely. Drop us a note via the Contact page. Half the lineup came from user requests." },
  { q: "Is my data sent anywhere?", a: "No. Every tool processes data locally on your machine. Optional sync (when available) is end-to-end encrypted." },
  { q: "How do I report a bug?", a: "Email hello@unit-tools.dev with the tool, version, and what happened. Real human replies, usually within 48 hours." },
];

function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <section className="border-b-[3px] border-foreground bg-brand-blue">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="font-mono text-xs uppercase mb-2">// Help</div>
          <h1 className="text-5xl md:text-7xl">FAQ</h1>
          <p className="mt-4 max-w-2xl font-medium text-lg">
            Quick answers. If yours isn't here, <Link to="/contact" className="underline">drop us a line</Link>.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-brutal bg-card shadow-brutal-sm">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left font-display text-lg md:text-xl"
                  aria-expanded={isOpen}
                >
                  <span>{f.q}</span>
                  <span className={`border-brutal p-1 ${isOpen ? "bg-brand-pink" : "bg-brand-yellow"}`}>
                    {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 font-medium animate-pop-in">{f.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
