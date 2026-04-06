import { z } from 'zod';

// Auth validation schemas

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Auth session schema.
 * Note: Backend sets tokens via httpOnly cookies, not in the response body.
 * The login response contains { user, message }.
 */
export const authUserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'designer', 'producer', 'qc', 'client']),
  avatarUrl: z.string().url().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type AuthUserResponse = z.infer<typeof authUserResponseSchema>;

export const rolePermissionsSchema = z.record(
  z.enum(['admin', 'designer', 'producer', 'qc', 'client']),
  z.array(z.string())
);
