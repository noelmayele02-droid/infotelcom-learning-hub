import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AdminAuthState = {
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
};

/**
 * Subscribe to Supabase auth state and check admin role.
 * IMPORTANT: registers onAuthStateChange before getSession (race-safe).
 */
export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    loading: true,
    user: null,
    isAdmin: false,
  });

  useEffect(() => {
    let active = true;

    const checkRole = async (user: User | null) => {
      if (!user) {
        if (active) setState({ loading: false, user: null, isAdmin: false });
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!active) return;
      setState({ loading: false, user, isAdmin: !!data && !error });
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer DB call to avoid deadlocks in the auth callback.
      setTimeout(() => checkRole(session?.user ?? null), 0);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkRole(session?.user ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}