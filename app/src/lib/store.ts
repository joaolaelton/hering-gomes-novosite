"use client";

import { create } from 'zustand';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  init: () => () => void; // returns unsubscribe fn
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Call once in App root to sync session from Supabase
  init: () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      set({
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      });
    });
    return () => subscription.unsubscribe();
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      // Atualiza imediatamente sem esperar o onAuthStateChange
      set({
        isLoading: false,
        user: data.user,
        isAuthenticated: true,
        error: null,
      });
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    // onAuthStateChange will clear user
  },
}));
