import { z } from 'zod';

// Reviews domain validation schemas

export const createReviewSchema = z.object({
  projectId: z.string().uuid(),
  versionId: z.string().uuid().optional(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional()
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const submitReviewSchema = z.object({
  reviewId: z.string().uuid(),
  approverIds: z.array(z.string().uuid())
});

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;

export const reviewCommentSchema = z.object({
  reviewId: z.string().uuid(),
  content: z.string().min(1).max(2000),
  timestamp: z.number().nonnegative().optional(),
  frameNumber: z.number().int().nonnegative().optional(),
  componentId: z.string().uuid().optional(),
  parentCommentId: z.string().uuid().optional()
});

export type ReviewCommentInput = z.infer<typeof reviewCommentSchema>;

export const approveReviewSchema = z.object({
  reviewId: z.string().uuid(),
  feedback: z.string().max(2000).optional()
});

export type ApproveReviewInput = z.infer<typeof approveReviewSchema>;

export const rejectReviewSchema = z.object({
  reviewId: z.string().uuid(),
  feedback: z.string().min(1).max(2000)
});

export type RejectReviewInput = z.infer<typeof rejectReviewSchema>;

export const createChangeRequestSchema = z.object({
  reviewId: z.string().uuid(),
  commentId: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(2000),
  severity: z.enum(['minor', 'standard', 'critical']),
  assignedTo: z.string().uuid().optional()
});

export type CreateChangeRequestInput = z.infer<
  typeof createChangeRequestSchema
>;

export const reviewChecklistItemSchema = z.object({
  reviewId: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  isChecked: z.boolean().default(false)
});

export type ReviewChecklistItemInput = z.infer<
  typeof reviewChecklistItemSchema
>;

export const createReviewTemplateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  sections: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      questions: z.array(
        z.object({
          question: z.string(),
          type: z.enum(['yes-no', 'text', 'multiple-choice']),
          required: z.boolean(),
          options: z.array(z.string()).optional()
        })
      )
    })
  ),
  approvers: z.array(
    z.object({
      role: z.enum(['qc', 'client', 'admin', 'producer']),
      count: z.number().int().positive()
    })
  )
});

export type CreateReviewTemplateInput = z.infer<
  typeof createReviewTemplateSchema
>;
