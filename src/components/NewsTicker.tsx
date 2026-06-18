import { Link } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { tools } from "@/lib/tools-data";

export function NewsTicker() {
  const items = [...tools]
    .sort((a, b) => +new Date(b.releaseDate) - +new Date(a.releaseDate))
    .slice(0, 6)
    .map((t) => ({
      label: `NEW · ${t.name} v${t.version} shipped`,
      slug: t.slug,
    }));

  const row = [...items, ...items];

  return (
    <div className="border-y-[3px] border-foreground bg-foreground text-background flex items-stretch overflow-hidden">
      <div className="hidden sm:flex items-center gap-2 bg-brand-yellow text-foreground px-4 border-r-[3px] border-foreground font-display text-sm whitespace-nowrap">
        <Megaphone className="size-4 animate-wiggle" />
        LATEST
        <span className="ml-1 inline-block size-2 bg-foreground animate-blink" aria-hidden />
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-marquee py-3 font-mono text-sm uppercase">
          {row.map((it, i) => (
            <Link
              key={i}
              to="/tools/$slug"
              params={{ slug: it.slug }}
              className="px-6 hover:text-brand-yellow inline-flex items-center gap-3"
            >
              <span className="text-brand-yellow">◆</span>
              {it.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
