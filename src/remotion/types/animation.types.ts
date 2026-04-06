export interface SpringConfig {
  damping: number;
  stiffness: number;
  mass: number;
}

export const SPRING_PRESETS = {
  ui: { damping: 14, stiffness: 150, mass: 1 } satisfies SpringConfig,
  bouncy: { damping: 6, stiffness: 300, mass: 1 } satisfies SpringConfig,
  snappy: { damping: 20, stiffness: 200, mass: 1 } satisfies SpringConfig,
  slow: { damping: 20, stiffness: 80, mass: 1 } satisfies SpringConfig
} as const;

export type SpringPresetName = keyof typeof SPRING_PRESETS;

export interface AnimationConfig {
  delay: number;
  duration: number;
  springConfig?: SpringConfig;
}

export interface EntryAnimationResult {
  opacity: number;
  transform: string;
}
