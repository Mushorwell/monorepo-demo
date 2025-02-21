import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthConfig, AuthState, AuthToken, DEFAULT_CONFIG } from './AuthModels';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      tokenData: null,
      lastActivity: Date.now(),
      isAuthenticated: false,

      setToken: (token: string) => {
        try {
          const tokenData = jwtDecode<AuthToken>(token);
          set({
            token,
            tokenData,
            isAuthenticated: true,
            lastActivity: Date.now(),
          });
        } catch (error) {
          console.error('Invalid token:', error);
        }
      },

      logout: () => {
        set({
          token: null,
          tokenData: null,
          isAuthenticated: false,
        });
      },

      updateActivity: () => {
        set({ lastActivity: Date.now() });
      },
    }),
    {
      name: DEFAULT_CONFIG.storageKey,
      partialize: (state) => ({ token: state.token }),
    }
  )
);
