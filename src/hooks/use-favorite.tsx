import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
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
    supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("tool_slug", toolSlug)
      .maybeSingle()
      .then(({ data }) => setIsFav(!!data));
  }, [user, toolSlug]);

  const toggle = useCallback(async () => {
    if (!user) {
      toast("Sign in to save tools");
      navigate({ to: "/auth" });
      return;
    }
    setBusy(true);
    if (isFav) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("tool_slug", toolSlug);
      setIsFav(false);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, tool_slug: toolSlug });
      setIsFav(true);
    }
    setBusy(false);
  }, [user, isFav, toolSlug, navigate]);

  return { isFav, toggle, busy, signedIn: !!user };
}
