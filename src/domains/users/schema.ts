import { z } from 'zod';

// Users domain validation schemas

/**
 * Aligned with backend mapToUserProfile response.
 * Backend returns ISO string dates, not Date objects.
 */
export const userProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(255),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: z.enum(['admin', 'designer', 'producer', 'qc', 'client']),
  avatarUrl: z.string().url().nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  phone: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  teamId: z.string().uuid().nullable().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;

export const teamSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  organizationId: z.string().uuid(),
  ownerId: z.string().uuid(),
  memberCount: z.number().int().min(1),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type TeamInput = z.infer<typeof teamSchema>;

export const updateUserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  slackNotifications: z.boolean().optional()
});

export type UpdateUserPreferencesInput = z.infer<
  typeof updateUserPreferencesSchema
>;

/**
 * Aligned with backend InviteUserDto.
 * Backend accepts: email, name, role.
 * Backend @Transform uppercases role before @IsEnum validation.
 */
export const inviteUserSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(100),
  role: z.enum(['admin', 'designer', 'producer', 'qc', 'client'], {
    required_error: 'Please select a role.'
  })
});

export type InviteUserInput = z.infer<typeof inviteUserSchema>;

export const changeRoleSchema = z.object({
  role: z.enum(['admin', 'designer', 'producer', 'qc', 'client'], {
    required_error: 'Please select a role.'
  })
});

export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
