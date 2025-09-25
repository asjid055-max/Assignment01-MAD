/**
 * Custom font loading utility for SkillSwap app
 * Handles font loading with fallbacks and error handling
 */

import * as Font from 'expo-font';
import { Platform } from 'react-native';

// Font definitions with proper fallbacks
export const CustomFonts = {
  'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
  'Inter-Medium': require('../../assets/fonts/Inter-Medium.ttf'),
  'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
  'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
  'Inter-Black': require('../../assets/fonts/Inter-Black.ttf'),
};

// Font loading function with error handling
export async function loadCustomFonts(): Promise<boolean> {
  try {
    await Font.loadAsync(CustomFonts);
    console.log('✅ Custom fonts loaded successfully');
    return true;
  } catch (error) {
    console.warn('⚠️ Failed to load custom fonts, using system fonts:', error);
    return false;
  }
}

// Font family mapping with fallbacks
export const FontFamilies = {
  regular: Platform.select({
    ios: 'Inter-Regular',
    android: 'Inter-Regular',
    default: 'normal',
  }),
  medium: Platform.select({
    ios: 'Inter-Medium',
    android: 'Inter-Medium',
    default: 'normal',
  }),
  semiBold: Platform.select({
    ios: 'Inter-SemiBold',
    android: 'Inter-SemiBold',
    default: 'bold',
  }),
  bold: Platform.select({
    ios: 'Inter-Bold',
    android: 'Inter-Bold',
    default: 'bold',
  }),
  black: Platform.select({
    ios: 'Inter-Black',
    android: 'Inter-Black',
    default: 'bold',
  }),
};

// Typography presets with custom fonts
export const TypographyPresets = {
  display: {
    fontSize: 36,
    fontWeight: '900' as const,
    fontFamily: FontFamilies.black,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  headline: {
    fontSize: 24,
    fontWeight: '700' as const,
    fontFamily: FontFamilies.bold,
    lineHeight: 32,
    letterSpacing: -0.25,
  },
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
    fontFamily: FontFamilies.semiBold,
    lineHeight: 28,
    letterSpacing: 0,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily: FontFamilies.regular,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    fontFamily: FontFamilies.medium,
    lineHeight: 24,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: FontFamilies.regular,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: FontFamilies.semiBold,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 12,
    fontWeight: '500' as const,
    fontFamily: FontFamilies.medium,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
};
