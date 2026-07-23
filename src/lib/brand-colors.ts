// Lidl Brand Colors - Official Palette
export const lidlColors = {
  // Primary Colors (Legacy - keeping for compatibility)
  blue: {
    primary: '#0052CC', // Main corporate blue
    dark: '#003D99', // Darker blue for hover states
    light: '#4C9AFF', // Lighter blue for backgrounds
    muted: '#DEEBFF' // Very light blue for subtle backgrounds
  },
  yellow: {
    primary: '#FFD700', // Vibrant yellow from logo
    dark: '#E6C200', // Darker yellow for hover states
    light: '#FFE55C', // Lighter yellow for backgrounds
    muted: '#FFF8E1' // Very light yellow for subtle backgrounds
  },
  red: {
    primary: '#E30613', // Promotional red for prices/offers
    dark: '#B71C1C', // Darker red for hover states
    light: '#FF5252', // Lighter red for backgrounds
    muted: '#FFEBEE' // Very light red for subtle backgrounds
  },

  // Official Lidl Brand Colors
  blueOfficial: {
    '100': '#dfefff',
    '200': '#0d94e7',
    '300': '#0050aa',
    '400': '#1153a5',
    '500': '#084c95'
  },
  gray: {
    '100': '#ffffff',
    '200': '#f8f8f9',
    '300': '#ededed',
    '400': '#ecedee',
    '500': '#ececec',
    '600': '#e8e8e8',
    '700': '#d9e1e2',
    '800': '#d4d5d5',
    '900': '#d5d4d4',
    '1000': '#c0c0c0',
    '1100': '#888b8d',
    '1200': '#6e7272',
    '1300': '#000000'
  },
  scarletRed: {
    '100': '#ffdfe0',
    '200': '#ed1c24',
    '300': '#e60a14',
    '400': '#ff080d',
    '500': '#d0011b',
    '600': '#d2000d',
    '700': '#3f2021'
  },
  green: {
    '100': '#e0f9df',
    '200': '#28a228',
    '300': '#068906'
  },
  vermilion: {
    '100': '#ffeae0',
    '200': '#fe5000'
  },
  yellowOfficial: {
    '100': '#f9f9de',
    '200': '#fffccc',
    '300': '#fff200',
    '400': '#fff000'
  },
  blueViolet: {
    '100': '#6c7694',
    '200': '#43619c',
    '300': '#1d2c5a'
  },
  bluishCyan: {
    '100': '#8fd3f5'
  },
  redOfficial: {
    '100': '#f44336',
    '200': '#f24033'
  },
  khaki: {
    '100': '#edb700'
  },

  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121'
    }
  },

  // Semantic Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#E30613',
  info: '#0052CC',

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#EEEEEE'
  },

  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    tertiary: '#9E9E9E',
    inverse: '#FFFFFF'
  }
};

// Color utility functions
export const getLidlGradient = (
  type: 'primary' | 'secondary' | 'accent' = 'primary'
) => {
  switch (type) {
    case 'primary':
      return `linear-gradient(135deg, ${lidlColors.blue.primary} 0%, ${lidlColors.blue.dark} 100%)`;
    case 'secondary':
      return `linear-gradient(135deg, ${lidlColors.yellow.primary} 0%, ${lidlColors.yellow.dark} 100%)`;
    case 'accent':
      return `linear-gradient(135deg, ${lidlColors.red.primary} 0%, ${lidlColors.red.dark} 100%)`;
    default:
      return `linear-gradient(135deg, ${lidlColors.blue.primary} 0%, ${lidlColors.blue.dark} 100%)`;
  }
};

export const getLidlShadow = (
  color: 'blue' | 'yellow' | 'red' = 'blue',
  intensity: 'light' | 'medium' | 'heavy' = 'medium'
) => {
  void color;

  const intensityMap = {
    light: '0.1',
    medium: '0.3',
    heavy: '0.5'
  };

  return `0 4px 12px rgba(0, 82, 204, ${intensityMap[intensity]})`;
};
