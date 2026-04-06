'use client';

/**
 * OP Video Engine — Auth Context
 *
 * Provides authentication state to the entire app.
 * JWT is stored in httpOnly cookie by the NestJS backend.
 * This context only tracks the user profile from /auth/me.
 *
 * Usage:
 *   const { user, isAuthenticated, isLoading, logout } = useAuth();
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type {
  AuthState,
  AuthUser,
  LoginCredentials,
  LoginResponse
} from './types';

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  /* Check if user is already authenticated on mount */
  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await apiClient<AuthUser>(API_ENDPOINTS.auth.me);
        setState({ user, isAuthenticated: true, isLoading: false });
      } catch {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    }
    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { user } = await apiClient<LoginResponse>(
        API_ENDPOINTS.auth.login,
        {
          method: 'POST',
          data: credentials
        }
      );
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      setState({ user: null, isAuthenticated: false, isLoading: false });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient(API_ENDPOINTS.auth.logout, { method: 'POST' });
    } finally {
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout
    }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
