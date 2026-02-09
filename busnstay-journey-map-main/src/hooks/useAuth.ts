import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'passenger' | 'restaurant' | 'rider' | 'taxi' | 'hotel' | 'admin';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_approved: boolean;
  assigned_station_id: string | null;
  business_name: string | null;
  rating: number;
  is_online: boolean;
  total_trips: number;
  metadata: unknown;
  created_at: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    error: null,
  });

  // Fetch user profile
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data as UserProfile | null;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener FIRST (for ONGOING changes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        setState(prev => ({ ...prev, session, user: session?.user ?? null }));
        
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          if (isMounted) {
            setState(prev => ({ ...prev, profile, isLoading: false }));
          }
        } else {
          setState(prev => ({ ...prev, profile: null, isLoading: false }));
        }
      }
    );

    // INITIAL load
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        setState(prev => ({ ...prev, session, user: session?.user ?? null }));

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          if (isMounted) {
            setState(prev => ({ ...prev, profile }));
          }
        }
      } finally {
        if (isMounted) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign up with role
  const signUp = useCallback(async (
    email: string,
    password: string,
    role: UserRole = 'passenger',
    metadata?: { full_name?: string; phone?: string; business_name?: string }
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            role,
            full_name: metadata?.full_name,
          },
        },
      });

      if (error) throw error;

      // Update profile with additional metadata if user was created
      if (data.user) {
        await supabase
          .from('user_profiles')
          .update({
            phone: metadata?.phone,
            business_name: metadata?.business_name,
            role,
          })
          .eq('user_id', data.user.id);
      }

      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Sign up failed';
      setState(prev => ({ ...prev, error, isLoading: false }));
      return { data: null, error };
    }
  }, []);

  // Sign in
  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Sign in failed';
      setState(prev => ({ ...prev, error, isLoading: false }));
      return { data: null, error };
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({
      user: null,
      session: null,
      profile: null,
      isLoading: false,
      error: null,
    });
    // Navigate to auth page
    window.location.href = '/auth';
  }, []);

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<Omit<UserProfile, 'metadata'>>) => {
    if (!state.user) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates as Record<string, unknown>)
        .eq('user_id', state.user.id);

      if (error) throw error;

      const profile = await fetchProfile(state.user.id);
      setState(prev => ({ ...prev, profile }));
      
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Update failed' };
    }
  }, [state.user, fetchProfile]);

  // Check if user has specific role
  const hasRole = useCallback((role: UserRole) => {
    return state.profile?.role === role;
  }, [state.profile]);

  // Check if user is admin
  const isAdmin = useCallback(() => hasRole('admin'), [hasRole]);

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    updateProfile,
    hasRole,
    isAdmin,
    refetchProfile: () => state.user && fetchProfile(state.user.id),
  };
};

export default useAuth;
