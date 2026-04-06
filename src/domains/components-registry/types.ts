// Components Registry domain types
// Handles registration of Remotion components (atoms/molecules/organisms), props schemas, preview thumbnails

export type ComponentType = 'atom' | 'molecule' | 'organism' | 'template';
export type ComponentStatus = 'draft' | 'published' | 'deprecated' | 'archived';

export interface RegisteredComponent {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: ComponentType;
  status: ComponentStatus;
  version: string;
  organizationId: string;
  category?: string;
  tags: string[];
  thumbnailUrl?: string;
  previewUrl?: string;
  sourceUrl?: string;
  documentation?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ComponentProps {
  componentId: string;
  schema: {
    [key: string]: ComponentPropSchema;
  };
}

export interface ComponentPropSchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'enum';
  required: boolean;
  default?: unknown;
  description?: string;
  enum?: unknown[];
  min?: number;
  max?: number;
  pattern?: string;
  items?: ComponentPropSchema;
  properties?: Record<string, ComponentPropSchema>;
}

export interface ComponentPreview {
  componentId: string;
  previewFrames: {
    url: string;
    timestamp: number; // seconds
  }[];
  videoUrl?: string;
  duration: number; // seconds
  width: number;
  height: number;
}

export interface ComponentUsage {
  componentId: string;
  projectId: string;
  usageCount: number;
  firstUsedAt: string;
  lastUsedAt: string;
}

export interface ComponentDependency {
  componentId: string;
  dependencyComponentId: string;
  type: 'requires' | 'extends' | 'includes';
  version?: string;
}

export interface ComponentLibrary {
  id: string;
  name: string;
  organizationId: string;
  description?: string;
  components: RegisteredComponent[];
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComponentPreset {
  id: string;
  name: string;
  componentId: string;
  presetProps: Record<string, unknown>;
  description?: string;
  thumbnail?: string;
  createdBy: string;
  createdAt: string;
}
