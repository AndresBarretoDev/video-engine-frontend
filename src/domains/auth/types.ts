// Auth domain types — re-export from canonical source
// All auth types are defined in @/lib/auth/types to avoid duplication

export type {
  UserRole,
  AuthUser,
  AuthState,
  LoginCredentials,
  LoginResponse
} from '@/lib/auth/types';

export interface AuthError {
  code:
    | 'INVALID_CREDENTIALS'
    | 'USER_NOT_FOUND'
    | 'SESSION_EXPIRED'
    | 'UNAUTHORIZED';
  message: string;
}
