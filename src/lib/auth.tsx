import { createContext, useCallback, useContext, useEffect, useMemo, useState, type Context, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthMode = "login" | "signup";

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  displayName: string;
  dialogOpen: boolean;
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  openAuth: (mode?: AuthMode) => void;
  setDialogOpen: (open: boolean) => void;
  signOut: () => Promise<void>;
};

// Same hot-reload guard as the cart context: keep one context object per session.
const hotData = import.meta.hot?.data;
const AuthContext =
  (hotData?.["authContext"] as Context<AuthContextValue | null> | undefined) ?? createContext<AuthContextValue | null>(null);
if (hotData) hotData["authContext"] = AuthContext;

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
      if (event === "SIGNED_IN") setDialogOpen(false);
      if (event === "SIGNED_OUT") queryClient.removeQueries({ queryKey: ["orders"] });
      if (event === "SIGNED_IN" || event === "USER_UPDATED") void queryClient.invalidateQueries({ queryKey: ["orders"] });
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient]);

  const openAuth = useCallback((m: AuthMode = "login") => {
    setMode(m);
    setDialogOpen(true);
  }, []);

  const signOut = useCallback(async () => {
    await queryClient.cancelQueries({ queryKey: ["orders"] });
    queryClient.removeQueries({ queryKey: ["orders"] });
    await supabase.auth.signOut();
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(() => {
    const meta = (user?.user_metadata ?? {}) as { full_name?: unknown };
    const displayName = typeof meta.full_name === "string" && meta.full_name ? meta.full_name : (user?.email ?? "");
    return { user, ready, displayName, dialogOpen, mode, setMode, openAuth, setDialogOpen, signOut };
  }, [user, ready, dialogOpen, mode, openAuth, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
