export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  tag: string;
  color: "yellow" | "pink" | "blue" | "green" | "orange";
  body: string[];
}

export const posts: Post[] = [
  {
    slug: "shipping-json-anvil-3",
    title: "Shipping JSON Anvil 3.0 — a rewrite story",
    excerpt:
      "Why we rewrote our JSON tool from scratch, and what we learned about local-first apps along the way.",
    date: "2026-06-01",
    author: "Unit Tools",
    readTime: "6 min",
    tag: "Release",
    color: "blue",
    body: [
      "JSON Anvil started as a weekend project. Three years later it had become the slowest, most fragile tool in our lineup. So we did the unthinkable — we rewrote it.",
      "The new engine processes 100MB files locally without breaking a sweat. JMESPath joined JSONPath as a first-class query language. The diff viewer now highlights structural changes, not just text.",
      "The lesson? Sometimes a rewrite IS the right call. But only when you can name three concrete things the old version couldn't do.",
    ],
  },
  {
    slug: "brutalism-and-software",
    title: "Why our tools look like this",
    excerpt:
      "Thick borders. High contrast. No gradients. A short note on the brutalist aesthetic and why it suits indie tools.",
    date: "2026-05-18",
    author: "Unit Tools",
    readTime: "4 min",
    tag: "Design",
    color: "yellow",
    body: [
      "Brutalism in software is not about being ugly. It's about being honest — showing the user exactly what is happening, with no decorative chrome.",
      "Our buttons cast hard shadows because they're physical objects you click. Our borders are thick because they define real edges. Our type is loud because the words matter.",
      "It's a small rebellion against soft, rounded, gradient-soaked SaaS. We hope it gets out of your way.",
    ],
  },
  {
    slug: "focus-block-stats-deep-dive",
    title: "FocusBlock stats: what 10,000 sessions taught us",
    excerpt:
      "We crunched the (anonymized) numbers from FocusBlock. Here's what actually helps people ship work.",
    date: "2026-05-04",
    author: "Unit Tools",
    readTime: "8 min",
    tag: "Research",
    color: "orange",
    body: [
      "The average focus session is 41 minutes. Sessions over 90 minutes have a 22% lower completion rate. Shorter sprints win.",
      "Hard mode (no-bypass) sessions completed 38% more often than soft mode. Friction works.",
      "And the most-blocked site? You don't need us to tell you.",
    ],
  },
  {
    slug: "tool-roadmap-q3-2026",
    title: "Roadmap: what's next for Unit Tools",
    excerpt:
      "A peek at the tools shipping next quarter, including a long-requested font manager.",
    date: "2026-04-22",
    author: "Unit Tools",
    readTime: "3 min",
    tag: "Roadmap",
    color: "pink",
    body: [
      "Three new tools are in the oven: a font manager, a screen recorder, and a CSV grinder.",
      "We're also taking ClipVault to Linux and adding hardware key support across the lineup.",
      "Tell us what's missing — every tool we ship came from a request like yours.",
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
