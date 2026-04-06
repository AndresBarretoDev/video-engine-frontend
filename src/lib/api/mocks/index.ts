/**
 * OP Video Engine — Mock Data Barrel
 *
 * All mock data exports in one place.
 * Only used when NEXT_PUBLIC_USE_MOCKS=true.
 */

export { mockDashboardSummary } from './dashboard.mock';
export { mockBrands } from './brands.mock';
export { mockComponents } from './components.mock';
export { mockAuthUser } from './auth.mock';
export { mockProjects } from './projects.mock';
export { mockUsers } from './users.mock';
export {
  mockDataSource,
  mockColumnMappings,
  mockRules,
  mockVariations,
  mockPaginatedVariations,
  mockAutoMatchSuggestions
} from './data-engine.mock';
