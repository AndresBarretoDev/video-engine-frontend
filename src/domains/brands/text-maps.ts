// Brands domain strings — externalized for i18n and consistency
// Spec: SPEC-CROSS-005

export const brandsTextMaps = {
  // ─── Page titles & descriptions ───────────────────────────────────────────
  pageTitle: 'Brands',
  pageDescription: 'Manage brand identities, design tokens, and assets.',
  newBrandTitle: 'Create Brand',
  newBrandDescription: 'Define a new brand with its design tokens and assets.',
  editBrandTitle: 'Edit Brand',
  editBrandDescription: 'Update brand information and design tokens.',

  // ─── Brand list ───────────────────────────────────────────────────────────
  brands: 'Brands',
  myBrands: 'My Brands',
  allBrands: 'All Brands',
  createBrand: 'Create Brand',
  newBrand: 'New Brand',

  // ─── Brand selector (authoring) ────────────────────────────────────────────
  selectorLabel: 'Brand',
  selectorPlaceholder: 'Select a brand',
  selectorDefaultOption: 'Template default',
  selectorLoading: 'Loading brands…',

  // ─── Status labels ────────────────────────────────────────────────────────
  statusActive: 'Active',
  statusArchived: 'Archived',

  // ─── Empty states ─────────────────────────────────────────────────────────
  noBrandsTitle: 'No brands yet',
  noBrandsDescription:
    'Create your first brand to get started with video production.',

  // ─── Table / card headers ─────────────────────────────────────────────────
  columnName: 'Brand Name',
  columnStatus: 'Status',
  columnCreated: 'Created',
  columnActions: 'Actions',

  // ─── Brand detail ─────────────────────────────────────────────────────────
  brandName: 'Brand Name',
  brandSlug: 'Brand Slug',
  description: 'Description',
  isActive: 'Active',
  client: 'Client',
  clientId: 'Client ID',

  // ─── Brand configuration tabs ─────────────────────────────────────────────
  tabOverview: 'Overview',
  tabTokens: 'Design Tokens',
  tabAssets: 'Assets',
  tabSettings: 'Settings',

  // ─── Brand configuration sections ────────────────────────────────────────
  configuration: 'Configuration',
  brandTokens: 'Design Tokens',
  colors: 'Colors',
  typography: 'Typography',
  assets: 'Assets',
  defaults: 'Defaults',

  // ─── Color configuration ──────────────────────────────────────────────────
  colorPrimary: 'Primary Color',
  colorSecondary: 'Secondary Color',
  colorAccent: 'Accent Color',
  colorNeutral: 'Neutral Color',
  addColor: 'Add Color',
  colorHexPlaceholder: '#000000',
  colorHexHint: 'Hex format: #RRGGBB',

  // ─── Typography ───────────────────────────────────────────────────────────
  fontFamilyHeading: 'Heading Font',
  fontFamilyBody: 'Body Font',
  fontSizeBase: 'Base Font Size',
  lineHeightBase: 'Line Height',
  headingStyle: 'Heading Style',
  bodyStyle: 'Body Style',

  // ─── Brand assets ─────────────────────────────────────────────────────────
  logo: 'Logo',
  uploadLogo: 'Upload Logo',
  logoUrl: 'Logo URL',
  logoUrlPlaceholder: 'https://example.com/logo.svg',
  logoUrlHint: 'URL to your brand logo (SVG or PNG recommended)',
  logoVariants: 'Logo Variants',
  favicon: 'Favicon',
  backgroundImage: 'Background Image',

  // ─── Design token fields ──────────────────────────────────────────────────
  borderRadiusBase: 'Border Radius',
  spacingBase: 'Spacing Unit',
  customTokens: 'Custom Tokens',

  // ─── Defaults ────────────────────────────────────────────────────────────
  defaultResolution: 'Default Resolution',
  defaultFrameRate: 'Default Frame Rate',
  defaultDuration: 'Default Duration',
  defaultAspectRatio: 'Default Aspect Ratio',
  defaultOutputFormat: 'Default Output Format',
  watermark: 'Watermark',
  watermarkEnabled: 'Enable Watermark',
  watermarkPosition: 'Watermark Position',
  watermarkOpacity: 'Watermark Opacity',

  // ─── Client profile ───────────────────────────────────────────────────────
  clientProfile: 'Client Profile',
  clientName: 'Client Name',
  clientEmail: 'Client Email',
  phone: 'Phone',
  website: 'Website',
  industry: 'Industry',
  brandGuidelinesUrl: 'Brand Guidelines',
  contactPerson: 'Contact Person',

  // ─── Form labels ──────────────────────────────────────────────────────────
  labelName: 'Name',
  labelSlug: 'Slug',
  labelDescription: 'Description',
  labelClientId: 'Client ID',
  placeholderName: 'e.g. Acme Corp',
  placeholderSlug: 'e.g. acme-corp',
  placeholderDescription: 'Brief description of this brand',
  placeholderClientId: 'UUID of the client',

  // ─── Validation messages ──────────────────────────────────────────────────
  validationNameRequired: 'Brand name is required',
  validationNameTooLong: 'Name must be 255 characters or less',
  validationSlugRequired: 'Slug is required',
  validationSlugInvalid:
    'Slug must only contain lowercase letters, numbers, and hyphens',
  validationClientIdRequired: 'Client ID is required',
  validationClientIdInvalid: 'Client ID must be a valid UUID',
  validationColorFormat: 'Must be a valid hex color (e.g. #FF0000)',

  // ─── Actions ──────────────────────────────────────────────────────────────
  editBrand: 'Edit Brand',
  archiveBrand: 'Archive Brand',
  reactivateBrand: 'Reactivate Brand',
  deleteBrand: 'Delete Brand',
  duplicateBrand: 'Duplicate Brand',
  viewGuidelines: 'View Guidelines',
  downloadTokens: 'Download Tokens',
  saveChanges: 'Save Changes',
  cancelEdit: 'Cancel',

  // ─── Archive confirmation dialog ──────────────────────────────────────────
  archiveTitle: 'Archive Brand',
  archiveDescription:
    'Archiving this brand will disable it across all projects and components. Existing projects will not be affected, but no new content can be created using this brand.',
  archiveConfirm: 'Yes, archive brand',
  archiveCancel: 'Keep brand',

  // ─── Reactivate confirmation dialog ─────────────────────────────────────
  reactivateTitle: 'Reactivate Brand',
  reactivateDescription:
    'Reactivating this brand will make it available again for new projects and components.',
  reactivateConfirm: 'Yes, reactivate brand',
  reactivateCancel: 'Cancel',

  // ─── Success / error toasts ───────────────────────────────────────────────
  brandCreated: 'Brand created successfully',
  brandUpdated: 'Brand updated successfully',
  brandArchived: 'Brand archived',
  brandReactivated: 'Brand reactivated',
  brandDeleted: 'Brand deleted',
  tokensUpdated: 'Design tokens updated',
  colorsUpdated: 'Colors updated',
  defaultsUpdated: 'Defaults updated',
  errorCreate: 'Failed to create brand',
  errorUpdate: 'Failed to update brand',
  errorArchive: 'Failed to archive brand',
  errorReactivate: 'Failed to reactivate brand',
  errorSaveTokens: 'Failed to save design tokens',
  errorLoad: 'Failed to load brands',

  // ─── Tokens editor ────────────────────────────────────────────────────────
  tokensEditorTitle: 'Design Tokens',
  tokensEditorDescription: 'Configure brand colors and typography for video components.',
  labelColorPrimary: 'Primary Color',
  labelColorSecondary: 'Secondary Color',
  labelColorAccent: 'Accent Color',
  labelFontHeading: 'Heading Font',
  labelFontBody: 'Body Font',
  placeholderFontHeading: 'e.g. Futura, Inter, Montserrat',
  placeholderFontBody: 'e.g. Helvetica Neue, Arial, Open Sans',
  sectionColors: 'Colors',
  sectionCustomColors: 'Custom Colors',
  addCustomColor: 'Add Color',
  customColorName: 'Color Name',
  customColorNamePlaceholder: 'e.g. Background, CTA Hover, Border',
  removeCustomColor: 'Remove',
  sectionTypography: 'Typography',
  previewTitle: 'Preview',
  previewSampleText: 'The quick brown fox jumps over the lazy dog.',
  previewButton: 'Call to Action',
  saveTokens: 'Save Tokens',
  tokensSavedSuccess: 'Design tokens saved successfully',
} as const;
