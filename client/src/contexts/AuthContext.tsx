
import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Force stop loading after 3 seconds to prevent infinite spinner
        const timeout = setTimeout(() => {
            if (mounted) {
                console.warn("Auth initialization timed out forcing app load");
                setLoading(false);
            }
        }, 3000);

        // 1. Check active session on mount
        supabase.auth.getSession()
            .then(({ data: { session } }) => {
                if (mounted) {
                    setSession(session);
                    setUser(session?.user ?? null);
                }
            })
            .catch((err) => {
                console.error("Auth initialization error:", err);
            })
            .finally(() => {
                if (mounted) {
                    clearTimeout(timeout);
                    setLoading(false);
                }
            });

        // 2. Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                setSession(session);
                setUser(session?.user ?? null);
                // Also ensure loading is false when auth state changes (e.g. initial load)
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            clearTimeout(timeout);
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
