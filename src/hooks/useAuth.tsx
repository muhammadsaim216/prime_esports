import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  username: string | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, username: string, discord?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsername = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (data?.username) {
      setUsername(data.username);
    }
  };

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();
    
    if (data?.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const initializeUser = async (currentSession: Session | null) => {
    setSession(currentSession);
    setUser(currentSession?.user ?? null);

    if (currentSession?.user) {
      // Wait for both admin check and username fetch to complete before setting loading to false
      await Promise.all([
        checkAdminRole(currentSession.user.id),
        fetchUsername(currentSession.user.id)
      ]);
    } else {
      setIsAdmin(false);
      setUsername(null);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Only handle sign in/out events here, not the initial session
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          initializeUser(session);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      initializeUser(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      return { error };
    }
    toast({ title: "Welcome back!", description: "You have successfully logged in." });
    return { error: null };
  };

  const signUp = async (email: string, password: string, username: string, discord?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { username, discord_id: discord }
      }
    });

    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      return { error };
    }

    toast({ title: "Account created!", description: "Welcome to Prime Esports!" });
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setUsername(null);
    toast({ title: "Logged out", description: "You have been logged out." });
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, username, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
