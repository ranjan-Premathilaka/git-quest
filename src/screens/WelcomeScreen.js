import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar as NativeStatusBar,
  ScrollView,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { Card, Badge, Button } from '../components';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Developer Badge */}
        <View style={styles.badgeRow}>
          <Badge
            label="$ git init git-quest"
            variant="gitMain"
          />
          <Badge
            label="Simulator v1.0"
            variant="gitDevelop"
            size="sm"
          />
        </View>

        {/* Branding & Headline */}
        <View style={styles.header}>
          <Text style={styles.appName}>Git Quest</Text>
          <Text style={styles.headline}>Master Git. One Quest at a Time.</Text>
          <Text style={styles.description}>
            Learn Git through interactive lessons, simulations, and challenges. Master branching, merging, and version control without breaking production.
          </Text>
        </View>

        {/* Developer-Themed Git Illustration Card */}
        <Card style={styles.illustrationCard} variant="terminal">
          <View style={styles.terminalHeader}>
            <View style={[styles.terminalDot, { backgroundColor: colors.error }]} />
            <View style={[styles.terminalDot, { backgroundColor: colors.warning }]} />
            <View style={[styles.terminalDot, { backgroundColor: colors.success }]} />
            <Text style={styles.terminalTitle}>git-quest://live-sim.sh</Text>
          </View>

          {/* Interactive terminal simulation snippet */}
          <View style={styles.terminalBody}>
            <View style={styles.terminalLine}>
              <Text style={styles.promptSymbol}>$ </Text>
              <Text style={styles.commandText}>git checkout -b quest/mastery</Text>
            </View>
            <Text style={styles.outputText}>
              Switched to a new branch &apos;quest/mastery&apos;
            </Text>

            {/* Visual Git Branch Line */}
            <View style={styles.visualGraph}>
              <View style={styles.graphRow}>
                <View style={[styles.node, { backgroundColor: colors.git.main }]} />
                <View style={[styles.edge, { backgroundColor: colors.git.main }]} />
                <View style={[styles.node, { backgroundColor: colors.git.feature }]} />
                <View style={[styles.edge, { backgroundColor: colors.git.feature }]} />
                <View style={[styles.node, { backgroundColor: colors.git.release }]} />
              </View>
              <View style={styles.graphLabels}>
                <Text style={[styles.graphLabel, { color: colors.git.main }]}>main</Text>
                <Text style={[styles.graphLabel, { color: colors.git.feature }]}>feature</Text>
                <Text style={[styles.graphLabel, { color: colors.git.release }]}>merged</Text>
              </View>
            </View>

            <View style={styles.simStatusRow}>
              <Text style={styles.statusLabel}>Sandbox Status:</Text>
              <Text style={styles.statusActive}>● Ready to Simulate</Text>
            </View>
          </View>
        </Card>

        {/* Actions: Start Learning & Explore Features */}
        <View style={styles.actionsSection}>
          <Button
            title="Start Learning →"
            variant="primary"
            size="lg"
            style={styles.primaryBtn}
            onPress={() => navigation.navigate(ROUTES.ONBOARDING)}
          />

          <Button
            title="Explore Features"
            variant="outline"
            size="md"
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate(ROUTES.ONBOARDING)}
          />

          <Button
            title="Direct to Dashboard →"
            variant="secondary"
            size="sm"
            style={styles.skipBtn}
            onPress={() => navigation.navigate(ROUTES.DASHBOARD)}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Interactive Git Learning Simulator • Milestone 5</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? NativeStatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.md,
  },
  appName: {
    ...typography.caption,
    color: colors.accent,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  headline: {
    ...typography.h1,
    fontSize: typography.sizes.display - 2,
    lineHeight: 42,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  illustrationCard: {
    marginVertical: spacing.md,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
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
  terminalBody: {
    paddingVertical: spacing.xs,
  },
  terminalLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promptSymbol: {
    color: colors.primary,
    fontFamily: typography.fontFamily.code,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
  },
  commandText: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.code,
    fontSize: typography.sizes.sm,
  },
  outputText: {
    color: colors.textMuted,
    fontFamily: typography.fontFamily.code,
    fontSize: typography.sizes.xs,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  visualGraph: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  graphRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  node: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  edge: {
    width: 48,
    height: 3,
  },
  graphLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 140,
    marginTop: spacing.xs,
  },
  graphLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily.code,
    fontWeight: typography.weights.semibold,
  },
  simStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statusLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  statusActive: {
    ...typography.caption,
    color: colors.success,
  },
  actionsSection: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  primaryBtn: {
    marginBottom: spacing.xs,
  },
  secondaryBtn: {
    marginBottom: spacing.xs,
  },
  skipBtn: {
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
  },
  footer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    ...typography.bodySmall,
    fontSize: typography.sizes.xs,
  },
});
