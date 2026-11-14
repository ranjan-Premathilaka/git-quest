import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../../constants/theme';

/**
 * Reusable developer badge component for status indicators, git branch tags, and labels.
 */
export default function Badge({
  label,
  variant,
  color,
  size = 'md',
  style,
  textStyle,
}) {
  const resolveColor = () => {
    if (color) return color;
    switch (variant) {
      case 'accent':
        return colors.accent;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
        return colors.info;
      case 'gitMain':
        return colors.git.main;
      case 'gitDevelop':
        return colors.git.develop;
      case 'gitFeature':
        return colors.git.feature;
      case 'gitHotfix':
        return colors.git.hotfix;
      case 'gitRelease':
        return colors.git.release;
      case 'primary':
      default:
        return colors.primary;
    }
  };

  const badgeColor = resolveColor();
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          borderColor: badgeColor,
          paddingVertical: isSmall ? spacing.xxs : spacing.xs + 2,
          paddingHorizontal: isSmall ? spacing.sm : spacing.md,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          {
            color: badgeColor,
            fontSize: isSmall ? typography.sizes.xs - 1 : typography.sizes.xs,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    backgroundColor: colors.badgeBackground,
  },
  badgeText: {
    fontWeight: typography.weights.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
