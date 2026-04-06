// Assets domain types
// Handles media files (images, videos, audio, logos, fonts), upload, browsing, and organization

export type AssetType = 'image' | 'video' | 'audio' | 'font' | 'document';
export type AssetCategory =
  | 'logo'
  | 'background'
  | 'footage'
  | 'music'
  | 'sfx'
  | 'graphic'
  | 'font'
  | 'other';
export type AssetStatus =
  | 'uploading'
  | 'ready'
  | 'processing'
  | 'failed'
  | 'archived';

export interface Asset {
  id: string;
  name: string;
  description?: string;
  type: AssetType;
  category?: AssetCategory;
  status: AssetStatus;
  fileSize: number; // bytes
  duration?: number; // seconds, for video/audio
  width?: number; // pixels, for images/video
  height?: number; // pixels, for images/video
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  organizationId: string;
  brandId?: string;
  campaignId?: string;
  uploadedBy: string;
  tags: string[];
  metadata: Record<string, unknown>;
  uploadedAt: string;
  updatedAt: string;
}

export interface AssetFolder {
  id: string;
  name: string;
  organizationId: string;
  parentFolderId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetVersion {
  id: string;
  assetId: string;
  versionNumber: number;
  url: string;
  fileSize: number;
  createdBy: string;
  createdAt: string;
  uploadedAt: string;
}

export interface AssetUsage {
  assetId: string;
  projectId: string;
  componentId?: string;
  usageCount: number;
  lastUsedAt: string;
}

export interface UploadProgress {
  assetId: string;
  fileName: string;
  totalSize: number;
  uploadedSize: number;
  progress: number; // 0-100
  status: 'uploading' | 'completed' | 'failed';
  error?: string;
}

export interface BrandAssets {
  brandId: string;
  logos: Asset[];
  colors: { name: string; hex: string }[];
  fonts: Asset[];
  backgroundImages: Asset[];
}
