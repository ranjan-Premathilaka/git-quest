import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, borderRadius, spacing, shadows, typography } from '../../constants/theme';

/**
 * Reusable developer-styled button component integrated with centralized design tokens.
 */
export default function Button({
  title,
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  disabled = false,
  ...props
}) {
  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'accent':
        return styles.accentContainer;
      case 'danger':
        return styles.dangerContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'accent':
        return styles.accentText;
      case 'danger':
        return styles.dangerText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.smallContainer;
      case 'lg':
        return styles.largeContainer;
      case 'md':
      default:
        return styles.mediumContainer;
    }
  };

  const getShadowStyle = () => {
    if (disabled || variant === 'outline' || variant === 'secondary') {
      return shadows.none;
    }
    return shadows.sm;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.baseContainer,
        getContainerStyle(),
        getSizeStyle(),
        getShadowStyle(),
        disabled && styles.disabledContainer,
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          styles.baseText,
          getTextStyle(),
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {title || children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    flexDirection: 'row',
  },
  mediumContainer: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
  },
  smallContainer: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  largeContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  primaryContainer: {
    backgroundColor: colors.primary,
  },
  secondaryContainer: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  accentContainer: {
    backgroundColor: colors.accent,
  },
  dangerContainer: {
    backgroundColor: colors.error,
  },
  disabledContainer: {
    opacity: 0.4,
  },
  baseText: {
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.md,
    letterSpacing: 0.3,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: colors.textPrimary,
  },
  outlineText: {
    color: colors.accent,
  },
  accentText: {
    color: '#FFFFFF',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  disabledText: {
    color: colors.textMuted,
  },
});
