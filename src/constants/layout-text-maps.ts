/**
 * OP Video Engine — Layout Text Maps (Global)
 *
 * Shared layout strings for shell components.
 * Domain-specific strings live in their respective domain text-maps.
 *
 * Spec: SPEC-CROSS-005
 */

export const layoutTextMap = {
  /* App identity */
  app: {
    name: 'OP Video Engine',
    shortName: 'OPVE',
    tagline: 'Video Generation Platform'
  },

  /* Common actions */
  actions: {
    retry: 'Try again',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    archive: 'Archive',
    create: 'Create',
    search: 'Search',
    filter: 'Filter',
    clearFilters: 'Clear filters',
    loadMore: 'Load more',
    viewAll: 'View all',
    goBack: 'Go back',
    goToDashboard: 'Go to Dashboard'
  },

  /* Loading states */
  loading: {
    generic: 'Loading...',
    data: 'Loading data...',
    saving: 'Saving...',
    uploading: 'Uploading...'
  },

  /* Error states */
  errors: {
    generic: 'Something went wrong',
    notFound: 'Not found',
    unauthorized: 'You do not have permission to view this',
    retry: 'Please try again',
    networkError: 'Network error — check your connection'
  },

  /* Empty states */
  empty: {
    generic: 'Nothing here yet',
    genericDescription: 'Get started by creating your first item.'
  },

  /* Sidebar user section */
  userSection: {
    logout: 'Log out',
    profile: 'Profile',
    settings: 'Settings',
    logoutTitle: 'Close session',
    logoutDescription:
      'You are about to sign out. Any unsaved changes will be lost.',
    logoutConfirm: 'Sign out',
    logoutCancel: 'Stay'
  },

  /* Image upload */
  imageUpload: {
    clickToSelect: 'Click to select',
    dragAndDrop: 'or drag and drop file here',
    supportedFormats: 'JPG, PNG, WebP, SVG or GIF',
    changeImage: 'Change image',
    uploadFailed: 'Failed to upload file'
  },

  /* Role display names */
  roles: {
    admin: 'Admin',
    designer: 'Designer',
    producer: 'Producer',
    qc: 'QC',
    client: 'Client'
  }
} as const;
