// Reviews domain strings - externalized for i18n and consistency

export const reviewsTextMaps = {
  // Reviews
  reviews: 'Reviews',
  myReviews: 'My Reviews',
  createReview: 'Create Review',
  startReview: 'Start Review',
  reviewProject: 'Review Project',
  title: 'Review Title',
  description: 'Description',

  // Review status
  status: 'Status',
  statusDraft: 'Draft',
  statusPendingReview: 'Pending Review',
  statusInReview: 'In Review',
  statusApproved: 'Approved',
  statusRejected: 'Rejected',
  statusRevisionsRequested: 'Revisions Requested',

  // Approvers
  approvers: 'Approvers',
  addApprover: 'Add Approver',
  approverRole: 'Role',
  roleQC: 'QC',
  roleClient: 'Client',
  roleAdmin: 'Administrator',
  roleProducer: 'Producer',
  approvalStatus: 'Approval Status',
  approvalPending: 'Pending',
  approvalApproved: 'Approved',
  approvalRejected: 'Rejected',

  // Comments
  comments: 'Comments',
  addComment: 'Add Comment',
  leaveComment: 'Leave a comment',
  replies: 'Replies',
  reply: 'Reply',
  timestamp: 'Timestamp',
  frameNumber: 'Frame',
  resolveComment: 'Resolve',
  unresolveComment: 'Unresolve',
  deleteComment: 'Delete',
  editComment: 'Edit',

  // Change requests
  changeRequests: 'Change Requests',
  createChangeRequest: 'Create Change Request',
  changeRequestTitle: 'Title',
  changeRequestDescription: 'Description',
  severity: 'Severity',
  severityMinor: 'Minor',
  severityStandard: 'Standard',
  severityCritical: 'Critical',
  assignedTo: 'Assigned To',
  changeRequestStatus: 'Status',
  statusOpen: 'Open',
  statusInProgress: 'In Progress',
  statusCompleted: 'Completed',
  statusWontFix: "Won't Fix",

  // Timeline
  timeline: 'Timeline',
  activity: 'Activity',
  activityCreated: 'Review created',
  activitySubmitted: 'Review submitted',
  activityCommented: 'Comment added',
  activityApproved: 'Approved',
  activityRejected: 'Rejected',
  activityChangeRequested: 'Changes requested',
  activityCompleted: 'Review completed',

  // Checklist
  checklist: 'Checklist',
  addChecklistItem: 'Add Item',
  checklistItem: 'Item',
  markComplete: 'Mark Complete',
  markIncomplete: 'Mark Incomplete',

  // Feedback
  feedback: 'Feedback',
  approveFeedback: 'Approval Feedback',
  rejectFeedback: 'Rejection Reason',
  addFeedback: 'Add Feedback',

  // Templates
  templates: 'Review Templates',
  createTemplate: 'Create Template',
  templateName: 'Template Name',
  templateDescription: 'Description',
  sections: 'Sections',
  questions: 'Questions',
  questionType: 'Question Type',
  typeYesNo: 'Yes/No',
  typeText: 'Text',
  typeMultipleChoice: 'Multiple Choice',
  required: 'Required',

  // Metrics
  metrics: 'Review Metrics',
  totalReviews: 'Total Reviews',
  averageTimeInReview: 'Average Time in Review',
  averageCommentsPerReview: 'Avg Comments per Review',
  changeRequestsPerReview: 'Change Requests per Review',
  approvalRate: 'Approval Rate',
  rejectionRate: 'Rejection Rate',

  // Actions
  submitReview: 'Submit for Review',
  approve: 'Approve',
  reject: 'Reject',
  requestChanges: 'Request Changes',
  downloadFeedback: 'Download Feedback',
  shareFeedback: 'Share Feedback',
  viewTimeline: 'View Timeline',

  // Messages
  reviewCreated: 'Review created',
  reviewSubmitted: 'Review submitted to approvers',
  reviewApproved: 'Review approved',
  reviewRejected: 'Review rejected',
  changeRequested: 'Changes requested',
  commentAdded: 'Comment added',
  changeRequestCreated: 'Change request created',
  reviewCompleted: 'Review completed'
} as const;
