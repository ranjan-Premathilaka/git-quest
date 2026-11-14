import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, borderRadius, spacing } from '../constants/theme';

/**
 * Reusable developer badge component for tags and status labels.
 */
export default function Badge({ label, color = colors.primary, style, textStyle }) {
  return (
    <View style={[styles.badge, { borderColor: color }, style]}>
      <Text style={[styles.badgeText, { color }, textStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    backgroundColor: colors.badgeBackground,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
