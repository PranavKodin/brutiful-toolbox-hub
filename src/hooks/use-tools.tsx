import { useEffect, useState, useCallback } from "react";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { tools as seedTools, type Tool } from "@/lib/tools-data";

const COL = "tools";

export function useTools() {
  const [tools, setTools] = useState<Tool[]>(seedTools);
  const [loading, setLoading] = useState(true);
  const [fromDb, setFromDb] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, COL), orderBy("order", "asc")));
      if (snap.empty) {
        setTools(seedTools);
        setFromDb(false);
      } else {
        setTools(snap.docs.map((d) => d.data() as Tool));
        setFromDb(true);
      }
    } catch {
      setTools(seedTools);
      setFromDb(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { tools, loading, fromDb, refetch };
}

export function useTool(slug: string) {
  const [tool, setTool] = useState<Tool | null>(() => seedTools.find((t) => t.slug === slug) ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, COL, slug));
        if (cancelled) return;
        if (snap.exists()) setTool(snap.data() as Tool);
        else setTool(seedTools.find((t) => t.slug === slug) ?? null);
      } catch {
        if (!cancelled) setTool(seedTools.find((t) => t.slug === slug) ?? null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { tool, loading };
}

export async function seedFirestore() {
  for (let i = 0; i < seedTools.length; i++) {
    const t = seedTools[i];
    await setDoc(doc(db, COL, t.slug), {
      ...t,
      featured: i < 6,
      order: i,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function saveTool(t: Tool) {
  await setDoc(doc(db, COL, t.slug), { ...t, updatedAt: serverTimestamp() }, { merge: true });
}

export async function removeTool(slug: string) {
  await deleteDoc(doc(db, COL, slug));
}
