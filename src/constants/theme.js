import { Platform } from 'react-native';

/**
 * Git Quest - Centralized Design System
 * 
 * Consistent developer-themed styling tokens:
 * - Deep dark background & layered surfaces
 * - Primary purple / blue brand accents
 * - Git branch & status color semantics
 * - Responsive typography & monospace tokens
 * - Elevation & border radius scales
 */

export const colors = {
  // Deep dark developer theme backgrounds & surfaces
  background: '#0B0F19',
  surface: '#131B2E',
  surfaceLight: '#1E293B',
  surfaceElevated: '#1A2338',
  terminalBackground: '#080C14',

  // Borders
  border: '#27354E',
  borderLight: '#334155',

  // Primary purple brand colors
  primary: '#8B5CF6',
  primaryDark: '#7C3AED',
  primaryLight: '#A78BFA',

  // Accent blue brand colors
  accent: '#3B82F6',
  accentDark: '#2563EB',
  accentLight: '#60A5FA',

  // Terminal & diff feedback colors
  success: '#10B981', // Terminal green / addition
  warning: '#F59E0B', // Terminal amber / modified
  error: '#EF4444',   // Terminal red / deletion
  info: '#06B6D4',    // Cyan info

  // Git-specific branch tokens
  git: {
    main: '#8B5CF6',      // Main / master branch
    develop: '#06B6D4',   // Development branch
    feature: '#3B82F6',   // Feature branches
    hotfix: '#EC4899',    // Hotfix / bugfix branches
    release: '#10B981',   // Release branches
    merge: '#F59E0B',     // Merge indicators
    commitNode: '#FFFFFF',
    commitBorder: '#27354E',
  },

  // Typography colors
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // UI accents & overlays
  badgeBackground: 'rgba(139, 92, 246, 0.15)',
  codeBackground: 'rgba(59, 130, 246, 0.12)',
  cardOverlay: 'rgba(255, 255, 255, 0.02)',
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
};

const codeFont = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

export const typography = {
  fontFamily: {
    code: codeFont,
    regular: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    display: 36,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  // Reusable typography presets
  h1: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.accent,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textMuted,
    lineHeight: 18,
  },
  caption: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  code: {
    fontFamily: codeFont,
    fontSize: 13,
    color: colors.textSecondary,
  },
};
