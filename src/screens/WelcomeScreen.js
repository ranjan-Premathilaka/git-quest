import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar as NativeStatusBar,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { Card, Badge, Button } from '../components';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Developer-inspired badge */}
        <Badge
          label="$ git init git-quest"
          variant="primary"
          style={styles.badge}
        />

        {/* Header section */}
        <View style={styles.header}>
          <Text style={styles.title}>Git Quest</Text>
          <Text style={styles.subtitle}>Interactive Git Learning Simulator</Text>
        </View>

        {/* Modern rounded card */}
        <Card style={styles.card}>
          <View style={styles.terminalHeader}>
            <View style={[styles.terminalDot, { backgroundColor: colors.error }]} />
            <View style={[styles.terminalDot, { backgroundColor: colors.warning }]} />
            <View style={[styles.terminalDot, { backgroundColor: colors.success }]} />
            <Text style={styles.terminalTitle}>mission://intro</Text>
          </View>

          <Text style={styles.cardText}>
            Learn Git through interactive missions, challenges and simulations.
          </Text>

          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Milestone 4</Text>
            <Text style={styles.statusValue}>Design System Active</Text>
          </View>
        </Card>

        {/* Navigation Action CTA */}
        <View style={styles.ctaSection}>
          <Button
            title="Start Quest / Enter Dashboard →"
            variant="primary"
            size="lg"
            onPress={() => navigation?.navigate(ROUTES.DASHBOARD)}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Ready to master version control</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? NativeStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  badge: {
    marginBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    fontSize: 40,
  },
  subtitle: {
    ...typography.subtitle,
    fontSize: typography.sizes.lg,
    marginTop: spacing.xs,
  },
  card: {
    marginVertical: spacing.md,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  terminalDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.xs,
    marginRight: spacing.xs + 2,
  },
  terminalTitle: {
    marginLeft: spacing.xs,
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily.code,
  },
  cardText: {
    ...typography.body,
    fontSize: typography.sizes.md + 1,
    lineHeight: 24,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusLabel: {
    ...typography.caption,
    color: colors.primary,
  },
  statusValue: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily.code,
  },
  ctaSection: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    ...typography.bodySmall,
  },
});
