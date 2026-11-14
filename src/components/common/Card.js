import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, borderRadius, spacing } from '../../constants/theme';

/**
 * Reusable modern rounded card component with a developer-themed border and surface.
 */
export default function Card({ children, style, ...props }) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
