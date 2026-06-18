import { Link } from "@tanstack/react-router";
import { ArrowRight, Download } from "lucide-react";
import * as Icons from "lucide-react";
import { colorClass, type Tool } from "@/lib/tools-data";

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[tool.icon] ?? Icons.Box;
  return (
    <article className="border-brutal bg-card shadow-brutal hover-lift flex flex-col">
      <div className={`${colorClass[tool.color]} border-b-[3px] border-foreground p-5 flex items-start justify-between`}>
        <div className="border-brutal bg-background p-3">
          <Icon className="size-7" />
        </div>
        <span className="font-mono text-xs uppercase bg-background border-brutal px-2 py-1">
          v{tool.version}
        </span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
          {tool.category}
        </div>
        <h3 className="text-2xl mb-2">{tool.name}</h3>
        <p className="font-medium text-foreground/80 mb-5 flex-1">{tool.tagline}</p>
        <div className="flex gap-2">
          <Link
            to="/tools/$slug"
            params={{ slug: tool.slug }}
            className="flex-1 border-brutal bg-background px-3 py-2 font-bold uppercase text-sm shadow-brutal-sm hover-lift inline-flex items-center justify-center gap-2"
          >
            DETAILS <ArrowRight className="size-4" />
          </Link>
          <a
            href={tool.downloadUrl}
            className="border-brutal bg-foreground text-background px-3 py-2 font-bold uppercase text-sm shadow-brutal-sm hover-lift inline-flex items-center justify-center gap-2"
            aria-label={`Download ${tool.name}`}
          >
            <Download className="size-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
