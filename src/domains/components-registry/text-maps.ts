// Components Registry domain strings - externalized for i18n and consistency

export const componentsRegistryTextMaps = {
  // Component list
  components: 'Components',
  componentRegistry: 'Component Registry',
  registerComponent: 'Register Component',
  browseComponents: 'Browse Components',
  myComponents: 'My Components',

  // Component details
  componentName: 'Component Name',
  componentSlug: 'Component Slug',
  description: 'Description',
  type: 'Type',
  status: 'Status',
  category: 'Category',
  tags: 'Tags',
  version: 'Version',

  // Component types
  typeAtom: 'Atom',
  typeMolecule: 'Molecule',
  typeOrganism: 'Organism',
  typeTemplate: 'Template',

  // Status
  statusDraft: 'Draft',
  statusPublished: 'Published',
  statusDeprecated: 'Deprecated',
  statusArchived: 'Archived',

  // Props & Configuration
  props: 'Properties',
  propSchema: 'Property Schema',
  propType: 'Type',
  propRequired: 'Required',
  propDefault: 'Default Value',
  propDescription: 'Description',
  addProperty: 'Add Property',

  // Prop types
  propTypeString: 'String',
  propTypeNumber: 'Number',
  propTypeBoolean: 'Boolean',
  propTypeArray: 'Array',
  propTypeObject: 'Object',
  propTypeEnum: 'Enumeration',

  // Preview
  preview: 'Preview',
  previewFrames: 'Preview Frames',
  previewVideo: 'Preview Video',
  uploadPreview: 'Upload Preview',
  generatePreview: 'Generate Preview',

  // Presets
  presets: 'Presets',
  createPreset: 'Create Preset',
  presetName: 'Preset Name',
  saveAsPreset: 'Save as Preset',
  usePreset: 'Use Preset',
  managedPresets: 'Managed Presets',

  // Library
  componentLibrary: 'Component Library',
  libraryName: 'Library Name',
  libraryVersion: 'Version',
  createLibrary: 'Create Library',
  addToLibrary: 'Add to Library',
  importLibrary: 'Import Library',
  exportLibrary: 'Export Library',

  // Dependencies
  dependencies: 'Dependencies',
  requires: 'Requires',
  extends: 'Extends',
  includes: 'Includes',
  manageDependencies: 'Manage Dependencies',

  // Usage
  usage: 'Usage',
  usageCount: 'Used',
  lastUsed: 'Last Used',
  neverUsed: 'Never Used',
  viewUsage: 'View Usage',

  // Documentation
  documentation: 'Documentation',
  sourceCode: 'Source Code',
  viewDocumentation: 'View Documentation',
  editDocumentation: 'Edit Documentation',

  // Actions
  editComponent: 'Edit Component',
  publishComponent: 'Publish Component',
  deprecateComponent: 'Deprecate Component',
  archiveComponent: 'Archive Component',
  deleteComponent: 'Delete Component',
  viewPreview: 'View Preview',

  // Register form
  newComponentTitle: 'Register Component',
  newComponentDescription: 'Register a new Remotion component in the catalog.',
  slugDescription: 'URL-friendly identifier (lowercase, hyphens only)',
  tagsDescription: 'Comma-separated tags for discovery',
  sourceUrlLabel: 'Source URL',
  sourceUrlDescription: 'Link to the component source code (optional)',
  documentationLabel: 'Documentation',
  documentationDescription: 'Usage notes, examples, or markdown documentation',
  creating: 'Registering...',
  create: 'Register Component',
  saving: 'Saving...',
  save: 'Save Changes',
  cancel: 'Cancel',
  backToList: 'Back to Components',

  // Messages
  componentRegistered: 'Component registered successfully',
  componentUpdated: 'Component updated',
  componentPublished: 'Component published',
  presetCreated: 'Preset created',
  libraryCreated: 'Library created',

  // Catalog page
  pageTitle: 'Component Catalog',
  pageDescription:
    'Browse and preview registered Remotion components for your video projects.',
  searchPlaceholder: 'Search components…',

  // Filter labels
  filterType: 'Type',
  filterBrand: 'Brand',
  filterAllTypes: 'All Types',
  filterAllBrands: 'All Brands',

  // Type option labels
  typeAll: 'All',

  // Empty state
  noComponentsTitle: 'No components found',
  noComponentsDescription:
    'No registered components match your current filters. Try adjusting your search.',
  noComponentsFiltered: 'No components match your filters.',

  // Error state
  errorLoad: 'Failed to load components',
  errorLoadDetail: 'Failed to load component details',

  // Detail page
  detailPageTitle: 'Component Detail',
  detailBackToList: 'Back to Components',

  // Metadata labels
  metaType: 'Type',
  metaVersion: 'Version',
  metaStatus: 'Status',
  metaTags: 'Tags',

  // Playground
  playgroundTitle: 'Playground',
  playgroundPropsLabel: 'Component Props (JSON)',
  playgroundPropsPlaceholder:
    '{\n  "text": "Hello World",\n  "color": "#ffffff"\n}',
  playgroundPreviewTitle: 'Preview',
  playgroundPreviewPlaceholder:
    'Remotion Player Preview — Coming when components are registered in backend',
  playgroundFormatLabel: 'Format',
  playgroundFormat16x9: '16:9',
  playgroundFormat9x16: '9:16',
  playgroundFormat1x1: '1:1',
  playgroundPropsHint:
    'Paste the component props as a JSON object. Full form generation coming soon.',
  playgroundApplyProps: 'Apply Props',
  playgroundResetProps: 'Reset'
} as const;
