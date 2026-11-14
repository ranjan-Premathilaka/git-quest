import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar as NativeStatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { Button, Badge, Terminal } from '../components';

export default function TerminalScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar Navigation */}
          <View style={styles.topRow}>
            <Button
              title="← Dashboard"
              variant="secondary"
              size="sm"
              onPress={() => navigation.navigate(ROUTES.DASHBOARD)}
            />
            <Badge
              label="Terminal Sandbox"
              variant="gitMain"
            />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerApp}>Git Quest • Developer Shell</Text>
            <Text style={styles.title}>Interactive Git Terminal</Text>
            <Text style={styles.subtitle}>
              Test commands, observe terminal output, and practice command-line workflows in a safe simulated shell.
            </Text>
          </View>

          {/* Reusable Interactive Terminal Component */}
          <Terminal
            style={styles.terminal}
            title="bash - git-quest@local: ~/workspace"
          />

          {/* Hint Card */}
          <View style={styles.hintBox}>
            <Text style={styles.hintTitle}>💡 Supported Demo Commands:</Text>
            <Text style={styles.hintBody}>
              Try running <Text style={styles.codeText}>help</Text>,{' '}
              <Text style={styles.codeText}>git --version</Text>,{' '}
              <Text style={styles.codeText}>pwd</Text>,{' '}
              <Text style={styles.codeText}>ls</Text>, or{' '}
              <Text style={styles.codeText}>clear</Text>.
            </Text>
            <Text style={styles.hintFooter}>
              Full Git repository simulation and state engine will be connected in Milestone 10.
            </Text>
          </View>

          {/* Bottom Navigation Link */}
          <View style={styles.bottomNav}>
            <Button
              title="Browse Git Learning Modules →"
              variant="outline"
              size="md"
              style={styles.bottomBtn}
              onPress={() => navigation.navigate(ROUTES.LESSONS)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? NativeStatusBar.currentHeight : 0,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerApp: {
    ...typography.caption,
    color: colors.accent,
    letterSpacing: 1.5,
    marginBottom: spacing.xxs,
  },
  title: {
    ...typography.h2,
    fontSize: typography.sizes.display - 6,
    color: colors.textPrimary,
    lineHeight: 36,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  terminal: {
    marginBottom: spacing.lg,
  },
  hintBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  hintTitle: {
    ...typography.h3,
    fontSize: typography.sizes.sm + 1,
    color: colors.primaryLight,
    marginBottom: 2,
  },
  hintBody: {
    ...typography.body,
    fontSize: typography.sizes.xs + 1,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  codeText: {
    ...typography.code,
    color: colors.accentLight,
    fontWeight: typography.weights.bold,
  },
  hintFooter: {
    ...typography.caption,
    fontSize: typography.sizes.xs - 1,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  bottomNav: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  bottomBtn: {
    width: '100%',
  },
});
