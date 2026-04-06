// Data Engine domain types
// Handles CSV/Sheets/JSON data import, column->prop mapping, and conditional logic

// ─── Existing types (preserved) ──────────────────────────────────────────────

export type DataSourceType =
  | 'csv'
  | 'google_sheets'
  | 'json_api'
  | 'google-sheets'
  | 'json'
  | 'airtable'
  | 'zapier';
export type DataEngineStatus =
  | 'pending'
  | 'syncing'
  | 'synced'
  | 'error'
  | 'paused';
export type ColumnDataType =
  | 'string'
  | 'number'
  | 'date'
  | 'boolean'
  | 'image'
  | 'video'
  | 'json';
export type ConditionalOperator =
  | 'equals'
  | 'not-equals'
  | 'contains'
  | 'starts-with'
  | 'greater-than'
  | 'less-than';

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  organizationId?: string;
  projectId: string;
  status: DataEngineStatus;
  sourceUrl?: string;
  sourceConfig: Record<string, unknown>;
  columns?: DataColumn[];
  rowCount?: number;
  lastSyncedAt?: string;
  lastSyncAt?: string;
  syncInterval?: number; // seconds
  autoSync: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DataColumn {
  id?: string;
  name: string;
  sourceId?: string;
  columnName?: string;
  columnIndex?: number;
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'date'
    | 'image_url'
    | 'video_url'
    | 'unknown';
  dataType?: ColumnDataType;
  required?: boolean;
  sampleValues: unknown[];
}

export interface ColumnMapping {
  id: string;
  dataSourceId: string;
  columnName: string;
  componentId?: string;
  propPath: string;
  transform?: Transform;
  // Legacy fields
  sourceId?: string;
  projectId?: string;
  mappings?: {
    columnId: string;
    componentPropPath: string;
    transformation?: DataTransformation;
  }[];
}

export interface DataTransformation {
  type: 'format' | 'filter' | 'calculate' | 'concatenate' | 'custom';
  rule: Record<string, unknown>;
  script?: string;
}

// ─── New types (added for Group 1) ───────────────────────────────────────────

/** Supported transform types */
export type TransformType =
  | 'currency'
  | 'truncate'
  | 'uppercase'
  | 'lowercase'
  | 'prepend'
  | 'append'
  | 'round'
  | 'expression'
  // Legacy (kept for back-compat)
  | 'format_currency'
  | 'title_case';

/** Typed transform config (varies by type) */
export type Transform =
  | {
      type: 'currency';
      config: {
        currency: string;
        symbol: string;
        decimals: number;
        thousands?: string;
      };
    }
  | {
      type: 'format_currency';
      config: {
        currency: string;
        symbol: string;
        decimals: number;
        thousands?: string;
      };
    }
  | { type: 'truncate'; config: { maxChars: number; suffix: string } }
  | { type: 'uppercase'; config?: Record<string, never> }
  | { type: 'lowercase'; config?: Record<string, never> }
  | { type: 'title_case'; config?: Record<string, never> }
  | { type: 'prepend'; config: { text: string } }
  | { type: 'append'; config: { text: string } }
  | { type: 'round'; config: { decimals: number } }
  | { type: 'expression'; config: { template: string } };

/** Condition operators for conditional rules */
export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'is_true'
  | 'is_false'
  | 'is_empty'
  | 'is_not_empty';

/** Rule action types */
export type RuleActionType =
  | 'show'
  | 'hide'
  | 'swap_template'
  | 'change_prop'
  | 'change_format';

/** A single conditional rule */
export interface ConditionalRule {
  id: string;
  projectId?: string;
  condition: {
    column: string;
    operator: ConditionOperator;
    value?: unknown;
  };
  action: {
    type: RuleActionType;
    target: string;
    value?: unknown;
  };
  enabled: boolean;
  // Legacy fields (kept for back-compat)
  columnId?: string;
  operator?: ConditionalOperator;
  logicalOperator?: 'and' | 'or';
}

export interface ConditionalAction {
  type:
    | 'show-component'
    | 'hide-component'
    | 'apply-variant'
    | 'set-prop'
    | 'skip-row';
  target: string;
  value?: unknown;
}

export interface ConditionalLogic {
  id: string;
  sourceId: string;
  projectId: string;
  conditions: ConditionalRule[];
  actions: ConditionalAction[];
}

/** Error for a specific variation row */
export interface VariationError {
  column?: string;
  message: string;
  severity: 'error' | 'warning';
  // Legacy
  rowIndex?: number;
  columnName?: string;
  error?: string;
  value?: unknown;
}

/** A resolved variation (one row from the data source with props applied) */
export interface Variation {
  index: number;
  rowData: Record<string, unknown>;
  props: Record<string, unknown>;
  errors: VariationError[];
  selected: boolean;
  thumbnailUrl?: string;
  // Legacy
  resolvedProps?: Record<string, unknown>;
  isSkipped?: boolean;
}

export interface DataImport {
  id: string;
  sourceId: string;
  projectId: string;
  rowCount: number;
  successCount: number;
  errorCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errors?: VariationError[];
  createdAt: string;
  completedAt?: string;
}

export interface DataPreview {
  sourceId: string;
  columns: DataColumn[];
  rows: Record<string, unknown>[];
  totalRows: number;
}

export interface SyncLog {
  id: string;
  sourceId: string;
  syncedAt: string;
  rowsAdded: number;
  rowsUpdated: number;
  rowsDeleted: number;
  errors: string[];
  duration: number; // milliseconds
}

// ─── CSV parsing types (client-side) ─────────────────────────────────────────

/** A parsed column before being saved to backend */
export interface ParsedColumn {
  name: string;
  index: number;
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'date'
    | 'image_url'
    | 'video_url'
    | 'unknown';
  sampleValues: string[];
  isEmpty: boolean;
}

/** Error from Papa Parse */
export interface CsvParseError {
  type: 'Quotes' | 'Delimiter' | 'FieldMismatch' | string;
  code: string;
  message: string;
  row?: number;
}

/** Full result of parsing a CSV file */
export interface CsvParseResult {
  headers: string[];
  rows: string[][];
  columns: ParsedColumn[];
  errors: CsvParseError[];
  totalRows: number;
}

// ─── Mapping draft (UI state) ─────────────────────────────────────────────────

/** A single working mapping entry before saving */
export interface MappingDraftEntry {
  id: string;
  columnName: string;
  propPath: string;
  transform?: Transform;
}

// ─── Rules draft (UI state) ───────────────────────────────────────────────────

/** A working rule row before saving */
export interface ConditionalRuleDraft {
  id: string;
  condition: {
    column: string;
    operator: ConditionOperator;
    value?: unknown;
  };
  action: {
    type: RuleActionType;
    target: string;
    value?: unknown;
  };
  enabled: boolean;
  logicalConnector?: 'and' | 'or';
}

// ─── Auto-match types ─────────────────────────────────────────────────────────

/** A suggestion from auto-match algorithm */
export interface AutoMatchSuggestion {
  columnName: string;
  propPath: string;
  score: number;
  matchType: 'exact' | 'contains' | 'levenshtein' | 'synonym';
}

// ─── Template prop definition (from component registry schema) ────────────────

export interface TemplatePropDefinition {
  path: string;
  type: 'string' | 'number' | 'boolean' | 'image' | 'video' | 'color';
  label?: string;
  required?: boolean;
  description?: string;
  componentId?: string;
  componentName?: string;
}

// ─── Tab navigation ───────────────────────────────────────────────────────────

export type DataEngineTabId = 'import' | 'mapping' | 'rules' | 'preview';

// ─── Paginated response ───────────────────────────────────────────────────────

export interface PaginatedVariations {
  items: Variation[];
  total: number;
  page: number;
  pageSize: number;
}

// ─── Variation filters ────────────────────────────────────────────────────────

export interface VariationFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'all' | 'valid' | 'errors';
  [key: string]: unknown;
}
