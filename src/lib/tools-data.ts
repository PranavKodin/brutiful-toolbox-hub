export interface Tool {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  version: string;
  size: string;
  platform: string[];
  githubUrl?: string;
  releaseDate: string;
  color: "yellow" | "pink" | "blue" | "green" | "orange";
  icon: string;
  features: string[];
  changelog: { version: string; date: string; notes: string[] }[];
  requirements: string[];
  featured?: boolean;
  order?: number;
}

export const tools: Tool[] = [
  {
    slug: "pixel-ruler",
    name: "Pixel Ruler",
    tagline: "Measure anything on your screen.",
    description:
      "A no-nonsense on-screen ruler for designers and developers. Snap to edges, copy measurements, and export overlays. Built for people who care about every single pixel.",
    category: "Design",
    version: "2.1.0",
    size: "4.2 MB",
    platform: ["macOS", "Windows", "Linux"],
    githubUrl: "https://github.com/example/PLACEHOLDER",
    releaseDate: "2026-05-12",
    color: "yellow",
    icon: "Ruler",
    features: [
      "Horizontal & vertical guides",
      "Color picker built-in",
      "Keyboard-driven workflow",
      "Multi-monitor aware",
    ],
    changelog: [
      { version: "2.1.0", date: "2026-05-12", notes: ["Multi-monitor support", "Faster snap engine"] },
      { version: "2.0.0", date: "2026-02-01", notes: ["Rewritten in Rust", "New UI"] },
    ],
    requirements: ["64-bit OS", "100 MB free disk"],
  },
  {
    slug: "clip-vault",
    name: "ClipVault",
    tagline: "A clipboard that doesn't forget.",
    description:
      "Searchable clipboard history with snippets, smart pinning, and end-to-end encrypted sync. Never lose a copy again.",
    category: "Productivity",
    version: "1.4.2",
    size: "7.8 MB",
    platform: ["macOS", "Windows"],
    githubUrl: "https://github.com/example/PLACEHOLDER",
    releaseDate: "2026-04-22",
    color: "pink",
    icon: "Clipboard",
    features: ["Encrypted sync", "Markdown snippets", "Global hotkey", "Image & file history"],
    changelog: [
      { version: "1.4.2", date: "2026-04-22", notes: ["Sync bug fixes", "Faster search"] },
    ],
    requirements: ["macOS 12+", "Windows 10+"],
  },
  {
    slug: "json-anvil",
    name: "JSON Anvil",
    tagline: "Forge, format, and inspect JSON.",
    description:
      "Format, diff, query and validate JSON locally with zero network calls. Includes JSONPath, JMESPath, and schema validation.",
    category: "Developer",
    version: "3.0.1",
    size: "12.4 MB",
    platform: ["macOS", "Windows", "Linux", "Web"],
    githubUrl: "https://github.com/example/PLACEHOLDER",
    releaseDate: "2026-06-01",
    color: "blue",
    icon: "Braces",
    features: ["Local-only processing", "JSONPath & JMESPath", "Diff viewer", "Schema validation"],
    changelog: [
      { version: "3.0.1", date: "2026-06-01", notes: ["JMESPath added", "Dark mode polish"] },
    ],
    requirements: ["Modern browser or desktop OS"],
  },
  {
    slug: "tiny-png-press",
    name: "Tiny PNG Press",
    tagline: "Crush images without losing detail.",
    description:
      "Drag-and-drop image compression for PNG, JPG, WebP, and AVIF. Batch process thousands of files with quality presets.",
    category: "Media",
    version: "1.2.0",
    size: "9.1 MB",
    platform: ["macOS", "Windows"],
    githubUrl: "https://github.com/example/PLACEHOLDER",
    releaseDate: "2026-03-18",
    color: "green",
    icon: "Image",
    features: ["Batch processing", "WebP & AVIF output", "Lossless mode", "EXIF stripping"],
    changelog: [
      { version: "1.2.0", date: "2026-03-18", notes: ["AVIF support", "30% faster batches"] },
    ],
    requirements: ["64-bit OS"],
  },
  {
    slug: "focus-block",
    name: "FocusBlock",
    tagline: "Block distractions. Ship work.",
    description:
      "A minimalist website and app blocker with scheduled focus sessions, allowlists, and stat tracking. Bring back deep work.",
    category: "Productivity",
    version: "2.3.4",
    size: "5.6 MB",
    platform: ["macOS", "Windows"],
    githubUrl: "https://github.com/example/PLACEHOLDER",
    releaseDate: "2026-05-30",
    color: "orange",
    icon: "ShieldOff",
    features: ["Pomodoro built-in", "App + site blocking", "Weekly stats", "Hard mode lock"],
    changelog: [
      { version: "2.3.4", date: "2026-05-30", notes: ["New stats dashboard"] },
    ],
    requirements: ["macOS 13+", "Windows 11"],
  },
  {
    slug: "regex-forge",
    name: "Regex Forge",
    tagline: "Build regex without crying.",
    description:
      "Visual regex builder with live match highlighting, cheatsheet, and export to 10+ languages.",
    category: "Developer",
    version: "0.9.1",
    size: "3.2 MB",
    platform: ["Web"],
    githubUrl: "https://github.com/example/PLACEHOLDER",
    releaseDate: "2026-06-10",
    color: "yellow",
    icon: "Code2",
    features: ["Live highlighting", "Export to JS/Python/Go/Rust", "Cheatsheet sidebar", "Test cases"],
    changelog: [
      { version: "0.9.1", date: "2026-06-10", notes: ["Rust export", "UI polish"] },
    ],
    requirements: ["Any modern browser"],
  },
  {
    slug: "color-stack",
    name: "Color Stack",
    tagline: "Steal palettes from anywhere.",
    description:
      "Extract palettes from images, screenshots, or websites. Export to Figma, CSS, Tailwind, or Swift.",
    category: "Design",
    version: "1.1.0",
    size: "6.3 MB",
    platform: ["macOS", "Web"],
    githubUrl: "https://github.com/example/PLACEHOLDER",
    releaseDate: "2026-04-04",
    color: "pink",
    icon: "Palette",
    features: ["Image extraction", "Tailwind export", "OKLCH support", "WCAG contrast checker"],
    changelog: [
      { version: "1.1.0", date: "2026-04-04", notes: ["OKLCH support"] },
    ],
    requirements: ["macOS 13+ or any browser"],
  },
  {
    slug: "markdown-mill",
    name: "Markdown Mill",
    tagline: "Convert anything to clean Markdown.",
    description:
      "Paste HTML, PDFs, or docs and get clean Markdown out. Perfect for migrating notes and writing in any editor.",
    category: "Writing",
    version: "1.0.5",
    size: "4.8 MB",
    platform: ["macOS", "Windows", "Web"],
    githubUrl: "https://github.com/example/PLACEHOLDER",
    releaseDate: "2026-05-20",
    color: "blue",
    icon: "FileText",
    features: ["HTML / PDF / DOCX in", "Frontmatter generator", "Table cleanup", "Image extraction"],
    changelog: [
      { version: "1.0.5", date: "2026-05-20", notes: ["DOCX import"] },
    ],
    requirements: ["Modern browser or desktop OS"],
  },
];

export const categories = Array.from(new Set(tools.map((t) => t.category)));

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);

export const colorClass: Record<Tool["color"], string> = {
  yellow: "bg-brand-yellow",
  pink: "bg-brand-pink",
  blue: "bg-brand-blue",
  green: "bg-brand-green",
  orange: "bg-brand-orange",
};
