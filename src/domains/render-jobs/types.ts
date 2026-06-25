// Render Jobs domain types
// Handles render queue jobs, progress tracking, batch operations, and output management

export type RenderJobStatus =
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'paused';
export type RenderPriority = 'low' | 'normal' | 'high' | 'urgent';
export type OutputFormat =
  | 'mp4'
  | 'webm'
  | 'mov'
  | 'prores'
  | 'h264'
  | 'png-sequence';

export interface RenderJob {
  id: string;
  projectId: string;
  name: string;
  status: RenderJobStatus;
  priority: RenderPriority;
  createdBy: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  estimatedDuration?: number; // seconds
  actualDuration?: number; // seconds
  progress: number; // 0-100
  framesCurrent?: number;
  framesTotal?: number;
}

export interface RenderJobConfig {
  jobId: string;
  resolution: string; // e.g., "1920x1080"
  frameRate: number; // e.g., 24, 30, 60
  codec: string; // e.g., "h264", "prores"
  bitrate?: string; // e.g., "10mbps"
  crf?: number; // quality (0-51 for h264)
  outputFormat: OutputFormat;
  duration?: number; // seconds
  timeoutMinutes: number;
  retryCount: number;
  customSettings: Record<string, unknown>;
}

export interface RenderOutput {
  id: string;
  jobId: string;
  format: OutputFormat;
  fileSize: number; // bytes
  duration: number; // seconds
  width: number;
  height: number;
  frameRate: number;
  fileUrl: string;
  previewUrl?: string;
  createdAt: string;
}

export interface RenderProgress {
  jobId: string;
  status: RenderJobStatus;
  progress: number; // 0-100
  framesCurrent?: number;
  framesTotal?: number;
  estimatedTimeRemaining?: number; // seconds
  speed?: number; // frames per second
  currentFrame?: number;
  logs?: string[];
}

export interface RenderBatch {
  id: string;
  name: string;
  projectId: string;
  organizationId: string;
  jobIds: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'paused';
  priority: RenderPriority;
  createdBy: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
}

export interface RenderQueue {
  jobId: string;
  position: number;
  estimatedWaitTime?: number; // seconds
  queuedAt: string;
}

export interface RenderError {
  jobId: string;
  errorCode: string;
  errorMessage: string;
  stackTrace?: string;
  frame?: number;
  timestamp: string;
  isRetryable: boolean;
}

export interface RenderStatistics {
  organizationId: string;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  averageDuration: number; // seconds
  totalRenderTime: number; // seconds
  successRate: number; // 0-100
  averageQueueTime: number; // seconds
  period: 'today' | 'week' | 'month' | 'year';
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface RenderJobFilters {
  status?: RenderJobStatus | 'all';
  search?: string;
  priority?: RenderPriority | 'all';
  sort?: 'newest' | 'priority' | 'status';
  page?: number;
  pageSize?: number;
}

export interface RenderBatchFilters {
  status?: RenderBatch['status'] | 'all';
  search?: string;
}
