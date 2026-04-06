// Projects domain types
// Handles video projects/campaigns, project settings, and metadata

export type ProjectStatus =
  | 'draft'
  | 'in-progress'
  | 'review'
  | 'approved'
  | 'archived';
export type ProjectVisibility = 'private' | 'team' | 'public';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  ownerId: string;
  teamId?: string;
  brandId?: string;
  brandName?: string;
  campaignId?: string;
  thumbnailUrl?: string;
  duration?: number;
  frameRate?: number;
  resolution?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ProjectSettings {
  projectId: string;
  autoSave: boolean;
  notifications: boolean;
  collaborationMode: 'edit' | 'view' | 'comment';
  defaultBrandId?: string;
  allowClientReview: boolean;
  enableVersionControl: boolean;
  maxVersions: number;
}

export interface ProjectMetadata {
  projectId: string;
  tags: string[];
  categories: string[];
  customFields: Record<string, string | number | boolean>;
  sourceFormat?: string;
  outputFormats?: string[];
  estimatedRenderTime?: number;
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  versionNumber: number;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

export interface ProjectCollaborator {
  id: string;
  projectId: string;
  userId: string;
  role: 'owner' | 'editor' | 'viewer' | 'commenter';
  addedAt: string;
  permissions: string[];
}

export interface ProjectTimeline {
  projectId: string;
  startDate: string;
  dueDate?: string;
  reviewDeadline?: string;
  approvalDeadline?: string;
  estimatedCompletion?: string;
}
