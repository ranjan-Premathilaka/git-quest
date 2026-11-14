/**
 * Git Quest - Theme Constants
 * 
 * Centralized color palette, spacing, typography, and styling tokens
 * based on the modern dark developer-themed design direction.
 */

export const colors = {
  // Core theme background & surfaces
  background: '#0B0F19',
  surface: '#131B2E',
  surfaceLight: '#1E293B',
  border: '#27354E',

  // Brand colors
  primary: '#8B5CF6',     // Primary purple
  accent: '#3B82F6',      // Accent blue
  
  // Terminal & diff feedback colors
  success: '#10B981',     // Terminal green / success / git addition
  error: '#EF4444',       // Terminal red / error / git deletion
  warning: '#F59E0B',     // Terminal yellow / warning / git modified
  info: '#06B6D4',        // Cyan info

  // Git graph branch tokens
  git: {
    main: '#8B5CF6',      // Main / master branch
    feature: '#3B82F6',   // Feature branch
    bugfix: '#EC4899',    // Hotfix / bugfix branch
    release: '#10B981',   // Release branch
    commitNode: '#FFFFFF',
    commitBorder: '#27354E',
  },

  // Typography colors
  textPrimary: '#FFFFFF',   // White primary text
  textSecondary: '#94A3B8', // Muted gray secondary text
  textMuted: '#64748B',

  // UI accents
  badgeBackground: 'rgba(139, 92, 246, 0.15)',
  codeBackground: 'rgba(59, 130, 246, 0.12)',
  terminalBackground: '#080C14',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    display: 40,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
