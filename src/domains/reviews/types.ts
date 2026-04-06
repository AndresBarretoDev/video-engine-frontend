// Reviews domain types
// Handles QC review, client approval, comments, and status workflow

export type ReviewStatus =
  | 'draft'
  | 'pending-review'
  | 'in-review'
  | 'approved'
  | 'rejected'
  | 'revisions-requested';
export type CommentStatus = 'active' | 'resolved' | 'archived';
export type ApprovalRole = 'qc' | 'client' | 'admin' | 'producer';

export interface Review {
  id: string;
  projectId: string;
  versionId?: string;
  status: ReviewStatus;
  title?: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  completedAt?: string;
}

export interface ReviewApprover {
  id: string;
  reviewId: string;
  userId: string;
  role: ApprovalRole;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  approvedAt?: string;
  rejectedAt?: string;
}

export interface ReviewComment {
  id: string;
  reviewId: string;
  userId: string;
  content: string;
  status: CommentStatus;
  timestamp?: number; // video timestamp in seconds
  frameNumber?: number;
  componentId?: string;
  replies: ReviewComment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface ReviewChangeRequest {
  id: string;
  reviewId: string;
  commentId?: string;
  title: string;
  description: string;
  severity: 'minor' | 'standard' | 'critical';
  status: 'open' | 'in-progress' | 'completed' | 'wontfix';
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}

export interface ReviewTimeline {
  reviewId: string;
  events: ReviewEvent[];
}

export interface ReviewEvent {
  id: string;
  reviewId: string;
  type:
    | 'created'
    | 'submitted'
    | 'commented'
    | 'approved'
    | 'rejected'
    | 'change-requested'
    | 'completed';
  actor: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface ReviewMetrics {
  projectId: string;
  totalReviews: number;
  averageTimeInReview: number; // hours
  averageCommentsPerReview: number;
  changeRequestsPerReview: number;
  approvalRate: number; // percentage
  rejectionRate: number; // percentage
  period: 'today' | 'week' | 'month' | 'year';
}

export interface ReviewTemplate {
  id: string;
  name: string;
  organizationId: string;
  description?: string;
  sections: ReviewSection[];
  approvers: {
    role: ApprovalRole;
    count: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSection {
  id: string;
  title: string;
  description?: string;
  questions: {
    id: string;
    question: string;
    type: 'yes-no' | 'text' | 'multiple-choice';
    required: boolean;
    options?: string[];
  }[];
}

export interface ReviewChecklistItem {
  id: string;
  reviewId: string;
  title: string;
  description?: string;
  isChecked: boolean;
  checkedBy?: string;
  checkedAt?: string;
}
