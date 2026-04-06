// Brands domain types
// Handles brand configuration, tokens, logos, colors, fonts, and defaults

export interface BrandConfig {
  id: string;
  name: string;
  slug: string;
  description?: string;
  organizationId: string;
  clientId?: string;
  tokens?: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrandTokens {
  brandId: string;
  colorPrimary: string;
  colorSecondary?: string;
  colorAccent?: string;
  colorNeutral?: string;
  fontFamilyHeading: string;
  fontFamilyBody: string;
  fontSizeBase: number;
  lineHeightBase: number;
  borderRadiusBase: number;
  spacingBase: number;
  customTokens: Record<string, string | number>;
}

export interface BrandColors {
  brandId: string;
  colors: {
    name: string;
    hex: string;
    rgb?: string;
    usage?: string[];
  }[];
}

export interface BrandTypography {
  brandId: string;
  fonts: {
    name: string;
    family: string;
    weights: number[];
    variants: ('italic' | 'normal')[];
    lineHeight?: number;
  }[];
  headingStyle: {
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
  };
  bodyStyle: {
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
  };
}

export interface BrandAssets {
  brandId: string;
  logoUrl?: string;
  logoVariants?: string[];
  faviconUrl?: string;
  backgroundImageUrl?: string;
}

export interface BrandDefaults {
  brandId: string;
  defaultResolution: string; // e.g., "1920x1080"
  defaultFrameRate: number;
  defaultDuration: number; // seconds
  defaultAspectRatio: string; // e.g., "16:9"
  defaultOutputFormat: string;
  watermarkEnabled: boolean;
  watermarkPosition:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'center';
  watermarkOpacity: number;
}

export interface ClientBrandProfile {
  clientId: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  brandGuidelinesUrl?: string;
  contactPerson?: string;
  brands: BrandConfig[];
}
