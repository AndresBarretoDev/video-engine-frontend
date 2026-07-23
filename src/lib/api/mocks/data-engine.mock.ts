/**
 * OP Video Engine — Data Engine Mock Data
 *
 * Mock data for the Data Engine module.
 * Used when NEXT_PUBLIC_USE_MOCKS=true.
 *
 * 24 rows of product data for a campaign, with 6 columns.
 */

import type {
  AutoMatchSuggestion,
  ColumnMapping,
  ConditionalRule,
  DataSource,
  PaginatedVariations,
  Variation
} from '@/domains/data-engine/types';

// ─── Raw product data (24 rows) ───────────────────────────────────────────────

const PRODUCTS = [
  {
    product_name: 'Yogurt Griego Natural',
    price: '4990',
    original_price: '5990',
    image_url: 'https://cdn.example.com/yogurt-griego.png',
    has_discount: 'true',
    format: 'standard'
  },
  {
    product_name: 'Leche Entera 1L',
    price: '2490',
    original_price: '',
    image_url: 'https://cdn.example.com/leche-entera.png',
    has_discount: 'false',
    format: 'standard'
  },
  {
    product_name: 'Queso Fresco 500g',
    price: '6990',
    original_price: '8990',
    image_url: 'https://cdn.example.com/queso-fresco.png',
    has_discount: 'true',
    format: 'standard'
  },
  {
    product_name: 'Mantequilla Sin Sal',
    price: '3490',
    original_price: '',
    image_url: 'https://cdn.example.com/mantequilla.png',
    has_discount: 'false',
    format: 'tiktok'
  },
  {
    product_name: 'Crema de Leche 200ml',
    price: '1990',
    original_price: '2490',
    image_url: 'https://cdn.example.com/crema-leche.png',
    has_discount: 'true',
    format: 'standard'
  },
  {
    product_name: 'Yogurt Batido Fresa',
    price: '3290',
    original_price: '',
    image_url: 'https://cdn.example.com/yogurt-fresa.png',
    has_discount: 'false',
    format: 'standard'
  },
  {
    product_name: 'Leche Descremada 1L',
    price: '2690',
    original_price: '2990',
    image_url: 'https://cdn.example.com/leche-descremada.png',
    has_discount: 'true',
    format: 'tiktok'
  },
  {
    product_name: 'Queso Gouda Laminado',
    price: '7490',
    original_price: '',
    image_url: 'https://cdn.example.com/queso-gouda.png',
    has_discount: 'false',
    format: 'standard'
  },
  {
    product_name: 'Requesón Light',
    price: '4290',
    original_price: '5290',
    image_url: 'https://cdn.example.com/requeson.png',
    has_discount: 'true',
    format: 'standard'
  },
  {
    product_name: 'Leche Cultivada',
    price: '3890',
    original_price: '',
    image_url: 'https://cdn.example.com/leche-cultivada.png',
    has_discount: 'false',
    format: 'standard'
  },
  {
    product_name: 'Yogurt Griego Vainilla',
    price: '4990',
    original_price: '5990',
    image_url: 'https://cdn.example.com/yogurt-vainilla.png',
    has_discount: 'true',
    format: 'tiktok'
  },
  {
    product_name: 'Mozzarella Fresca',
    price: '5990',
    original_price: '',
    image_url: 'https://cdn.example.com/mozzarella.png',
    has_discount: 'false',
    format: 'standard'
  },
  {
    product_name: 'Leche Sin Lactosa 1L',
    price: '3190',
    original_price: '3490',
    image_url: 'https://cdn.example.com/leche-sin-lactosa.png',
    has_discount: 'true',
    format: 'standard'
  },
  {
    product_name: 'Dulce de Leche 450g',
    price: '5490',
    original_price: '',
    image_url: 'https://cdn.example.com/dulce-leche.png',
    has_discount: 'false',
    format: 'standard'
  },
  {
    product_name: 'Crema Ácida 200g',
    price: '2290',
    original_price: '2790',
    image_url: 'https://cdn.example.com/crema-acida.png',
    has_discount: 'true',
    format: 'tiktok'
  },
  {
    product_name: 'Queso Parmesano Rallado',
    price: '8990',
    original_price: '',
    image_url: 'https://cdn.example.com/parmesano.png',
    has_discount: 'false',
    format: 'standard'
  },
  {
    product_name: 'Yogurt Natural Firme',
    price: '2990',
    original_price: '3490',
    image_url: '',
    has_discount: 'true',
    format: 'standard'
  },
  {
    product_name: 'Leche Chocolatada 1L',
    price: '3290',
    original_price: '',
    image_url: 'https://cdn.example.com/leche-choco.png',
    has_discount: 'false',
    format: 'standard'
  },
  {
    product_name: 'Quesillo Artesanal',
    price: '6490',
    original_price: '7990',
    image_url: 'https://cdn.example.com/quesillo.png',
    has_discount: 'true',
    format: 'tiktok'
  },
  {
    product_name: 'Mantecoso 250g',
    price: '4790',
    original_price: '',
    image_url: 'https://cdn.example.com/mantecoso.png',
    has_discount: 'false',
    format: 'standard'
  },
  {
    product_name: 'Leche Vegetal Avena',
    price: '3990',
    original_price: '4490',
    image_url: 'https://cdn.example.com/leche-avena.png',
    has_discount: 'true',
    format: 'standard'
  },
  {
    product_name: 'Fromage Blanco 250g',
    price: '3490',
    original_price: '',
    image_url: 'https://cdn.example.com/fromage.png',
    has_discount: 'false',
    format: 'standard'
  },
  {
    product_name: 'Helado Yogurt Fresa',
    price: '5290',
    original_price: '6290',
    image_url: 'https://cdn.example.com/helado-yogurt.png',
    has_discount: 'true',
    format: 'tiktok'
  },
  {
    product_name: 'Leche Condensada 397g',
    price: '4190',
    original_price: '',
    image_url: '',
    has_discount: 'false',
    format: 'standard'
  }
];

// ─── Mock data source ─────────────────────────────────────────────────────────

export const mockDataSource: DataSource = {
  id: 'ds-001',
  projectId: '11111111-1111-4111-8111-111111111111',
  type: 'csv',
  name: 'campana-lacteos-2026.csv',
  status: 'synced',
  rowCount: 24,
  columns: [
    {
      id: 'col-1',
      name: 'product_name',
      columnName: 'product_name',
      columnIndex: 0,
      type: 'string',
      dataType: 'string',
      sampleValues: [
        'Yogurt Griego Natural',
        'Leche Entera 1L',
        'Queso Fresco 500g',
        'Mantequilla Sin Sal',
        'Crema de Leche 200ml'
      ],
      required: false
    },
    {
      id: 'col-2',
      name: 'price',
      columnName: 'price',
      columnIndex: 1,
      type: 'number',
      dataType: 'number',
      sampleValues: ['4990', '2490', '6990', '3490', '1990'],
      required: false
    },
    {
      id: 'col-3',
      name: 'original_price',
      columnName: 'original_price',
      columnIndex: 2,
      type: 'number',
      dataType: 'number',
      sampleValues: ['5990', '', '8990', '', '2490'],
      required: false
    },
    {
      id: 'col-4',
      name: 'image_url',
      columnName: 'image_url',
      columnIndex: 3,
      type: 'image_url',
      dataType: 'image',
      sampleValues: [
        'https://cdn.example.com/yogurt-griego.png',
        'https://cdn.example.com/leche-entera.png',
        'https://cdn.example.com/queso-fresco.png',
        'https://cdn.example.com/mantequilla.png',
        'https://cdn.example.com/crema-leche.png'
      ],
      required: false
    },
    {
      id: 'col-5',
      name: 'has_discount',
      columnName: 'has_discount',
      columnIndex: 4,
      type: 'boolean',
      dataType: 'boolean',
      sampleValues: ['true', 'false', 'true', 'false', 'true'],
      required: false
    },
    {
      id: 'col-6',
      name: 'format',
      columnName: 'format',
      columnIndex: 5,
      type: 'string',
      dataType: 'string',
      sampleValues: ['standard', 'standard', 'standard', 'tiktok', 'standard'],
      required: false
    }
  ],
  sourceConfig: {},
  autoSync: false,
  lastSyncedAt: new Date('2026-04-01T10:00:00').toISOString(),
  lastSyncAt: new Date('2026-04-01T10:00:00').toISOString(),
  createdAt: new Date('2026-03-15T09:00:00').toISOString(),
  updatedAt: new Date('2026-04-01T10:00:00').toISOString()
};

// ─── Mock column mappings ─────────────────────────────────────────────────────

export const mockColumnMappings: ColumnMapping[] = [
  {
    id: 'mapping-1',
    dataSourceId: 'ds-001',
    columnName: 'product_name',
    propPath: 'productOverlay.productName',
    transform: undefined
  },
  {
    id: 'mapping-2',
    dataSourceId: 'ds-001',
    columnName: 'price',
    propPath: 'pricePatch.price',
    transform: {
      type: 'currency',
      config: { currency: 'CLP', symbol: '$', decimals: 0, thousands: '.' }
    }
  },
  {
    id: 'mapping-3',
    dataSourceId: 'ds-001',
    columnName: 'original_price',
    propPath: 'pricePatch.originalPrice',
    transform: {
      type: 'currency',
      config: { currency: 'CLP', symbol: '$', decimals: 0, thousands: '.' }
    }
  },
  {
    id: 'mapping-4',
    dataSourceId: 'ds-001',
    columnName: 'image_url',
    propPath: 'imageFrame.src',
    transform: undefined
  }
];

// ─── Mock conditional rules ───────────────────────────────────────────────────

export const mockRules: ConditionalRule[] = [
  {
    id: 'rule-1',
    projectId: '11111111-1111-4111-8111-111111111111',
    condition: {
      column: 'has_discount',
      operator: 'is_true'
    },
    action: {
      type: 'show',
      target: 'pricePatch'
    },
    enabled: true
  },
  {
    id: 'rule-2',
    projectId: '11111111-1111-4111-8111-111111111111',
    condition: {
      column: 'format',
      operator: 'equals',
      value: 'tiktok'
    },
    action: {
      type: 'swap_template',
      target: 'tiktok-vertical-template'
    },
    enabled: true
  }
];

// ─── Auto-match suggestions ───────────────────────────────────────────────────

export const mockAutoMatchSuggestions: AutoMatchSuggestion[] = [
  {
    columnName: 'product_name',
    propPath: 'productOverlay.productName',
    score: 0.85,
    matchType: 'contains'
  },
  {
    columnName: 'price',
    propPath: 'pricePatch.price',
    score: 1.0,
    matchType: 'exact'
  },
  {
    columnName: 'original_price',
    propPath: 'pricePatch.originalPrice',
    score: 0.85,
    matchType: 'contains'
  },
  {
    columnName: 'image_url',
    propPath: 'imageFrame.src',
    score: 0.7,
    matchType: 'synonym'
  }
];

// ─── Mock variations (24 rows) ────────────────────────────────────────────────

function buildResolvedProps(
  product: (typeof PRODUCTS)[0]
): Record<string, unknown> {
  const hasDiscount = product.has_discount === 'true';
  const price = parseInt(product.price, 10);
  const originalPrice = product.original_price
    ? parseInt(product.original_price, 10)
    : null;

  return {
    productOverlay: {
      productName: product.product_name
    },
    pricePatch: {
      price: `$${price.toLocaleString('es-CL')}`,
      originalPrice: originalPrice
        ? `$${originalPrice.toLocaleString('es-CL')}`
        : null,
      show: hasDiscount
    },
    imageFrame: {
      src: product.image_url || null
    }
  };
}

function buildVariationErrors(product: (typeof PRODUCTS)[0]) {
  const errors = [];

  // Rows 16 and 23 have no image_url
  if (!product.image_url) {
    errors.push({
      column: 'image_url',
      message: 'Image URL is empty — imageFrame.src will be null',
      severity: 'warning' as const
    });
  }

  // Row 1 (Leche Entera) has no original_price — not an error, just informational
  return errors;
}

export const mockVariations: Variation[] = PRODUCTS.map((product, index) => ({
  index,
  rowData: product as Record<string, unknown>,
  props: buildResolvedProps(product),
  resolvedProps: buildResolvedProps(product),
  errors: buildVariationErrors(product),
  selected: false,
  thumbnailUrl: undefined,
  isSkipped: false
}));

export const mockPaginatedVariations: PaginatedVariations = {
  items: mockVariations.slice(0, 20),
  total: 24,
  page: 1,
  pageSize: 20
};
