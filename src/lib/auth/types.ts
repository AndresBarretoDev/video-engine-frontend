/**
 * OP Video Engine — Auth Types
 *
 * Roles from ARCHITECTURE.md:
 * Admin, Designer, Producer, QC, Client
 */

export type UserRole = 'admin' | 'designer' | 'producer' | 'qc' | 'client';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  message: string;
}
