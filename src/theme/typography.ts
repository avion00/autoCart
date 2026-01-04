// ============================================
// AutoCart - Typography Definitions
// ============================================

import { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
};

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  huge: 32,
  giant: 40,
};

export const fontWeight: Record<string, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

export const lineHeight = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 32,
  xxxl: 36,
};

export const typography = {
  h1: {
    fontSize: fontSize.giant,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.xxxl,
  } as TextStyle,
  h2: {
    fontSize: fontSize.huge,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.xxxl,
  } as TextStyle,
  h3: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.xxl,
  } as TextStyle,
  h4: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.xl,
  } as TextStyle,
  h5: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.lg,
  } as TextStyle,
  h6: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.lg,
  } as TextStyle,
  body1: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.lg,
  } as TextStyle,
  body2: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.md,
  } as TextStyle,
  caption: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.sm,
  } as TextStyle,
  button: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.md,
  } as TextStyle,
  overline: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  } as TextStyle,
};
