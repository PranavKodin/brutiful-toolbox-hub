import { useEffect, useState, useCallback } from "react";
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export function useFavorite(toolSlug: string) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsFav(false);
      return;
    }
    getDoc(doc(db, "users", user.uid, "favorites", toolSlug)).then((s) => setIsFav(s.exists()));
  }, [user, toolSlug]);

  const toggle = useCallback(async () => {
    if (!user) {
      toast("Sign in to save tools");
      navigate({ to: "/auth" });
      return;
    }
    setBusy(true);
    const ref = doc(db, "users", user.uid, "favorites", toolSlug);
    try {
      if (isFav) {
        await deleteDoc(ref);
        setIsFav(false);
      } else {
        await setDoc(ref, { toolSlug, createdAt: serverTimestamp() });
        setIsFav(true);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }, [user, isFav, toolSlug, navigate]);

  return { isFav, toggle, busy, signedIn: !!user };
}
