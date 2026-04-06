// Data Engine domain strings - externalized for i18n and consistency

export const dataEngineTextMaps = {
  // ─── Page ─────────────────────────────────────────────────────────────────
  pageTitle: 'Data Engine',
  pageSubtitle:
    'Import data, map columns to template properties, and preview generated variations.',

  // ─── Tab labels ────────────────────────────────────────────────────────────
  tabImport: 'Import',
  tabMapping: 'Column Mapping',
  tabRules: 'Conditional Rules',
  tabPreview: 'Variation Preview',
  tabImportDisabledTooltip: 'Import a data source first',
  tabMappingDisabledTooltip: 'Connect a data source to access column mapping',
  tabRulesDisabledTooltip:
    'Save column mappings first to add conditional rules',
  tabPreviewDisabledTooltip: 'Save column mappings first to preview variations',

  // ─── Data sources ──────────────────────────────────────────────────────────
  dataSources: 'Data Sources',
  addDataSource: 'Add Data Source',
  dataSource: 'Data Source',
  sourceName: 'Source Name',
  sourceType: 'Source Type',
  sourceUrl: 'Source URL',
  sourceConfig: 'Configuration',

  // ─── Source types ──────────────────────────────────────────────────────────
  typeCSV: 'CSV File',
  typeGoogleSheets: 'Google Sheets',
  typeJSON: 'JSON API',
  typeAirtable: 'Airtable',
  typeZapier: 'Zapier',

  // ─── CSV upload ────────────────────────────────────────────────────────────
  csvUploadTitle: 'Upload CSV File',
  csvDropHere: 'Drop your CSV file here',
  csvOrBrowse: 'or click to browse',
  csvMaxFileSize: 'Max file size: 10 MB',
  csvSupportedFormats: 'Supported formats: .csv, .tsv',
  csvParsing: 'Parsing file...',
  csvParseSuccess: (rows: number) => `${rows} rows detected`,
  csvErrorInvalidFormat: 'Only CSV and TSV files are supported',
  csvErrorFileTooLarge: 'File exceeds the 10 MB limit',
  csvErrorNoHeaders:
    'Could not detect column headers — please verify the first row is a header',
  csvWarningInconsistentRows: (count: number) =>
    `${count} rows have formatting issues`,
  csvUseThisData: 'Use This Data',
  csvChangeFile: 'Change File',
  csvUploadHint: 'Drag and drop, or click to select a .csv or .tsv file',

  // ─── Google Sheets ─────────────────────────────────────────────────────────
  googleSheetsTitle: 'Connect Google Sheets',
  googleSheetsPasteUrl: 'Paste Google Sheets URL',
  googleSheetsUrlPlaceholder: 'https://docs.google.com/spreadsheets/d/...',
  googleSheetsConnect: 'Connect',
  googleSheetsConnecting: 'Connecting...',
  googleSheetsRefreshNow: 'Refresh Now',
  googleSheetsAutoRefresh: 'Auto Refresh',
  googleSheetsRefreshInterval: 'Refresh Interval',
  googleSheetsLastSynced: 'Last synced',
  googleSheetsNeverSynced: 'Never synced',
  googleSheetsAccessError:
    "Could not access this Google Sheet. Make sure it is shared with 'Anyone with the link'.",
  googleSheetsQuotaError:
    'Google Sheets rate limit reached. Try again in a few minutes.',
  googleSheetsIntervalOptions: {
    '5m': 'Every 5 minutes',
    '15m': 'Every 15 minutes',
    '30m': 'Every 30 minutes',
    '1h': 'Every hour',
    manual: 'Manual only'
  },

  // ─── Column detection & types ──────────────────────────────────────────────
  columns: 'Columns',
  columnName: 'Column Name',
  columnIndex: 'Column Index',
  dataType: 'Data Type',
  required: 'Required',
  sampleValues: 'Sample Values',
  autoDetect: 'Auto-Detect Columns',
  typeInferred: 'Inferred type',
  overrideType: 'Override type',
  requiredToggle: 'Mark as required',

  // ─── Column data types ─────────────────────────────────────────────────────
  dataTypeString: 'Text',
  dataTypeNumber: 'Number',
  dataTypeDate: 'Date',
  dataTypeBoolean: 'Boolean',
  dataTypeImage: 'Image URL',
  dataTypeVideo: 'Video URL',
  dataTypeImageUrl: 'Image URL',
  dataTypeVideoUrl: 'Video URL',
  dataTypeUnknown: 'Unknown',
  dataTypeJSON: 'JSON',

  // ─── Mapping tab ───────────────────────────────────────────────────────────
  columnMapping: 'Column Mapping',
  mapColumns: 'Map Columns',
  mappingSetup: 'Connect spreadsheet columns to video template properties',
  selectComponent: 'Select Component',
  selectProperty: 'Select Property',
  selectColumn: 'Select Column',
  transformation: 'Transformation',
  addMapping: 'Add Mapping',
  removeMapping: 'Remove Mapping',
  saveMapping: 'Save Mappings',
  savingMappings: 'Saving...',
  mappingsSaved: 'Mappings saved',
  unsavedChanges: 'You have unsaved mapping changes',
  discardChanges: 'Discard Changes',
  applyAutoMatch: 'Apply Auto-Match',
  suggestionsFound: (count: number) =>
    `${count} auto-match suggestion${count === 1 ? '' : 's'} found`,
  nthSuggestions: (count: number) =>
    `${count} suggestion${count === 1 ? '' : 's'}`,
  autoMatchApplied: 'Auto-match applied',
  autoMatchDismissed: 'Suggestions dismissed',
  typeMismatchWarning: (from: string, to: string) =>
    `Type mismatch: ${from} → ${to}. A format transformation is recommended.`,
  dismissAlert: 'Dismiss',
  imageUrlWarning:
    'This column may not contain image URLs. Verify sample values.',
  propsMappedCount: (n: number, total: number) =>
    `${n} of ${total} props mapped`,
  columnsPanel: 'Spreadsheet Columns',
  propsPanel: 'Template Properties',
  unmapped: 'Unmapped',
  mappedTo: 'Mapped to',
  connectColumn: 'Connect column',
  preview: 'Preview',

  // ─── Transformations ───────────────────────────────────────────────────────
  transformationType: 'Transformation Type',
  transformationNone: 'None (raw value)',
  transformationPreview: 'Preview',
  transformationNoPreview: 'Enter a value to preview',
  typeFormat: 'Format Currency',
  typeCurrency: 'Format Currency',
  typeFilter: 'Filter',
  typeCalculate: 'Calculate',
  typeConcatenate: 'Concatenate',
  typeCustom: 'Expression',
  typeTruncate: 'Truncate Text',
  typeUppercase: 'UPPERCASE',
  typeLowercase: 'lowercase',
  typeTitleCase: 'Title Case',
  typePrepend: 'Prepend Text',
  typeAppend: 'Append Text',
  typeRound: 'Round Number',
  typeExpression: 'Custom Expression',
  transformPreviewInput: 'Input',
  transformPreviewOutput: 'Output',
  transformPlaceholderPrepend: 'Desde ',
  transformPlaceholderAppend: ' kg',
  transformationRule: 'Rule',
  customScript: 'Expression',
  transformConfig: {
    currency: 'Currency',
    symbol: 'Symbol',
    decimals: 'Decimal places',
    thousands: 'Thousands separator',
    maxChars: 'Max characters',
    suffix: 'Suffix (e.g. ...)',
    text: 'Text to add',
    roundDecimals: 'Decimal places',
    template: 'Expression (use {value} or {columnName})'
  },

  // ─── Conditional rules tab ─────────────────────────────────────────────────
  conditionalLogic: 'Conditional Rules',
  rules: 'Rules',
  addRule: 'Add Rule',
  addCondition: 'Add Condition',
  addAction: 'Add Action',
  saveRules: 'Save Rules',
  savingRules: 'Saving...',
  rulesSaved: 'Rules saved',
  deleteRule: 'Delete Rule',
  enableRule: 'Enable',
  disableRule: 'Disable',
  ruleIf: 'If',
  ruleThen: 'Then',
  ruleAnd: 'AND',
  ruleOr: 'OR',
  rulesTabDescription:
    'Define rules to show, hide, or swap components based on row data values',
  noRules: 'No rules yet. Add your first conditional rule.',
  noRulesDescription:
    'Add your first conditional rule to control how components respond to row data.',
  maxRulesWarning: (current: number, max: number) =>
    `You have ${current} rules. Maximum recommended is ${max}.`,
  condition: 'Condition',
  action: 'Action',
  operator: 'Operator',
  value: 'Value',
  target: 'Target',
  targetComponent: 'Target Component',
  targetProp: 'Target Property',
  ruleEnabled: 'Enabled',
  ruleDisabled: 'Disabled',

  // ─── Operators ─────────────────────────────────────────────────────────────
  operatorEquals: 'equals',
  operatorNotEquals: 'does not equal',
  operatorContains: 'contains',
  operatorStartsWith: 'starts with',
  operatorGreaterThan: 'greater than',
  operatorLessThan: 'less than',
  operatorGte: 'greater than or equal',
  operatorLte: 'less than or equal',
  operatorIsTrue: 'is true',
  operatorIsFalse: 'is false',
  operatorIsEmpty: 'is empty',
  operatorIsNotEmpty: 'is not empty',

  // ─── Rule actions ──────────────────────────────────────────────────────────
  actionShow: 'Show component',
  actionHide: 'Hide component',
  actionSwapTemplate: 'Swap template',
  actionChangeProp: 'Set property value',
  actionChangeFormat: 'Change format',
  actionShowComponent: 'Show Component',
  actionHideComponent: 'Hide Component',
  actionApplyVariant: 'Apply Variant',
  actionSetProp: 'Set Property',
  actionSkipRow: 'Skip Row',

  // ─── Variation preview tab ─────────────────────────────────────────────────
  variationPreview: 'Variation Preview',
  variations: 'Variations',
  totalVariations: (n: number) => `${n} variation${n === 1 ? '' : 's'}`,
  loadingVariations: 'Loading variations...',
  noVariations:
    'No variations found. Connect a data source and save mappings first.',
  variationsWithErrors: (n: number) => `${n} with errors`,
  variationsReady: (n: number) => `${n} ready`,
  filterAll: 'All',
  filterValid: 'Valid only',
  filterErrors: 'Errors only',
  filterLabel: 'Filter by status',
  searchPlaceholder: 'Search variations...',
  rowIndex: (n: number) => `#${n + 1}`,

  // ─── Variation selection ───────────────────────────────────────────────────
  selectionToolbarLabel: 'Variation selection',
  renderingComingSoon: 'Rendering will be available in Phase 4',
  selectAll: 'Select All',
  deselectAll: 'Deselect All',
  clearSelection: 'Clear Selection',
  nVariationsSelected: (n: number) =>
    `${n} variation${n === 1 ? '' : 's'} selected`,
  sendToRender: 'Send to Render',
  maxBatchWarning: (max: number) => `Maximum batch size is ${max} variations`,

  // ─── Variation card ────────────────────────────────────────────────────────
  selectVariationLabel: (n: number) => `Select variation ${n}`,
  variationValid: 'Valid',
  variationHasErrors: (n: number) => `${n} error${n === 1 ? '' : 's'}`,
  variationSkipped: 'Skipped by rule',
  openDetail: 'View Details',

  // ─── Variation errors ──────────────────────────────────────────────────────
  errorMissingField: (field: string) => `Missing required field: ${field}`,
  errorBrokenImage: 'Image URL could not be loaded',
  errorTextOverflow: 'Text may overflow the component bounds',
  errorRowSkipped: (rule: string | number) => `Skipped by rule #${rule}`,
  warningTypeMismatch: 'Value type does not match prop type',
  variationErrors: 'Validation Errors',
  noErrors: 'No errors for this variation',

  // ─── Variation detail drawer ───────────────────────────────────────────────
  emptyValue: 'empty',
  previewComingSoon: 'Preview will be available when rendering is configured',
  previewPhaseLabel: 'Phase 4',
  unknownTemplate: (id: string) => `Unknown template: ${id}`,
  variationDetail: 'Variation Detail',
  resolvedProps: 'Resolved Properties',
  rawRowData: 'Raw Row Data',
  variationIndex: (n: number) => `Variation #${n + 1}`,

  // ─── Data import ───────────────────────────────────────────────────────────
  importData: 'Import Data',
  dataImport: 'Data Import',
  importStatus: 'Import Status',
  rowCount: 'Total Rows',
  successCount: 'Successful',
  errorCount: 'Errors',
  importPending: 'Pending',
  importProcessing: 'Processing',
  importCompleted: 'Completed',
  importFailed: 'Failed',

  // ─── Sync ──────────────────────────────────────────────────────────────────
  sync: 'Sync',
  autoSync: 'Auto Sync',
  syncInterval: 'Sync Interval',
  lastSynced: 'Last Synced',
  syncNow: 'Sync Now',
  syncing: 'Syncing...',
  syncLog: 'Sync Log',
  rowsAdded: 'Rows Added',
  rowsUpdated: 'Rows Updated',
  rowsDeleted: 'Rows Deleted',
  syncDuration: 'Duration',

  // ─── Preview ───────────────────────────────────────────────────────────────
  dataPreview: 'Data Preview',
  viewPreview: 'View Preview',
  testImport: 'Test Import',

  // ─── Success / error messages ──────────────────────────────────────────────
  sourceCreated: 'Data source connected successfully',
  sourceUpdated: 'Data source updated',
  sourceDeleted: 'Data source removed',
  sourceSynced: 'Data source refreshed',
  mappingUpdated: 'Column mappings saved',
  logicUpdated: 'Conditional rules saved',
  dataImported: 'Data imported successfully',
  syncCompleted: 'Sync completed',
  syncFailed: 'Sync failed. Please try again.',
  errorCreate: 'Failed to create data source',
  errorUpdate: 'Failed to update data source',
  errorSync: 'Failed to sync data source',
  errorSaveMappings: 'Failed to save column mappings',
  errorSaveRules: 'Failed to save conditional rules',
  errorLoadVariations: 'Failed to load variations'
} as const;
