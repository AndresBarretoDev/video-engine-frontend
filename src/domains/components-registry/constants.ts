// Components Registry domain constants
// Shared configuration used across component-card.tsx and component-detail.tsx

import type { ComponentType } from './types';

// ─── Component type badge styles ─────────────────────────────────────────────
// Maps component types to CSS classes using design system tokens.

export const COMPONENT_TYPE_BADGE_CLASSES: Record<ComponentType, string> = {
  atom: 'bg-[var(--ctype-atom-bg)] text-[var(--ctype-atom-text)] border-[var(--ctype-atom-border)]',
  molecule:
    'bg-[var(--ctype-molecule-bg)] text-[var(--ctype-molecule-text)] border-[var(--ctype-molecule-border)]',
  organism:
    'bg-[var(--ctype-organism-bg)] text-[var(--ctype-organism-text)] border-[var(--ctype-organism-border)]',
  template:
    'bg-[var(--ctype-template-bg)] text-[var(--ctype-template-text)] border-[var(--ctype-template-border)]'
};
