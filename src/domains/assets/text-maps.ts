// Assets domain strings - externalized for i18n and consistency

export const assetsTextMaps = {
  // Page
  pageTitle: 'Asset Manager',
  pageDescription:
    'Manage logos, images, videos, audio, and fonts for your brands.',

  // Asset list
  assets: 'Assets',
  myAssets: 'My Assets',
  allAssets: 'All Types',
  uploadAsset: 'Upload Asset',
  browseAssets: 'Browse Assets',
  organizeAssets: 'Organize Assets',

  // Asset details
  assetName: 'Asset Name',
  description: 'Description',
  type: 'Type',
  category: 'Category',
  fileSize: 'File Size',
  dimensions: 'Dimensions',
  duration: 'Duration',
  uploadedBy: 'Uploaded By',
  uploadedAt: 'Uploaded',
  tags: 'Tags',
  mimeType: 'MIME Type',
  brand: 'Brand',

  // Asset types
  typeImage: 'Image',
  typeVideo: 'Video',
  typeAudio: 'Audio',
  typeFont: 'Font',
  typeDocument: 'Document',
  typeAll: 'All Types',

  // Filter labels
  filterByType: 'Filter by type',
  filterByBrand: 'Filter by brand',
  searchPlaceholder: 'Search assets…',
  allBrands: 'All Brands',

  // Categories
  categoryLogo: 'Logo',
  categoryBackground: 'Background',
  categoryFootage: 'Footage',
  categoryMusic: 'Music',
  categorySFX: 'Sound Effects',
  categoryGraphic: 'Graphic',
  categoryFont: 'Font',
  categoryOther: 'Other',

  // Status
  statusUploading: 'Uploading',
  statusReady: 'Ready',
  statusProcessing: 'Processing',
  statusFailed: 'Failed',
  statusArchived: 'Archived',

  // Folders
  folders: 'Folders',
  createFolder: 'Create Folder',
  folderName: 'Folder Name',
  moveAsset: 'Move Asset',
  selectFolder: 'Select Folder',

  // Upload dialog
  uploadDialogTitle: 'Upload Asset',
  uploadDialogDescription: 'Select a file to upload to the asset library.',
  dragDropHint: 'Drag & drop a file here, or click to select',
  dragDropActive: 'Drop the file here',
  selectFiles: 'Select Files',
  uploading: 'Uploading…',
  processingAsset: 'Processing asset…',
  uploadComplete: 'Upload complete',
  uploadFailed: 'Upload failed. Please try again.',
  retryUpload: 'Retry Upload',
  acceptedFormats:
    'Accepted: images, video, audio, fonts (.ttf, .woff, .woff2, .svg)',
  selectedFile: 'Selected file',
  uploadButton: 'Upload',
  cancelButton: 'Cancel',

  // Brand assets
  brandAssets: 'Brand Assets',
  logos: 'Logos',
  colors: 'Colors',
  fonts: 'Fonts',
  backgroundImages: 'Background Images',
  selectBrand: 'Select Brand',

  // Actions
  download: 'Download',
  preview: 'Preview',
  delete: 'Delete',
  viewDetail: 'View Detail',
  duplicate: 'Duplicate',
  viewVersions: 'View Versions',
  viewUsage: 'View Usage',

  // Delete confirmation
  deleteTitle: 'Delete Asset',
  deleteDescription:
    'This action cannot be undone. The asset will be permanently removed from the library.',
  deleteConfirm: 'Delete',
  deleteCancel: 'Cancel',

  // Empty state
  noAssetsTitle: 'No assets yet',
  noAssetsDescription: 'Upload your first asset to get started.',

  // Error messages
  errorLoad: 'Failed to load assets.',
  errorDelete: 'Failed to delete asset.',

  // Messages
  assetUploaded: 'Asset uploaded successfully',
  assetUpdated: 'Asset updated',
  assetDeleted: 'Asset deleted',
  folderCreated: 'Folder created',
  assetMoved: 'Asset moved',

  // Detail page
  detailTitle: 'Asset Detail',
  detailDescription: 'File information and metadata.',
  backToAssets: '← Back to Assets',
  noAssetFound: 'Asset not found.',
  metadataSection: 'Metadata'
} as const;
