/**
 * Enhanced theme system for SkillSwap app with modern colors, gradients, and typography
 * Includes comprehensive color palette, spacing, shadows, and animation presets
 */

import { Platform } from 'react-native';

// Modern Ocean Theme - Deep blues and teals with vibrant accents
const primary = '#0F172A'; // Deep navy blue
const primaryLight = '#1E293B';
const primaryDark = '#020617';

// Secondary colors - Vibrant teal accent
const secondary = '#06B6D4'; // Cyan/Teal
const secondaryLight = '#22D3EE';
const secondaryDark = '#0891B2';

// Tertiary accent color - Electric blue
const tertiary = '#3B82F6'; // Blue
const tertiaryLight = '#60A5FA';
const tertiaryDark = '#2563EB';

// Success, warning, error colors - Modern ocean theme
const success = '#10B981'; // Emerald green
const successLight = '#34D399';
const successDark = '#059669';

const warning = '#F59E0B'; // Amber
const warningLight = '#FBBF24';
const warningDark = '#D97706';

const error = '#EF4444'; // Red
const errorLight = '#F87171';
const errorDark = '#DC2626';

// Info color for notifications
const info = '#06B6D4'; // Cyan
const infoLight = '#22D3EE';
const infoDark = '#0891B2';

// Enhanced Neutral colors with better contrast
const gray50 = '#FAFAFA';
const gray100 = '#F4F4F5';
const gray200 = '#E4E4E7';
const gray300 = '#D4D4D8';
const gray400 = '#A1A1AA';
const gray500 = '#71717A';
const gray600 = '#52525B';
const gray700 = '#3F3F46';
const gray800 = '#27272A';
const gray900 = '#18181B';
const gray950 = '#09090B';

export const Colors = {
  light: {
    // Primary colors
    primary,
    primaryLight,
    primaryDark,
    secondary,
    secondaryLight,
    secondaryDark,
    tertiary,
    tertiaryLight,
    tertiaryDark,
    
    // Status colors
    success,
    successLight,
    successDark,
    warning,
    warningLight,
    warningDark,
    error,
    errorLight,
    errorDark,
    info,
    infoLight,
    infoDark,
    
    // Text colors
    text: gray900,
    textSecondary: gray600,
    textTertiary: gray500,
    textInverse: '#FFFFFF',
    
    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: gray50,
    backgroundTertiary: gray100,
    backgroundInverse: gray900,
    backgroundElevated: '#FFFFFF',
    backgroundOverlay: 'rgba(0, 0, 0, 0.5)',
    
    // Border colors
    border: gray200,
    borderSecondary: gray300,
    borderFocus: primary,
    
    // Surface colors
    surface: '#FFFFFF',
    surfaceSecondary: gray50,
    surfaceTertiary: gray100,
    
    // Interactive colors
    tint: primary,
    tabIconDefault: gray500,
    tabIconSelected: primary,
    icon: gray500,
    
    // Card colors
    cardBackground: '#FFFFFF',
    cardBorder: gray200,
    
    // Button colors
    buttonPrimary: primary,
    buttonPrimaryDisabled: gray300,
    buttonSecondary: gray100,
    buttonSecondaryDisabled: gray200,
    buttonDanger: error,
    buttonSuccess: success,
    buttonGhost: 'transparent',
    
    // Input colors
    inputBackground: '#FFFFFF',
    inputBorder: gray300,
    inputBorderFocus: primary,
    inputPlaceholder: gray400,
    
    // Shadow colors
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowStrong: 'rgba(0, 0, 0, 0.2)',
    shadowColored: 'rgba(102, 126, 234, 0.3)',
  },
  dark: {
    // Primary colors
    primary,
    primaryLight,
    primaryDark,
    secondary,
    secondaryLight,
    secondaryDark,
    tertiary,
    tertiaryLight,
    tertiaryDark,
    
    // Status colors
    success,
    successLight,
    successDark,
    warning,
    warningLight,
    warningDark,
    error,
    errorLight,
    errorDark,
    info,
    infoLight,
    infoDark,
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: gray300,
    textTertiary: gray400,
    textInverse: gray900,
    
    // Background colors
    background: gray900,
    backgroundSecondary: gray800,
    backgroundTertiary: gray700,
    backgroundInverse: '#FFFFFF',
    backgroundElevated: gray800,
    backgroundOverlay: 'rgba(0, 0, 0, 0.7)',
    
    // Border colors
    border: gray700,
    borderSecondary: gray600,
    borderFocus: primaryLight,
    
    // Surface colors
    surface: gray800,
    surfaceSecondary: gray700,
    surfaceTertiary: gray600,
    
    // Interactive colors
    tint: primaryLight,
    tabIconDefault: gray400,
    tabIconSelected: primaryLight,
    icon: gray400,
    
    // Card colors
    cardBackground: gray800,
    cardBorder: gray700,
    
    // Button colors
    buttonPrimary: primaryLight,
    buttonPrimaryDisabled: gray600,
    buttonSecondary: gray700,
    buttonSecondaryDisabled: gray600,
    buttonDanger: error,
    buttonSuccess: success,
    buttonGhost: 'transparent',
    
    // Input colors
    inputBackground: gray800,
    inputBorder: gray600,
    inputBorderFocus: primaryLight,
    inputPlaceholder: gray500,
    
    // Shadow colors
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowStrong: 'rgba(0, 0, 0, 0.5)',
    shadowColored: 'rgba(124, 142, 255, 0.4)',
  },
};

// Modern Ocean Gradients with deep blues and teals
export const Gradients = {
  primary: [primary, secondary],
  primaryReverse: [secondary, primary],
  secondary: [secondary, tertiary],
  tertiary: [tertiary, primary],
  success: [success, successDark],
  warning: [warning, warningDark],
  error: [error, errorDark],
  info: [info, infoDark],
  ocean: [primary, secondary, tertiary],
  deepOcean: [primaryDark, primary, secondary],
  aurora: [secondary, tertiary, '#8B5CF6'],
  galaxy: [primaryDark, '#1E293B', secondary],
  tropical: [tertiary, success, warning],
  midnight: [primaryDark, gray800, gray900],
  cyan: [secondary, secondaryLight],
  blue: [tertiary, tertiaryLight],
};

// Spacing scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

// Enhanced Typography scale with better hierarchy
export const Typography = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
  '7xl': 72,
  '8xl': 96,
};

// Font weights with more options
export const FontWeights = {
  thin: '100' as const,
  extralight: '200' as const,
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

// Line heights for better readability
export const LineHeights = {
  tight: 1.2,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

// Letter spacing for better typography
export const LetterSpacing = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
};

// Shadows
export const Shadows = {
  sm: Platform.select({
    web: { boxShadow: '0px 1px 2px rgba(0,0,0,0.05)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
  }) as any,
  md: Platform.select({
    web: { boxShadow: '0px 4px 8px rgba(0,0,0,0.10)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
  }) as any,
  lg: Platform.select({
    web: { boxShadow: '0px 8px 16px rgba(0,0,0,0.15)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 5,
    },
  }) as any,
  xl: Platform.select({
    web: { boxShadow: '0px 16px 24px rgba(0,0,0,0.20)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 8,
    },
  }) as any,
};

// Enhanced Animation durations with more options
export const AnimationDurations = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 800,
  slowest: 1200,
};

// Enhanced Animation easing with spring configurations
export const AnimationEasing = {
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  linear: 'linear',
  // Spring configurations for different effects
  spring: {
    damping: 15,
    stiffness: 150,
  },
  springGentle: {
    damping: 20,
    stiffness: 100,
  },
  springBouncy: {
    damping: 10,
    stiffness: 200,
  },
  springStiff: {
    damping: 25,
    stiffness: 300,
  },
};

// Animation presets for common use cases
export const AnimationPresets = {
  fadeIn: {
    duration: AnimationDurations.normal,
    easing: AnimationEasing.easeOut,
  },
  slideUp: {
    duration: AnimationDurations.normal,
    easing: AnimationEasing.spring,
  },
  scale: {
    duration: AnimationDurations.fast,
    easing: AnimationEasing.springBouncy,
  },
  bounce: {
    duration: AnimationDurations.slow,
    easing: AnimationEasing.springBouncy,
  },
};

// Enhanced Font system with custom fonts and better cross-platform support
export const Fonts = Platform.select({
  ios: {
    /** iOS system fonts with enhanced options */
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
    // Custom font families for better branding
    display: 'Inter-Bold',
    body: 'Inter-Medium',
    caption: 'Inter-Regular',
    button: 'Inter-SemiBold',
    brand: 'Inter-Black',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
    display: 'normal',
    body: 'normal',
    caption: 'normal',
    button: 'normal',
    brand: 'normal',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    display: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    caption: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    button: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    brand: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
});

// Font family mapping for easy access
export const FontFamilies = {
  primary: Fonts.sans,
  secondary: Fonts.serif,
  mono: Fonts.mono,
  rounded: Fonts.rounded,
  display: Fonts.display,
  body: Fonts.body,
  caption: Fonts.caption,
  button: Fonts.button,
  brand: Fonts.brand,
};
