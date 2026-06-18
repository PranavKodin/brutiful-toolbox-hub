import { Link } from "@tanstack/react-router";
import { Hammer, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/tools", label: "Tools" },
  { to: "/changelog", label: "Changelog" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/blog", label: "Blog" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b-[3px] border-foreground bg-background sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-xl">
            <span className="border-brutal bg-brand-yellow p-1.5 shadow-brutal-sm">
              <Hammer className="size-5" />
            </span>
            UNIT/TOOLS
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-2 font-bold uppercase text-sm hover:bg-brand-yellow hover:border-brutal"
                activeProps={{ className: "px-3 py-2 font-bold uppercase text-sm bg-foreground text-background" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/tools"
              className="ml-2 border-brutal bg-foreground px-4 py-2 font-bold uppercase text-sm text-background shadow-brutal-sm hover-lift"
            >
              Download
            </Link>
          </nav>

          <button
            className="lg:hidden border-brutal bg-background p-2 shadow-brutal-sm"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open && (
          <nav className="lg:hidden flex flex-col gap-2 pb-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="border-brutal px-3 py-2 font-bold uppercase bg-background"
                activeProps={{ className: "border-brutal px-3 py-2 font-bold uppercase bg-foreground text-background" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
