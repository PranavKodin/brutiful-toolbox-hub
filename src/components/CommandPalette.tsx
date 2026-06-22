import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, ArrowRight, Command } from "lucide-react";
import { useTools } from "@/hooks/use-tools";

const pages: { label: string; to: string; hint: string }[] = [
  { label: "Home", to: "/", hint: "Landing" },
  { label: "All Tools", to: "/tools", hint: "Browse" },
  { label: "Changelog", to: "/changelog", hint: "What's new" },
  { label: "Roadmap", to: "/roadmap", hint: "What's coming" },
  { label: "Blog", to: "/blog", hint: "Notes" },
  { label: "About", to: "/about", hint: "The story" },
  { label: "Contact", to: "/contact", hint: "Say hi" },
  { label: "FAQ", to: "/faq", hint: "Common questions" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const { tools } = useTools();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const toolItems = tools.map((t) => ({
      kind: "tool" as const,
      label: t.name,
      hint: t.tagline,
      to: `/tools/${t.slug}`,
    }));
    const pageItems = pages.map((p) => ({ kind: "page" as const, ...p }));
    const all = [...pageItems, ...toolItems];
    if (!term) return all.slice(0, 8);
    return all
      .filter((i) => i.label.toLowerCase().includes(term) || i.hint.toLowerCase().includes(term))
      .slice(0, 10);
  }, [q, tools]);

  function go(to: string) {
    setOpen(false);
    navigate({ to });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[active];
      if (r) go(r.to);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-foreground/50 flex items-start justify-center p-4 pt-[12vh] animate-fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl border-brutal bg-background shadow-brutal-lg animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b-[3px] border-foreground px-4 py-3">
          <Search className="size-5" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search tools, pages…"
            className="flex-1 bg-transparent font-medium focus:outline-none"
          />
          <kbd className="font-mono text-[10px] uppercase border-brutal px-1.5 py-0.5">ESC</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto">
          {results.length === 0 && (
            <li className="px-4 py-6 text-sm text-muted-foreground text-center font-mono">No matches.</li>
          )}
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.to}`}>
              <button
                onClick={() => go(r.to)}
                onMouseEnter={() => setActive(i)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 border-b border-foreground/10 ${
                  i === active ? "bg-brand-yellow" : "bg-background"
                }`}
              >
                <div className="min-w-0">
                  <div className="font-bold truncate">{r.label}</div>
                  <div className="font-mono text-[10px] uppercase opacity-70 truncate">{r.kind} · {r.hint}</div>
                </div>
                <ArrowRight className="size-4 shrink-0" />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between gap-2 px-4 py-2 border-t-[3px] border-foreground font-mono text-[10px] uppercase">
          <span className="inline-flex items-center gap-1"><Command className="size-3" />K to toggle</span>
          <span>↑ ↓ to move · ↵ to open</span>
        </div>
      </div>
    </div>
  );
}
