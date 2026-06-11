// Projects domain strings — externalized for i18n and consistency
// Spec: SPEC-CROSS-005

export const projectsTextMaps = {
  // ─── Page titles & descriptions ───────────────────────────────────────────
  pageTitle: 'Projects',
  pageDescription: 'Manage your video campaigns and production projects.',
  newProjectTitle: 'Create Project',
  newProjectDescription: 'Start a new video production project.',
  editProjectTitle: 'Edit Project',
  editProjectDescription: 'Update project information and settings.',
  createVideoLabel: 'Create video',

  // ─── Project list ─────────────────────────────────────────────────────────
  projects: 'Projects',
  myProjects: 'My Projects',
  allProjects: 'All Projects',
  recentProjects: 'Recent Projects',
  createProject: 'Create Project',
  newProject: 'New Project',

  // ─── Status labels ────────────────────────────────────────────────────────
  statusDraft: 'Draft',
  statusInProgress: 'In Progress',
  statusReview: 'In Review',
  statusApproved: 'Approved',
  statusArchived: 'Archived',
  statusAll: 'All Statuses',

  // ─── Filter labels ────────────────────────────────────────────────────────
  filterStatus: 'Status',
  filterBrand: 'Brand',
  allBrands: 'All Brands',
  searchPlaceholder: 'Search projects…',

  // ─── Empty states ─────────────────────────────────────────────────────────
  noProjectsTitle: 'No projects yet',
  noProjectsDescription:
    'Create your first project to start producing videos at scale.',

  // ─── Table / card headers ─────────────────────────────────────────────────
  columnName: 'Project Name',
  columnBrand: 'Brand',
  columnStatus: 'Status',
  columnOwner: 'Owner',
  columnUpdated: 'Updated',
  columnActions: 'Actions',
  columnFormats: 'Formats',

  // ─── Project detail ───────────────────────────────────────────────────────
  projectName: 'Project Name',
  projectDescription: 'Description',
  status: 'Status',
  visibility: 'Visibility',
  owner: 'Owner',
  team: 'Team',
  brand: 'Brand',
  campaign: 'Campaign',
  createdAt: 'Created',
  updatedAt: 'Updated',
  publishedAt: 'Published',

  // ─── Visibility values ────────────────────────────────────────────────────
  visibilityPrivate: 'Private',
  visibilityTeam: 'Team',
  visibilityPublic: 'Public',

  // ─── Project settings ─────────────────────────────────────────────────────
  settings: 'Settings',
  projectSettings: 'Project Settings',
  autoSave: 'Auto Save',
  notifications: 'Notifications',
  collaborationMode: 'Collaboration Mode',
  allowClientReview: 'Allow Client Review',
  enableVersionControl: 'Version Control',
  maxVersions: 'Max Versions',

  // ─── Collaborators ────────────────────────────────────────────────────────
  collaborators: 'Collaborators',
  addCollaborator: 'Add Collaborator',
  removeCollaborator: 'Remove Collaborator',
  roleOwner: 'Owner',
  roleEditor: 'Editor',
  roleViewer: 'Viewer',
  roleCommenter: 'Commenter',

  // ─── Timeline ─────────────────────────────────────────────────────────────
  timeline: 'Timeline',
  startDate: 'Start Date',
  dueDate: 'Due Date',
  reviewDeadline: 'Review Deadline',
  approvalDeadline: 'Approval Deadline',

  // ─── Versions ─────────────────────────────────────────────────────────────
  versions: 'Versions',
  currentVersion: 'Current Version',
  versionHistory: 'Version History',
  createVersion: 'Create Version',

  // ─── Form labels ──────────────────────────────────────────────────────────
  labelName: 'Name',
  labelDescription: 'Description',
  labelBrand: 'Brand',
  labelTemplate: 'Template',
  labelVisibility: 'Visibility',
  labelFormats: 'Output Formats',
  placeholderName: 'e.g. Lidl Summer Campaign 2026',
  placeholderDescription: 'Brief description of this project',
  placeholderBrand: 'Select a brand',
  placeholderTemplate: 'Select a template (optional)',
  placeholderVisibility: 'Select visibility',

  // ─── Format options ───────────────────────────────────────────────────────
  format169: '16:9 Landscape',
  format916: '9:16 Portrait',
  format11: '1:1 Square',

  // ─── Validation messages ──────────────────────────────────────────────────
  validationNameRequired: 'Project name is required',
  validationNameTooLong: 'Name must be 255 characters or less',
  validationBrandIdInvalid: 'Brand ID must be a valid UUID',

  // ─── Actions ──────────────────────────────────────────────────────────────
  dataEngine: 'Data Engine',
  renderJobs: 'Render Jobs',
  editProject: 'Edit Project',
  archiveProject: 'Archive Project',
  reactivateProject: 'Reactivate Project',
  viewProject: 'View Project',
  saveChanges: 'Save Changes',
  cancelEdit: 'Cancel',

  // ─── Archive confirmation dialog ──────────────────────────────────────────
  archiveTitle: 'Archive Project',
  archiveDescription:
    'Archiving this project will hide it from the active list. Existing render jobs and assets will not be affected. This action can be undone.',
  archiveConfirm: 'Yes, archive project',
  archiveCancel: 'Keep project',

  // ─── Empty / not-found states ─────────────────────────────────────────────
  errorNotFound: 'Project not found.',
  noBrand: 'No brand',

  // ─── Success / error toasts ───────────────────────────────────────────────
  projectCreated: 'Project created successfully',
  projectUpdated: 'Project updated successfully',
  projectArchived: 'Project archived',
  projectReactivated: 'Project reactivated',
  projectDeleted: 'Project deleted',
  collaboratorAdded: 'Collaborator added',
  versionCreated: 'New version created',
  errorCreate: 'Failed to create project',
  errorUpdate: 'Failed to update project',
  errorArchive: 'Failed to archive project',
  errorReactivate: 'Failed to reactivate project',
  errorLoad: 'Failed to load projects',

  // ─── Reactivate confirmation dialog ───────────────────────────────────────
  reactivateTitle: 'Reactivate Project',
  reactivateDescription:
    'Reactivating this project will restore it to draft status and make it visible in the active list.',
  reactivateConfirm: 'Yes, reactivate project',
  reactivateCancel: 'Cancel',

  // ─── Status workflow ──────────────────────────────────────────────────────
  workflowStatus: 'Workflow',
  stepDraft: 'Draft',
  stepInProgress: 'In Progress',
  stepReview: 'Review',
  stepApproved: 'Approved',

  // ─── Transition actions ───────────────────────────────────────────────────
  startProduction: 'Start Production',
  submitForReview: 'Submit for Review',
  approve: 'Approve',
  requestChanges: 'Request Changes',

  // ─── Transition confirmations ─────────────────────────────────────────────
  approveTitle: 'Approve Project',
  approveDescription:
    'Approving this project marks it as final. It will be ready for rendering and delivery.',
  rejectTitle: 'Request Changes',
  rejectDescription:
    'This will send the project back to draft status for revisions. The team will need to resubmit for review.',
  confirmApprove: 'Yes, approve',
  confirmReject: 'Yes, request changes',
  confirmCancel: 'Cancel',

  // ─── Transition success toasts ────────────────────────────────────────────
  transitionStarted: 'Production started',
  transitionSubmitted: 'Submitted for review',
  transitionApproved: 'Project approved',
  transitionRejected: 'Changes requested — project returned to draft',
  errorTransition: 'Failed to update project status',
} as const;
