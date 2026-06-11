/**
 * OP Video Engine — Mock Data Barrel
 *
 * Only mocks for modules WITHOUT a backend yet (assets, components-registry,
 * data-engine). Everything else uses the real backend. Only used when
 * NEXT_PUBLIC_USE_MOCKS=true.
 */

export { mockAssets } from './assets.mock';
export { mockComponents } from './components.mock';
export {
  mockDataSource,
  mockColumnMappings,
  mockRules,
  mockVariations,
  mockPaginatedVariations,
  mockAutoMatchSuggestions
} from './data-engine.mock';
