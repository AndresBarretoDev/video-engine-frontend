# Code Review Report: data-engine Domain
**Date**: 2026-04-02
**Reviewer**: code-reviewer agent
**Scope**: `src/domains/data-engine/components/` (20 files) + page + loading + text-maps + types

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| Files reviewed | 23 |
| Critical violations | 7 |
| Warnings | 8 |
| OK files | 9 |

**Overall assessment**: The domain is architecturally sound in the large — all files use `'use client'`, named exports, `@/` absolute imports, and text-maps coverage is excellent. However there are **two repeating critical patterns** that need systematic fixing: (1) hardcoded Tailwind semantic color classes for status indicators, and (2) hardcoded strings in JSX that are missing from `text-maps.ts`. Additionally the page file has two raw user-visible strings that must be externalized.

---

## 2. Critical Violations (Must Fix)

---

### CRITICAL-01 · Hardcoded strings in `page.tsx`

**File**: `src/app/(dashboard)/projects/[id]/data/page.tsx:24–29`

**Rule violated**: Zero hardcoded strings — all user-visible text must come from text-maps

**Severity**: Critical

**Current code**:
```tsx
<h1 className="text-2xl font-bold tracking-tight text-foreground">
  Data Engine
</h1>
<p className="mt-1 text-sm text-muted-foreground">
  Import data, map columns to template properties, and preview generated variations.
</p>
```

**Issue**: Two raw string literals rendered directly in JSX. Pages must be pure composition — no hardcoded display strings.

**Required fix**: Add two keys to `dataEngineTextMaps` and import the object in the page (even though it's a Server Component):
```ts
// text-maps.ts
pageTitle: 'Data Engine',
pageSubtitle: 'Import data, map columns to template properties, and preview generated variations.',
```
```tsx
// page.tsx
import { dataEngineTextMaps } from '@/domains/data-engine/text-maps';
// ...
<h1 ...>{dataEngineTextMaps.pageTitle}</h1>
<p ...>{dataEngineTextMaps.pageSubtitle}</p>
```

---

### CRITICAL-02 · Hardcoded strings in `selection-bar.tsx`

**File**: `src/domains/data-engine/components/selection-bar.tsx:48`  
**File**: `src/domains/data-engine/components/selection-bar.tsx:55`

**Rule violated**: Zero hardcoded strings

**Severity**: Critical

**Current code** (line 48):
```tsx
toast.info('Rendering will be available in Phase 4');
```
**Current code** (line 55):
```tsx
aria-label="Variation selection"
```

**Issue**: Toast message and `aria-label` are raw strings not sourced from text-maps.

**Required fix**:
```ts
// text-maps.ts
renderingComingSoon: 'Rendering will be available in Phase 4',
selectionToolbarLabel: 'Variation selection',
```
```tsx
toast.info(dataEngineTextMaps.renderingComingSoon);
// ...
aria-label={dataEngineTextMaps.selectionToolbarLabel}
```

---

### CRITICAL-03 · Hardcoded strings in `variation-detail-drawer.tsx`

**File**: `src/domains/data-engine/components/variation-detail-drawer.tsx:55`  
**File**: `src/domains/data-engine/components/variation-detail-drawer.tsx:144–148`

**Rule violated**: Zero hardcoded strings

**Severity**: Critical

**Current code** (line 55):
```tsx
? <span className="text-muted-foreground italic">empty</span>
```
**Current code** (lines 144–148):
```tsx
<p className="text-sm font-medium text-muted-foreground">
  Preview will be available when rendering is configured
</p>
<p className="text-xs text-muted-foreground/70">Phase 4</p>
```

**Issue**: Three raw strings that are visible to the user ("empty", the preview message, and "Phase 4").

**Required fix**:
```ts
// text-maps.ts
emptyValue: 'empty',
previewComingSoon: 'Preview will be available when rendering is configured',
previewPhaseLabel: 'Phase 4',
```

---

### CRITICAL-04 · Hardcoded strings in `variation-thumbnail.tsx`

**File**: `src/domains/data-engine/components/variation-thumbnail.tsx:119`

**Rule violated**: Zero hardcoded strings

**Severity**: Critical

**Current code**:
```tsx
? `Unknown template: ${templateId}`
```

**Issue**: Raw error message string concatenation in JSX. Must be externalized.

**Required fix**:
```ts
// text-maps.ts
unknownTemplate: (id: string) => `Unknown template: ${id}`,
```
```tsx
{!template ? dataEngineTextMaps.unknownTemplate(templateId) : dataEngineTextMaps.variationHasErrors(1)}
```

---

### CRITICAL-05 · Hardcoded strings in `preview-tab.tsx`

**File**: `src/domains/data-engine/components/preview-tab.tsx:47–51`

**Rule violated**: Zero hardcoded strings

**Severity**: Critical

**Current code**:
```tsx
<span className="text-destructive">
  {withErrors} with errors
</span>
<span aria-hidden>·</span>
// ...
<span className="text-emerald-600">
  {ready} ready
</span>
```

**Issue**: "with errors" and "ready" are raw strings. The `{withErrors}` count is interpolated but the surrounding text is hardcoded.

**Required fix**:
```ts
// text-maps.ts
variationsWithErrors: (n: number) => `${n} with errors`,
variationsReady: (n: number) => `${n} ready`,
```
```tsx
<span className="text-destructive">
  {dataEngineTextMaps.variationsWithErrors(withErrors)}
</span>
<span className="text-[var(--color-status-approved-default)]">
  {dataEngineTextMaps.variationsReady(ready)}
</span>
```

---

### CRITICAL-06 · Hardcoded strings in `transformation-drawer.tsx`

**File**: `src/domains/data-engine/components/transformation-drawer.tsx:362–363`  
**File**: `src/domains/data-engine/components/transformation-drawer.tsx:368–369`

**Rule violated**: Zero hardcoded strings

**Severity**: Critical

**Current code**:
```tsx
<p className="text-[10px] text-muted-foreground mb-1">Input</p>
// ...
<p className="text-[10px] text-muted-foreground mb-1">Output</p>
```

Also (line 201):
```tsx
placeholder={transform.type === 'prepend' ? 'Desde ' : ' kg'}
```

**Issue**: "Input", "Output", and the placeholder examples are raw strings in JSX.

**Required fix**:
```ts
// text-maps.ts
transformPreviewInput: 'Input',
transformPreviewOutput: 'Output',
// Note: placeholder examples like 'Desde ' and ' kg' are UX hints
// that should also be moved to text-maps for i18n consistency
transformPlaceholderPrepend: 'Desde ',
transformPlaceholderAppend: ' kg',
```

---

### CRITICAL-07 · Hardcoded status color `text-emerald-600` and `border-amber-*` outside status token system

**Files and lines**:
- `src/domains/data-engine/components/preview-tab.tsx:51` — `text-emerald-600`
- `src/domains/data-engine/components/variation-card.tsx:113` — `text-emerald-600`
- `src/domains/data-engine/components/variation-card.tsx:125` — `text-amber-600`
- `src/domains/data-engine/components/variation-detail-drawer.tsx:166` — `text-amber-600`
- `src/domains/data-engine/components/unmapped-columns-alert.tsx:33` — `border-amber-200 bg-amber-50`
- `src/domains/data-engine/components/unmapped-columns-alert.tsx:37` — `text-amber-900`
- `src/domains/data-engine/components/unmapped-columns-alert.tsx:44` — `border-amber-300 bg-amber-100 text-amber-800`
- `src/domains/data-engine/components/unmapped-columns-alert.tsx:52` — `text-amber-700`
- `src/domains/data-engine/components/unmapped-columns-alert.tsx:58` — `text-amber-600 hover:bg-amber-100 hover:text-amber-800`
- `src/domains/data-engine/components/rules-list.tsx:80` — `border-amber-500/50 bg-amber-500/10`
- `src/domains/data-engine/components/rules-list.tsx:81` — `text-amber-600`
- `src/domains/data-engine/components/rules-list.tsx:82` — `text-amber-700 dark:text-amber-400`
- `src/domains/data-engine/components/mapping-tab.tsx:218` — `border-amber-200 bg-amber-50`
- `src/domains/data-engine/components/mapping-tab.tsx:219` — `text-amber-800`
- `src/domains/data-engine/components/mapping-row.tsx:34` — `bg-emerald-50 text-emerald-700 border-emerald-200`
- `src/domains/data-engine/components/mapping-row.tsx:35` — `bg-purple-50 text-purple-700 border-purple-200`
- `src/domains/data-engine/components/mapping-row.tsx:36` — `bg-orange-50 text-orange-700 border-orange-200`
- `src/domains/data-engine/components/mapping-row.tsx:37` — `bg-pink-50 text-pink-700 border-pink-200`
- `src/domains/data-engine/components/mapping-row.tsx:141` — `border-amber-300 bg-amber-50 ... text-amber-700`
- `src/domains/data-engine/components/data-source-preview-table.tsx:51` — `bg-emerald-50 text-emerald-700 border-emerald-200`
- `src/domains/data-engine/components/data-source-preview-table.tsx:52` — `bg-purple-50 text-purple-700 border-purple-200`
- `src/domains/data-engine/components/data-source-preview-table.tsx:53` — `bg-orange-50 text-orange-700 border-orange-200`
- `src/domains/data-engine/components/data-source-preview-table.tsx:54` — `bg-pink-50 text-pink-700 border-pink-200`
- `src/domains/data-engine/components/variation-card.tsx:59` — `border-amber-400`

**Rule violated**: Zero hardcoded colors — all visual values must use CSS variables from the Vibe Coding design system

**Severity**: Critical

**Issue**: The project design system (`src/styles/tokens/source/status_colors.json`) defines semantic status tokens. Hardcoded Tailwind color scale classes (`amber-*`, `emerald-*`, `purple-*`, `orange-*`, `pink-*`) bypass the token layer entirely. If the design system tokens change, these values will not update.

**Context note**: `amber-*` for warnings and `emerald-*` for success are semantically intentional, but they MUST use CSS variables, not raw Tailwind classes.

**Required approach**:
1. Check `status_colors.json` for the correct CSS variable names (e.g. `--color-status-warning-*`, `--color-status-approved-*`)
2. Replace all Tailwind semantic color classes with CSS variable equivalents

**Example correction** for `variation-card.tsx`:
```tsx
// Before
<span className="flex items-center gap-1 text-xs text-emerald-600">
// After
<span className="flex items-center gap-1 text-xs text-[var(--color-status-approved-default)]">

// Before
<span className="flex items-center gap-1 text-xs text-amber-600">
// After
<span className="flex items-center gap-1 text-xs text-[var(--color-status-warning-default)]">
```

For the column type badge colors in `mapping-row.tsx` and `data-source-preview-table.tsx` (boolean=emerald, date=purple, image=orange, video=pink), if those are not covered by status tokens, they must use `var(--color-op-blue-*)` or equivalent design system tokens — never raw Tailwind color scales.

---

## 3. Warnings (Should Fix)

---

### WARNING-01 · `unmapped-columns-alert.tsx` — `sr-only` dismiss button uses raw string

**File**: `src/domains/data-engine/components/unmapped-columns-alert.tsx:64`

**Current code**:
```tsx
<span className="sr-only">Dismiss</span>
```

**Issue**: Screen-reader-only string not in text-maps. Low visibility but breaks the zero-hardcoded-strings rule for accessibility strings.

**Recommendation**: Add `dismissAlert: 'Dismiss'` to text-maps and use it here.

---

### WARNING-02 · `variation-card.tsx` — `aria-label` uses raw interpolated string

**File**: `src/domains/data-engine/components/variation-card.tsx:98–99`

**Current code**:
```tsx
aria-label={`Select variation ${variation.index + 1}`}
```

**Issue**: Raw string template used for an accessibility label. Should be a text-map function.

**Recommendation**:
```ts
// text-maps.ts
selectVariationAriaLabel: (n: number) => `Select variation ${n}`,
```

---

### WARNING-03 · `rules-tab.tsx` — string manipulation on a text-maps value

**File**: `src/domains/data-engine/components/rules-tab.tsx:84–87`

**Current code**:
```tsx
{dataEngineTextMaps.mappingSetup.replace(
  'Connect spreadsheet columns to video template properties',
  'Define rules to show, hide, or swap components based on row data values'
)}
```

**Issue**: Replacing a text-map string at runtime with a hardcoded replacement string. This means the replacement string itself is hardcoded and bypasses the text-map system. Fragile because if `mappingSetup` changes, the replacement will silently fail.

**Recommendation**: Add a dedicated string:
```ts
// text-maps.ts
rulesTabDescription: 'Define rules to show, hide, or swap components based on row data values',
```
Then use `dataEngineTextMaps.rulesTabDescription` directly.

---

### WARNING-04 · `rules-tab.tsx` — arrow literal in JSX button text

**File**: `src/domains/data-engine/components/rules-tab.tsx:98–100`

**Current code**:
```tsx
<Button onClick={onContinue}>
  {dataEngineTextMaps.variationPreview} →
</Button>
```

**Issue**: The `→` arrow is a hardcoded Unicode character concatenated with a text-map string. While minor, it is a user-visible character that should be part of the text-map or at minimum an `aria-hidden` icon.

**Recommendation**: Either add it to the text-map string (`variationPreview: 'Variation Preview →'`) or replace with a Lucide `ArrowRight` icon (consistent with other Continue buttons in the domain).

---

### WARNING-05 · `transformation-drawer.tsx` — `'...'` hardcoded placeholder in truncate config default

**File**: `src/domains/data-engine/components/transformation-drawer.tsx:73`

**Current code**:
```ts
return { type: 'truncate', config: { maxChars: 30, suffix: '...' } };
```

**Issue**: The default suffix `'...'` is a UI-visible value (appears in the Input field). It could be a text-map constant.

**Severity**: Low / acceptable depending on whether this is considered a code default vs. user-visible text.

---

### WARNING-06 · `variation-thumbnail.tsx` — `'promo-video'` string default in `variation-grid.tsx`

**File**: `src/domains/data-engine/components/variation-grid.tsx:61`

**Current code**:
```tsx
export function VariationGrid({ projectId, templateId = 'promo-video' }: VariationGridProps) {
```

**Issue**: The default template ID `'promo-video'` is a hardcoded string. While this is a code-level default (not directly visible to users), it will produce the user-visible error from CRITICAL-04 (`Unknown template: promo-video` if the template registry changes). Should be a constant.

**Recommendation**: Extract to a named constant:
```ts
const DEFAULT_TEMPLATE_ID = 'promo-video';
```

---

### WARNING-07 · `mapping-tab.tsx` — `'CSV Import'` and `'Google Sheets'` hardcoded in mutation payload

**File**: `src/domains/data-engine/components/mapping-tab.tsx` (import-tab.tsx line 55, google-sheets-connector.tsx line 71)

**Files**:
- `src/domains/data-engine/components/import-tab.tsx:55` — `name: 'CSV Import'`
- `src/domains/data-engine/components/google-sheets-connector.tsx:71` — `name: 'Google Sheets'`

**Issue**: These names are sent to the backend API as data. They are user-visible strings (appear in data source lists). They should use text-map values.

**Recommendation**:
```ts
// import-tab.tsx
name: dataEngineTextMaps.typeCSV,  // 'CSV File'
// google-sheets-connector.tsx
name: dataEngineTextMaps.typeGoogleSheets,  // 'Google Sheets'
```

---

### WARNING-08 · `rules-list.tsx` — `EmptyState` receives non-text-map `description` value

**File**: `src/domains/data-engine/components/rules-list.tsx:91–93`

**Current code**:
```tsx
<EmptyState
  title={dataEngineTextMaps.noRules}
  description={dataEngineTextMaps.rules}  // "Rules"
/>
```

**Issue**: `dataEngineTextMaps.rules` resolves to `'Rules'` — a single word that reads as a heading, not as a description. The `description` prop of `EmptyState` typically expects a longer explanatory sentence. This is semantically incorrect use of the text-map value.

**Recommendation**: Add a dedicated empty state description key:
```ts
noRulesDescription: 'Add your first conditional rule to control how components respond to row data.',
```

---

## 4. Compliance Summary

| Rule | Status | Notes |
|------|--------|-------|
| 1. Reusable components (2+ uses → extract) | PASS | Good component decomposition |
| 2. Separation of concerns (logic→utils, data→constants, types→types) | PASS | Utils, types, stores cleanly separated |
| 3. Types external (not in components) | PASS | All types in `types.ts` |
| 4. Pages ultra-clean (composition only) | FAIL | `page.tsx` has 2 hardcoded strings |
| 5. MCPs automatic (shadcn) | PASS | shadcn components used throughout |
| 6. Mobile-first responsive | PASS | `sm:`, `xl:` breakpoints used correctly |
| 7. Server Components default | PASS | All components correctly marked `'use client'` |
| 8. Naming conventions (kebab-case files, PascalCase components) | PASS | All files kebab-case, exports PascalCase |
| 9. Absolute imports (`@/`) | PASS | No relative `../../` violations found |
| 10. Auth + API Guards | N/A | Read-only review of UI components |
| Zero hardcoded strings | FAIL | 7 files have violations |
| Zero hardcoded colors | FAIL | 5+ files with Tailwind color scale classes |
| Named exports only | PASS | All components use named exports |
| `'use client'` present | PASS | All interactive components have directive |
| text-map completeness | FAIL | Missing keys for CRITICAL-01 through CRITICAL-06 |

---

## 5. Refactoring Plan

### Priority 1 — Critical (block deployment)

**Step 1: Add missing text-map keys** (1 file: `text-maps.ts`)

Add these keys to `dataEngineTextMaps`:
```ts
// Page
pageTitle: 'Data Engine',
pageSubtitle: 'Import data, map columns to template properties, and preview generated variations.',

// Selection bar
renderingComingSoon: 'Rendering will be available in Phase 4',
selectionToolbarLabel: 'Variation selection',

// Variation detail drawer
emptyValue: 'empty',
previewComingSoon: 'Preview will be available when rendering is configured',
previewPhaseLabel: 'Phase 4',

// Variation thumbnail
unknownTemplate: (id: string) => `Unknown template: ${id}`,

// Preview tab
variationsWithErrors: (n: number) => `${n} with errors`,
variationsReady: (n: number) => `${n} ready`,

// Transformation drawer
transformPreviewInput: 'Input',
transformPreviewOutput: 'Output',
```

**Step 2: Update components to use new keys** (7 files)

Files to update: `page.tsx`, `selection-bar.tsx`, `variation-detail-drawer.tsx`, `variation-thumbnail.tsx`, `preview-tab.tsx`, `transformation-drawer.tsx`

**Step 3: Replace hardcoded Tailwind color classes with CSS variables** (5 files)

Files to update: `variation-card.tsx`, `preview-tab.tsx`, `unmapped-columns-alert.tsx`, `rules-list.tsx`, `mapping-tab.tsx`, `mapping-row.tsx`, `data-source-preview-table.tsx`

Required action before fixing: Read `src/styles/tokens/source/status_colors.json` to get the exact CSS variable names for warning (`amber-*`) and approved/success (`emerald-*`) states.

For the column type badge colors (boolean/date/image_url/video_url), check whether the design system provides semantic tokens. If not, this is a design system gap that should be filed as a separate issue.

### Priority 2 — Warnings (before next feature work)

- WARNING-01: Add `dismissAlert` to text-maps, use in `unmapped-columns-alert.tsx`
- WARNING-02: Add `selectVariationAriaLabel` function to text-maps, use in `variation-card.tsx`
- WARNING-03: Add `rulesTabDescription` to text-maps, remove string `.replace()` hack in `rules-tab.tsx`
- WARNING-04: Replace `→` literal with `ArrowRight` icon in `rules-tab.tsx`
- WARNING-07: Replace `'CSV Import'` and `'Google Sheets'` string literals in mutation payloads with text-map values
- WARNING-08: Add `noRulesDescription` to text-maps, use in `rules-list.tsx`

---

## 6. Files Reviewed

| File | Status | Issues |
|------|--------|--------|
| `text-maps.ts` | WARNING | Missing 10+ keys needed by components |
| `types.ts` | PASS | Clean, external, comprehensive |
| `components/csv-upload-zone.tsx` | PASS | Full compliance |
| `components/rule-row.tsx` | PASS | Full compliance |
| `components/rules-list.tsx` | CRITICAL + WARNING | Amber color classes; bad `description` prop |
| `components/rules-tab.tsx` | WARNING | String `.replace()` hack; `→` literal |
| `components/variation-filter-bar.tsx` | PASS | Full compliance |
| `components/mapping-row.tsx` | CRITICAL | Hardcoded emerald/purple/orange/pink/amber color classes |
| `components/variation-detail-drawer.tsx` | CRITICAL | 3 hardcoded strings; `text-amber-600` |
| `components/transformation-drawer.tsx` | CRITICAL | "Input"/"Output" hardcoded; placeholder literals |
| `components/selection-bar.tsx` | CRITICAL | Toast string; aria-label string |
| `components/auto-match-banner.tsx` | PASS | Full compliance |
| `components/preview-tab.tsx` | CRITICAL | "with errors"/"ready" strings; `text-emerald-600` |
| `components/unmapped-columns-alert.tsx` | CRITICAL | Full amber color palette; "Dismiss" sr-only string |
| `components/mapping-tab.tsx` | CRITICAL + WARNING | Amber colors; `'CSV Import'` string in mutation |
| `components/data-source-preview-table.tsx` | CRITICAL | Emerald/purple/orange/pink colors |
| `components/google-sheets-connector.tsx` | WARNING | `'Google Sheets'` string in mutation |
| `components/import-tab.tsx` | PASS | Full compliance |
| `components/data-engine-tabs.tsx` | PASS | Full compliance |
| `components/variation-thumbnail.tsx` | CRITICAL | `Unknown template: ${templateId}` hardcoded |
| `components/variation-card.tsx` | CRITICAL + WARNING | `text-emerald-600`, `text-amber-600`, `border-amber-400`; aria-label string |
| `components/variation-grid.tsx` | WARNING | Hardcoded `'promo-video'` default |
| `app/.../data/page.tsx` | CRITICAL | 2 hardcoded strings; not using text-maps |
| `app/.../data/loading.tsx` | PASS | No user-visible strings |

---

## 7. Recommendations & Next Steps

1. **Create a helper constant file** for non-semantic type badge colors (boolean, date, image_url, video_url) if the design system doesn't provide tokens. This keeps the mapping isolated and avoids the same color being hardcoded in two files (`mapping-row.tsx` and `data-source-preview-table.tsx`).

2. **Audit `status_colors.json`** before implementing CRITICAL-07 fixes. The CSS variable names for warning and success states must come from the actual token file, not be guessed.

3. **The color duplication** between `mapping-row.tsx` (`COLUMN_TYPE_COLORS`) and `data-source-preview-table.tsx` (`TYPE_BADGE_CONFIG`) is an architectural smell — these two components define the same mapping independently. Extract a shared `COLUMN_TYPE_BADGE_CONFIG` constant to a `constants.ts` file in the domain, and import it in both components.

4. **`transformation-drawer.tsx` placeholder strings** (`'Desde '`, `' kg'`) are example values specific to a use case. Consider whether these should be removed or if they represent a product decision that needs documentation.

---

## 8. Positive Highlights

- **Exceptional text-map coverage**: The vast majority of user-visible strings are correctly sourced from `dataEngineTextMaps`. The text-maps file itself is thorough and well-organized.
- **Consistent `'use client'` usage**: Every interactive component has the directive. No Server Component violations.
- **Zero relative import violations**: All cross-domain and cross-component imports use `@/` absolute paths without exception.
- **Named exports throughout**: Every component uses named exports. No `export default` in non-page files.
- **Mobile-first responsive**: Filter bars, grids, and drawers all use correct breakpoint progression.
- **Accessibility awareness**: `aria-label`, `role`, `sr-only` spans, and `aria-hidden` are used consistently — the violations are omissions, not misuse.
- **Suspense boundaries**: `DataEngineTabs` correctly wraps each tab content in `<Suspense>`.
- **Clean page file**: `page.tsx` is pure composition (only the two string violations prevent it from being perfect).
- **IntersectionObserver in `VariationThumbnail`**: Excellent performance optimization — Remotion Player only mounts when the card is in the viewport.
- **`RuleRow` operator options**: Cleanly typed and fully driven by text-maps — exemplary pattern.
