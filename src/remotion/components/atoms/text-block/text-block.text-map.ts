/**
 * TextBlock text map — accessibility labels and display strings.
 * Externalizes all static strings following project conventions.
 */
export const TEXT_BLOCK_TEXT_MAP = {
  ariaLabel: 'Animated text block',
  typewriterCursor: '|'
} as const;

export type TextBlockTextMap = typeof TEXT_BLOCK_TEXT_MAP;
