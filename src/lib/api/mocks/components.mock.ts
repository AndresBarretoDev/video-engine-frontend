/**
 * OP Video Engine — Components Registry Mock Data
 *
 * Used when NEXT_PUBLIC_USE_MOCKS=true.
 * Shape matches RegisteredComponent from @/domains/components-registry/types.
 */

import type { RegisteredComponent } from '@/domains/components-registry/types';

export const mockComponents: RegisteredComponent[] = [
  {
    id: 'comp-001',
    name: 'TextBlock',
    slug: 'text-block',
    description:
      'Animated text block supporting display, heading, and body styles.',
    type: 'atom',
    status: 'published',
    version: '1.2.0',
    organizationId: 'org-001',
    category: 'typography',
    tags: ['text', 'animation', 'typography'],
    createdBy: 'mock-admin-001',
    createdAt: new Date('2025-10-01T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-03-01T10:00:00Z').toISOString(),
    publishedAt: new Date('2025-10-15T12:00:00Z').toISOString()
  },
  {
    id: 'comp-002',
    name: 'PricePatch',
    slug: 'price-patch',
    description:
      'Price display component with currency and promotional variants.',
    type: 'atom',
    status: 'published',
    version: '2.0.1',
    organizationId: 'org-001',
    category: 'commerce',
    tags: ['price', 'promo', 'retail'],
    createdBy: 'mock-admin-001',
    createdAt: new Date('2025-10-05T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-02-20T11:00:00Z').toISOString(),
    publishedAt: new Date('2025-10-20T12:00:00Z').toISOString()
  },
  {
    id: 'comp-003',
    name: 'LogoReveal',
    slug: 'logo-reveal',
    description:
      'Animated brand logo reveal with fade, slide, and scale variants.',
    type: 'atom',
    status: 'published',
    version: '1.0.3',
    organizationId: 'org-001',
    category: 'branding',
    tags: ['logo', 'reveal', 'animation', 'branding'],
    createdBy: 'mock-admin-001',
    createdAt: new Date('2025-10-10T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-15T09:00:00Z').toISOString(),
    publishedAt: new Date('2025-11-01T12:00:00Z').toISOString()
  },
  {
    id: 'comp-004',
    name: 'ImageFrame',
    slug: 'image-frame',
    description:
      'Responsive image container with crop, zoom, and parallax support.',
    type: 'atom',
    status: 'published',
    version: '1.1.0',
    organizationId: 'org-001',
    category: 'media',
    tags: ['image', 'media', 'frame'],
    createdBy: 'mock-admin-001',
    createdAt: new Date('2025-10-12T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-02-10T10:00:00Z').toISOString(),
    publishedAt: new Date('2025-11-05T12:00:00Z').toISOString()
  },
  {
    id: 'comp-005',
    name: 'CortinillaEntrada',
    slug: 'cortinilla-entrada',
    description: 'Opening bumper (cortinilla) with brand colors and logo.',
    type: 'molecule',
    status: 'published',
    version: '1.3.0',
    organizationId: 'org-001',
    category: 'transitions',
    tags: ['bumper', 'entrada', 'transition', 'branding'],
    createdBy: 'mock-admin-001',
    createdAt: new Date('2025-11-01T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-03-05T10:00:00Z').toISOString(),
    publishedAt: new Date('2025-11-15T12:00:00Z').toISOString()
  },
  {
    id: 'comp-006',
    name: 'ProductOverlay',
    slug: 'product-overlay',
    description:
      'Product callout overlay combining image, name, price, and CTA.',
    type: 'molecule',
    status: 'published',
    version: '2.1.0',
    organizationId: 'org-001',
    category: 'commerce',
    tags: ['product', 'overlay', 'retail', 'cta'],
    createdBy: 'mock-admin-001',
    createdAt: new Date('2025-11-10T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-03-15T14:00:00Z').toISOString(),
    publishedAt: new Date('2025-11-20T12:00:00Z').toISOString()
  },
  {
    id: 'comp-007',
    name: 'SocialEndCard',
    slug: 'social-end-card',
    description:
      'End card for social formats with CTA, handle, and brand close.',
    type: 'molecule',
    status: 'published',
    version: '1.0.0',
    organizationId: 'org-001',
    category: 'social',
    tags: ['end-card', 'social', 'cta', 'outro'],
    createdBy: 'mock-admin-001',
    createdAt: new Date('2025-12-01T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-02-01T10:00:00Z').toISOString(),
    publishedAt: new Date('2025-12-10T12:00:00Z').toISOString()
  },
  {
    id: 'comp-008',
    name: 'PromoVideoTemplate',
    slug: 'promo-video-template',
    description:
      'Full-length promotional video template (15s / 30s) for retail campaigns.',
    type: 'template',
    status: 'published',
    version: '3.0.0',
    organizationId: 'org-001',
    category: 'templates',
    tags: ['promo', 'retail', 'template', '15s', '30s'],
    createdBy: 'mock-admin-001',
    createdAt: new Date('2025-09-15T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-03-25T10:00:00Z').toISOString(),
    publishedAt: new Date('2025-09-30T12:00:00Z').toISOString()
  },
  {
    id: 'comp-009',
    name: 'BrandHeroScene',
    slug: 'brand-hero-scene',
    description:
      'Hero scene organism combining logo reveal, headline, and background.',
    type: 'organism',
    status: 'published',
    version: '1.4.0',
    organizationId: 'org-001',
    category: 'scenes',
    tags: ['hero', 'scene', 'branding', 'organism'],
    createdBy: 'mock-admin-001',
    createdAt: new Date('2025-12-15T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-03-20T11:00:00Z').toISOString(),
    publishedAt: new Date('2026-01-05T12:00:00Z').toISOString()
  },
  {
    id: 'comp-010',
    name: 'CountdownTimer',
    slug: 'countdown-timer',
    description: 'Animated countdown timer atom for urgency-driven promos.',
    type: 'atom',
    status: 'draft',
    version: '0.9.0',
    organizationId: 'org-001',
    category: 'interactive',
    tags: ['countdown', 'timer', 'promo', 'urgency'],
    createdBy: 'mock-admin-001',
    createdAt: new Date('2026-02-01T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-03-28T15:00:00Z').toISOString()
  }
];
