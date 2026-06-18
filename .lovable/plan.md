# Build Plan

You picked all four areas — this is a multi-step build. Here's the order and what each step delivers. The project uses **Firebase** (Auth + Firestore) from our last change, so all data work goes there.

---

## 1. Real data layer (Firestore)

Move tools out of the hardcoded `src/lib/tools-data.ts` into a Firestore `tools` collection. Each tool document fields:
- `slug, name, tagline, description, category, version, size, platforms[], color, icon`
- `githubUrl` (new — for the "code" section)
- `features[], requirements[], changelog[]`
- `featured` (boolean), `order` (number), `createdAt, updatedAt`
- Drop the fake `downloadUrl` / fake download counts entirely.

A one-time seed script populates Firestore with the current 8 tools so nothing disappears.

A small `useTools()` / `useTool(slug)` hook reads from Firestore on each page load (fresh-on-reload, no live subscription).

## 2. Admin role + admin panel

- Add an `admins` collection in Firestore: doc id = user uid, value `{ email }`.
- `useAuth()` exposes `isAdmin` (checks if `admins/{uid}` exists).
- Firestore rules: only admins can write to `tools` and `admins`; everyone can read `tools`.
- New `/admin` route (gated — redirects non-admins). Tabs:
  - **Tools** — list, add, edit, delete, reorder, toggle featured.
  - **Users** — list of profiles (name, email, signup date, favorites count).
  - **Changelog** — per-tool changelog editor.
- To give yourself admin: I'll provide one command/snippet to paste your UID into the `admins` collection (you can do it from Firebase console, or I'll add a temporary "claim admin if first user" button on the admin route — your call after the plan).

## 3. Per-tool page with code section

The route `/tools/$slug` already exists. Add:
- **"View source on GitHub"** card with repo URL, stars/forks if available via GitHub public API (fresh on reload).
- **README preview** — fetched from `https://raw.githubusercontent.com/{owner}/{repo}/main/README.md` and rendered with `react-markdown` + syntax highlighting.
- Remove the fake download buttons; replace with a single "Get it on GitHub" CTA (since downloads aren't real).

## 4. Landing page redesign

Fix all the complaints in one pass:
- **Hero**: clear headline like *"A toolbox of small, sharp apps for designers & developers"* + subhead explaining it's a free indie tool collection. No ambiguity about what the site is.
- **"Browse all tools" CTA**: bold filled brutalist button with arrow + hover lift, visually distinct from the secondary outline button next to it.
- **Search bar**: prominent search bar in the hero itself (not buried on `/tools`). Hitting enter routes to `/tools?q=...`.
- **The 4 boxes (currently dull squares)**: replace with creative asymmetric shapes — rotated cards with offset shadows, mixed sizes (bento-style), each with an icon, accent color, and micro-animation on hover. They'll feel like actual objects, not divs.
- Tools grid section labeled clearly with "Featured tools" + "View all" link.

## 5. Profile page polish

- Avatar + display name editor (already there, tighten the UI).
- "Saved tools" grid pulled live from Firestore favorites.
- Account info: email, signup date, sign-out button.
- Admin link if user is admin.

---

## Technical notes

- **Stack**: Firebase Auth (existing), Firestore (existing), TanStack Router, Tailwind v4. No Lovable Cloud / Supabase usage here.
- **Real-time = fresh on reload**: standard `getDocs` / `getDoc` — no `onSnapshot` listeners (cheaper).
- **Firestore rules** will need to be pasted into your Firebase console — I'll provide them.
- **GitHub URL per tool**: I'll seed with placeholder repo URLs (e.g. your username/tool-name); you swap real ones via the admin panel.
- I'll keep `src/lib/tools-data.ts` only as the seed source, then delete it after seed runs.

---

## Order I'll build in

1. Firestore schema + seed + `useTools` hook + admin role setup
2. Admin panel (tools CRUD, users list, changelog editor)
3. Per-tool page rework (GitHub + README)
4. Landing page redesign (hero, search, 4 creative shape boxes, CTAs)
5. Profile page polish

This is roughly 8–12 file changes per step. **Approve and I'll start with step 1**, or tell me to reorder / drop anything.