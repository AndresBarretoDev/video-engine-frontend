// Users domain types
// Handles user profiles, team management, and role assignment

import type { UserRole } from '@/domains/auth/types';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  department?: string;
  teamId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  ownerId: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  user: UserProfile;
  role: UserRole;
  joinedAt: string;
}

export interface UserInvitation {
  id: string;
  email: string;
  teamId?: string;
  role: UserRole;
  status: 'pending' | 'accepted' | 'declined';
  expiresAt: string;
  createdAt: string;
}

export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  slackNotifications: boolean;
}
