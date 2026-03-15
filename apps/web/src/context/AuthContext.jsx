import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient.js';

const AuthContext = createContext();

const buildUserFromSession = (session) => {
  const user = session?.user;
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.user_metadata?.role || 'operator',
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
  };
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setCurrentUser(buildUserFromSession(data.session));
      setIsAuthLoading(false);
    };

    init();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(buildUserFromSession(session));
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const seen = localStorage.getItem('checkflow_onboarding_seen');
    if (!seen && currentUser) {
      setHasSeenOnboarding(false);
    }
    if (!currentUser) {
      setHasSeenOnboarding(true);
    }
  }, [currentUser]);

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const mappedUser = buildUserFromSession(data.session);
    setCurrentUser(mappedUser);

    const seen = localStorage.getItem('checkflow_onboarding_seen');
    if (!seen) {
      setHasSeenOnboarding(false);
    }

    return mappedUser;
  }, []);

  const signup = useCallback(async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'operator',
        },
      },
    });

    if (error) throw error;

    const mappedUser = buildUserFromSession(data.session);
    setCurrentUser(mappedUser);
    setHasSeenOnboarding(false);
    return mappedUser;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  }, []);

  const getCurrentUser = useCallback(() => currentUser, [currentUser]);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem('checkflow_onboarding_seen', 'true');
    setHasSeenOnboarding(true);
  }, []);

  const value = useMemo(() => ({ 
    currentUser,
    isAuthLoading,
    login,
    signup,
    logout,
    getCurrentUser,
    hasSeenOnboarding,
    completeOnboarding,
  }), [currentUser, isAuthLoading, login, signup, logout, getCurrentUser, hasSeenOnboarding, completeOnboarding]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
