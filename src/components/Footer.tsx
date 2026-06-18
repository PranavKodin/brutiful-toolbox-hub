import { Link } from "@tanstack/react-router";
import { Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-[3px] border-foreground bg-foreground text-background mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-display text-2xl mb-3">UNIT/TOOLS</div>
            <p className="max-w-sm text-background/80">
              Small, sharp tools made by one person. No ads, no tracking, no nonsense.
            </p>
          </div>
          <div>
            <div className="font-display text-sm mb-3">Site</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/tools" className="hover:underline">All Tools</Link></li>
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-display text-sm mb-3">Elsewhere</div>
            <div className="flex gap-2">
              <a href="#" aria-label="GitHub" className="border-2 border-background p-2 hover:bg-brand-yellow hover:text-foreground"><Github className="size-4" /></a>
              <a href="#" aria-label="Twitter" className="border-2 border-background p-2 hover:bg-brand-yellow hover:text-foreground"><Twitter className="size-4" /></a>
              <a href="mailto:hello@unit-tools.dev" aria-label="Email" className="border-2 border-background p-2 hover:bg-brand-yellow hover:text-foreground"><Mail className="size-4" /></a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-background/30 flex flex-wrap justify-between gap-4 text-xs uppercase tracking-wider">
          <div>© {new Date().getFullYear()} Unit Tools. All rights reserved.</div>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
