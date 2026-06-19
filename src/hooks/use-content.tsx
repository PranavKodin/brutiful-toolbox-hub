import { useCallback, useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { posts as seedPosts, type Post } from "@/lib/blog-data";

export type RoadmapItem = {
  id: string;
  title: string;
  description: string;
  status: "shipped" | "in-progress" | "next" | "wishlist";
  order?: number;
};

export const seedRoadmap: RoadmapItem[] = [
  { id: "json-anvil-3", title: "JSON Anvil 3.0", description: "Rewritten in Rust. New diff viewer.", status: "shipped", order: 0 },
  { id: "focusblock-stats", title: "FocusBlock stats dashboard", description: "Weekly insights & streaks.", status: "shipped", order: 1 },
  { id: "color-stack-oklch", title: "Color Stack OKLCH", description: "Native OKLCH support across exports.", status: "shipped", order: 2 },
  { id: "font-manager", title: "Font Manager", description: "Activate, preview, and tag families.", status: "in-progress", order: 3 },
  { id: "csv-grinder", title: "CSV Grinder", description: "Stream, filter, and transform CSVs locally.", status: "in-progress", order: 4 },
  { id: "clipvault-linux", title: "ClipVault for Linux", description: "Final native build, GTK + Qt themes.", status: "in-progress", order: 5 },
  { id: "screen-recorder", title: "Screen Recorder", description: "Tiny screen + cam capture.", status: "next", order: 6 },
  { id: "regex-forge-desktop", title: "Regex Forge desktop", description: "Native app with file-batch testing.", status: "next", order: 7 },
  { id: "tool-sync", title: "Tool Sync", description: "Optional E2EE sync across machines.", status: "next", order: 8 },
  { id: "mobile-companions", title: "Mobile companions", description: "Quick capture apps for iOS/Android.", status: "wishlist", order: 9 },
  { id: "tool-packs", title: "Tool packs", description: "Bundle discounts for studios.", status: "wishlist", order: 10 },
  { id: "plugin-api", title: "Plugin API", description: "Third-party extensions.", status: "wishlist", order: 11 },
];

const POSTS_COL = "posts";
const ROADMAP_COL = "roadmap";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [fromDb, setFromDb] = useState(false);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, POSTS_COL), orderBy("date", "desc")));
      if (snap.empty) { setPosts(seedPosts); setFromDb(false); }
      else { setPosts(snap.docs.map((d) => d.data() as Post)); setFromDb(true); }
    } catch {
      setPosts(seedPosts); setFromDb(false);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);
  return { posts, loading, fromDb, refetch };
}

export async function savePost(p: Post) {
  await setDoc(doc(db, POSTS_COL, p.slug), { ...p, updatedAt: serverTimestamp() }, { merge: true });
}
export async function removePost(slug: string) { await deleteDoc(doc(db, POSTS_COL, slug)); }
export async function seedPostsToDb() {
  for (const p of seedPosts) await setDoc(doc(db, POSTS_COL, p.slug), { ...p, createdAt: serverTimestamp() });
}

export function useRoadmap() {
  const [items, setItems] = useState<RoadmapItem[]>(seedRoadmap);
  const [fromDb, setFromDb] = useState(false);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, ROADMAP_COL), orderBy("order", "asc")));
      if (snap.empty) { setItems(seedRoadmap); setFromDb(false); }
      else { setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<RoadmapItem, "id">) }))); setFromDb(true); }
    } catch {
      setItems(seedRoadmap); setFromDb(false);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);
  return { items, loading, fromDb, refetch };
}

export async function saveRoadmapItem(it: RoadmapItem) {
  await setDoc(doc(db, ROADMAP_COL, it.id), { ...it, updatedAt: serverTimestamp() }, { merge: true });
}
export async function removeRoadmapItem(id: string) { await deleteDoc(doc(db, ROADMAP_COL, id)); }
export async function seedRoadmapToDb() {
  for (const it of seedRoadmap) await setDoc(doc(db, ROADMAP_COL, it.id), { ...it, createdAt: serverTimestamp() });
}
