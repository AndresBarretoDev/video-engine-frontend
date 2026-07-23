/**
 * OP Video Engine — Available Font Options
 *
 * Google Fonts + system fonts for video production and advertising.
 * Google Fonts are loaded dynamically via CDN when the tokens editor mounts.
 *
 * Future: Add custom font upload support for brand-specific typography.
 */

export interface FontOption {
  value: string;
  label: string;
  source: 'google' | 'system';
}

export const FONT_OPTIONS: FontOption[] = [
  // Google Fonts
  { value: 'Inter', label: 'Inter', source: 'google' },
  { value: 'Montserrat', label: 'Montserrat', source: 'google' },
  { value: 'Roboto', label: 'Roboto', source: 'google' },
  { value: 'Open Sans', label: 'Open Sans', source: 'google' },
  { value: 'Poppins', label: 'Poppins', source: 'google' },
  { value: 'Lato', label: 'Lato', source: 'google' },
  { value: 'Oswald', label: 'Oswald', source: 'google' },
  { value: 'Raleway', label: 'Raleway', source: 'google' },
  { value: 'Nunito', label: 'Nunito', source: 'google' },
  { value: 'Playfair Display', label: 'Playfair Display', source: 'google' },
  { value: 'Merriweather', label: 'Merriweather', source: 'google' },
  { value: 'Source Sans 3', label: 'Source Sans 3', source: 'google' },
  { value: 'PT Sans', label: 'PT Sans', source: 'google' },
  { value: 'Rubik', label: 'Rubik', source: 'google' },
  { value: 'Work Sans', label: 'Work Sans', source: 'google' },
  { value: 'DM Sans', label: 'DM Sans', source: 'google' },
  { value: 'Barlow', label: 'Barlow', source: 'google' },
  { value: 'Mulish', label: 'Mulish', source: 'google' },
  { value: 'Bebas Neue', label: 'Bebas Neue', source: 'google' },
  { value: 'Anton', label: 'Anton', source: 'google' },
  { value: 'Archivo', label: 'Archivo', source: 'google' },
  { value: 'Space Grotesk', label: 'Space Grotesk', source: 'google' },
  // System fonts (available without loading)
  { value: 'Arial', label: 'Arial', source: 'system' },
  { value: 'Helvetica Neue', label: 'Helvetica Neue', source: 'system' },
  { value: 'Georgia', label: 'Georgia', source: 'system' },
  { value: 'Times New Roman', label: 'Times New Roman', source: 'system' }
];

/**
 * Build a Google Fonts CSS URL for all Google Fonts in the list.
 * Loads all weights (400, 700) for each font.
 */
export function getGoogleFontsUrl(): string {
  const googleFonts = FONT_OPTIONS.filter(f => f.source === 'google');
  const families = googleFonts
    .map(f => `family=${f.value.replace(/ /g, '+')}:wght@400;700`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
