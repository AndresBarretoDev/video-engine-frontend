// Render Jobs domain strings - externalized for i18n and consistency

export const renderJobsTextMaps = {
  // Render jobs
  renderJobs: 'Render Jobs',
  myRenderJobs: 'My Render Jobs',
  createRenderJob: 'Create Render Job',
  jobName: 'Job Name',
  projectName: 'Project',
  status: 'Status',
  priority: 'Priority',

  // Status values
  statusQueued: 'Queued',
  statusProcessing: 'Processing',
  statusCompleted: 'Completed',
  statusFailed: 'Failed',
  statusCancelled: 'Cancelled',
  statusPaused: 'Paused',

  // Priority values
  priorityLow: 'Low',
  priorityNormal: 'Normal',
  priorityHigh: 'High',
  priorityUrgent: 'Urgent',

  // Job configuration
  configuration: 'Configuration',
  resolution: 'Resolution',
  frameRate: 'Frame Rate',
  codec: 'Codec',
  bitrate: 'Bitrate',
  quality: 'Quality (CRF)',
  outputFormat: 'Output Format',
  duration: 'Duration',
  timeout: 'Timeout',
  retryCount: 'Retry Count',

  // Output formats
  formatMP4: 'MP4 (H.264)',
  formatWebM: 'WebM',
  formatMOV: 'QuickTime MOV',
  formatProRes: 'ProRes',
  formatH264: 'H.264',
  formatPNGSequence: 'PNG Sequence',

  // Progress
  progress: 'Progress',
  framesCurrent: 'Frames Rendered',
  framesTotal: 'Total Frames',
  estimatedTimeRemaining: 'Time Remaining',
  speed: 'Rendering Speed',
  currentFrame: 'Current Frame',
  estimatedDuration: 'Estimated Duration',
  actualDuration: 'Actual Duration',

  // Queue
  queue: 'Render Queue',
  queuePosition: 'Queue Position',
  estimatedWaitTime: 'Wait Time',
  moveUp: 'Move Up',
  moveDown: 'Move Down',
  jumpToFront: 'Jump to Front',

  // Batch operations
  batch: 'Batch',
  batchName: 'Batch Name',
  createBatch: 'Create Batch',
  addToBatch: 'Add to Batch',
  batchStatus: 'Batch Status',
  totalJobs: 'Total Jobs',
  completedJobs: 'Completed',
  failedJobs: 'Failed',

  // Output
  output: 'Output',
  outputFile: 'Output File',
  fileSize: 'File Size',
  viewOutput: 'View Output',
  downloadOutput: 'Download Output',
  viewPreview: 'View Preview',
  viewLogs: 'View Logs',

  // Errors
  errors: 'Errors',
  errorMessage: 'Error Message',
  errorCode: 'Error Code',
  stackTrace: 'Stack Trace',
  isRetryable: 'Can Retry',
  viewError: 'View Error',

  // Actions
  startJob: 'Start Job',
  pauseJob: 'Pause Job',
  resumeJob: 'Resume Job',
  cancelJob: 'Cancel Job',
  retryJob: 'Retry Job',
  deleteJob: 'Delete Job',
  prioritizeJob: 'Prioritize',

  // Statistics
  statistics: 'Statistics',
  successRate: 'Success Rate',
  averageRenderTime: 'Average Render Time',
  totalRenderTime: 'Total Render Time',
  averageQueueTime: 'Average Queue Time',

  // Messages
  jobCreated: 'Render job created',
  jobStarted: 'Render job started',
  jobCompleted: 'Render job completed',
  jobFailed: 'Render job failed',
  jobCancelled: 'Render job cancelled',
  batchCreated: 'Render batch created — jobs are now queued',
  batchCancelled: 'Batch cancelled',
  outputReady: 'Output ready for download',
  errorOccurred: 'An error occurred during rendering',

  // Send to Render dialog
  cancel: 'Cancel',
  sendToRenderConfirm: 'Send to Render',
  creatingBatch: 'Creating batch…',

  // Dashboard
  renderDashboard: 'Render Jobs',
  noBatches: 'No render batches yet',
  noBatchesDescription:
    'Select variations in the Data Engine and click "Send to Render" to create your first batch.',
  searchPlaceholder: 'Search batches…',
  filterByStatus: 'Filter by status',
  allStatuses: 'All statuses',
  batchProgress: (completed: number, total: number) =>
    `${completed} of ${total} jobs completed`,
  jobsCount: (n: number) => `${n} job${n === 1 ? '' : 's'}`,

  // Batch detail
  batchDetail: 'Batch Detail',
  cancelBatch: 'Cancel Batch',
  retryFailed: 'Retry Failed',
  downloadAll: 'Download All',
  confirmCancelBatch:
    'Are you sure you want to cancel all remaining jobs in this batch?',
  confirmRetryFailed: 'This will retry all failed jobs in the batch. Continue?',
  noJobs: 'No jobs in this batch',

  // Job card
  framesProgress: (current: number, total: number) =>
    `${current} / ${total} frames`,
  eta: (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `~${m}m ${s}s remaining` : `~${s}s remaining`;
  },
  renderSpeed: (fps: number) => `${fps.toFixed(1)} fps`,

  // Job drawer
  jobDetail: 'Job Detail',
  jobConfiguration: 'Configuration',
  logsSection: 'Logs',
  errorsSection: 'Errors',
  outputSection: 'Output',
  noLogs: 'No logs available',
  noErrors: 'No errors',
  copyUrl: 'Copy URL',
  urlCopied: 'URL copied',

  // Output card
  downloadFile: 'Download',
  fileSizeLabel: (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  },
  resolutionLabel: (w: number, h: number) => `${w}×${h}`,
  durationLabel: (seconds: number) => `${seconds}s`
} as const;
