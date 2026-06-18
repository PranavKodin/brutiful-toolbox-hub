import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { tools } from "@/lib/tools-data";
import { posts } from "@/lib/blog-data";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = ["/", "/tools", "/about", "/contact", "/privacy", "/terms", "/changelog", "/roadmap", "/faq", "/blog"];
        const toolPaths = tools.map((t) => `/tools/${t.slug}`);
        const blogPaths = posts.map((p) => `/blog/${p.slug}`);
        const allPaths = [...staticPaths, ...toolPaths, ...blogPaths];
        const urls = allPaths
          .map((p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`)
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
