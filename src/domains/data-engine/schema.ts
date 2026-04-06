import { z } from 'zod';

// Data Engine domain validation schemas

// ─── Existing schemas (preserved) ────────────────────────────────────────────

export const dataColumnSchema = z.object({
  columnName: z.string(),
  columnIndex: z.number().int().nonnegative(),
  dataType: z.enum([
    'string',
    'number',
    'date',
    'boolean',
    'image',
    'video',
    'json'
  ]),
  required: z.boolean(),
  sampleValues: z.array(z.unknown())
});

export type DataColumnInput = z.infer<typeof dataColumnSchema>;

export const conditionalActionSchema = z.object({
  type: z.enum([
    'show-component',
    'hide-component',
    'apply-variant',
    'set-prop',
    'skip-row'
  ]),
  target: z.string(),
  value: z.unknown().optional()
});

export type ConditionalActionInput = z.infer<typeof conditionalActionSchema>;

export const importDataSchema = z.object({
  sourceId: z.string().uuid(),
  projectId: z.string().uuid()
});

export type ImportDataInput = z.infer<typeof importDataSchema>;

// ─── Transform schema (discriminated union per type) ──────────────────────────

export const transformSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('currency'),
    config: z.object({
      currency: z.string(),
      symbol: z.string(),
      decimals: z.number().int().min(0).max(4),
      thousands: z.string().optional()
    })
  }),
  z.object({
    type: z.literal('format_currency'),
    config: z.object({
      currency: z.string(),
      symbol: z.string(),
      decimals: z.number().int().min(0).max(4),
      thousands: z.string().optional()
    })
  }),
  z.object({
    type: z.literal('truncate'),
    config: z.object({
      maxChars: z.number().int().positive(),
      suffix: z.string().default('...')
    })
  }),
  z.object({
    type: z.literal('uppercase'),
    config: z.object({}).optional()
  }),
  z.object({
    type: z.literal('lowercase'),
    config: z.object({}).optional()
  }),
  z.object({
    type: z.literal('title_case'),
    config: z.object({}).optional()
  }),
  z.object({
    type: z.literal('prepend'),
    config: z.object({
      text: z.string()
    })
  }),
  z.object({
    type: z.literal('append'),
    config: z.object({
      text: z.string()
    })
  }),
  z.object({
    type: z.literal('round'),
    config: z.object({
      decimals: z.number().int().min(0).max(10)
    })
  }),
  z.object({
    type: z.literal('expression'),
    config: z.object({
      template: z.string().min(1)
    })
  })
]);

export type TransformInput = z.infer<typeof transformSchema>;

// ─── Create data source schema ────────────────────────────────────────────────

export const createDataSourceSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(['csv', 'google_sheets', 'json_api']),
  config: z.record(z.unknown()).optional().default({}),
  sourceUrl: z.string().url().optional(),
  sourceConfig: z.record(z.unknown()).optional().default({}),
  autoSync: z.boolean().default(false),
  syncInterval: z.number().int().positive().optional(),
  projectId: z.string().optional()
});

export type CreateDataSourceInput = z.infer<typeof createDataSourceSchema>;

// ─── Column mapping schema ────────────────────────────────────────────────────

export const columnMappingSchema = z.object({
  id: z.string().optional(),
  columnName: z.string().min(1),
  propPath: z.string().min(1),
  transform: transformSchema.optional()
});

export type ColumnMappingInput = z.infer<typeof columnMappingSchema>;

export const saveColumnMappingsSchema = z.object({
  dataSourceId: z.string(),
  mappings: z.array(columnMappingSchema)
});

export type SaveColumnMappingsInput = z.infer<typeof saveColumnMappingsSchema>;

// ─── Conditional rule schema ──────────────────────────────────────────────────

export const conditionOperatorSchema = z.enum([
  'equals',
  'not_equals',
  'contains',
  'gt',
  'lt',
  'gte',
  'lte',
  'is_true',
  'is_false',
  'is_empty',
  'is_not_empty'
]);

export const ruleActionTypeSchema = z.enum([
  'show',
  'hide',
  'swap_template',
  'change_prop',
  'change_format'
]);

export const conditionalRuleSchema = z.object({
  id: z.string().optional(),
  condition: z.object({
    column: z.string().min(1),
    operator: conditionOperatorSchema,
    value: z.unknown().optional()
  }),
  action: z.object({
    type: ruleActionTypeSchema,
    target: z.string().min(1),
    value: z.unknown().optional()
  }),
  enabled: z.boolean().default(true),
  logicalConnector: z.enum(['and', 'or']).optional()
});

export type ConditionalRuleInput = z.infer<typeof conditionalRuleSchema>;

export const saveRulesSchema = z.object({
  rules: z.array(conditionalRuleSchema)
});

export type SaveRulesInput = z.infer<typeof saveRulesSchema>;

// ─── Legacy schemas (preserved for back-compat) ───────────────────────────────

export const conditionalLogicSchema = z.object({
  conditions: z.array(conditionalRuleSchema),
  actions: z.array(conditionalActionSchema)
});

export type ConditionalLogicInput = z.infer<typeof conditionalLogicSchema>;
