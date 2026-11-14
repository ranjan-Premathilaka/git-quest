import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../../constants/theme';

/**
 * Reusable developer-themed Card component with support for variants and elevations.
 */
export default function Card({
  children,
  variant = 'default',
  elevation = 'md',
  bordered = true,
  style,
  ...props
}) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'elevated':
        return colors.surfaceElevated;
      case 'terminal':
        return colors.terminalBackground;
      case 'subtle':
        return colors.surfaceLight;
      case 'default':
      default:
        return colors.surface;
    }
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: getBackgroundColor() },
        bordered && styles.bordered,
        shadows[elevation] || shadows.md,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});
