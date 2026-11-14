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
              label="Interpreter Engine v10.0"
              variant="gitMain"
            />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerApp}>Git Quest • Command Interpreter</Text>
            <Text style={styles.title}>Git Terminal Sandbox</Text>
            <Text style={styles.subtitle}>
              Execute real simulated Git operations. Track repository state, stage files, create commits, inspect logs, and manage remotes.
            </Text>
          </View>

          {/* Reusable Interactive Terminal Component */}
          <Terminal style={styles.terminal} />

          {/* Supported Commands Reference Card */}
          <View style={styles.hintBox}>
            <Text style={styles.hintTitle}>Supported Git Commands (Milestone 10):</Text>

            <View style={styles.commandCategory}>
              <Text style={styles.categoryLabel}>Repository & Staging:</Text>
              <Text style={styles.categoryText}>
                • <Text style={styles.codeText}>git init</Text> — Initialize repository{'\n'}
                • <Text style={styles.codeText}>git status</Text> — Inspect branch & file status{'\n'}
                • <Text style={styles.codeText}>git add .</Text> or <Text style={styles.codeText}>git add README.md</Text> — Stage files
              </Text>
            </View>

            <View style={styles.commandCategory}>
              <Text style={styles.categoryLabel}>Commits & History:</Text>
              <Text style={styles.categoryText}>
                • <Text style={styles.codeText}>git commit -m &quot;Your message&quot;</Text> — Record commit snapshot{'\n'}
                • <Text style={styles.codeText}>git log</Text> or <Text style={styles.codeText}>git log --oneline</Text> — View history
              </Text>
            </View>

            <View style={styles.commandCategory}>
              <Text style={styles.categoryLabel}>Config & Remotes:</Text>
              <Text style={styles.categoryText}>
                • <Text style={styles.codeText}>git config --global user.name &quot;Name&quot;</Text>{'\n'}
                • <Text style={styles.codeText}>git config --list</Text> — List settings{'\n'}
                • <Text style={styles.codeText}>git remote add origin https://github.com/repo.git</Text>{'\n'}
                • <Text style={styles.codeText}>git remote -v</Text> — List remotes
              </Text>
            </View>
          </View>

          {/* Bottom Navigation Links */}
          <View style={styles.bottomNav}>
            <Button
              title="Explore Learning Modules →"
              variant="primary"
              size="md"
              style={styles.bottomBtn}
              onPress={() => navigation.navigate(ROUTES.LESSONS)}
            />
            <Button
              title="← Back to Dashboard"
              variant="outline"
              size="sm"
              style={styles.bottomBtn}
              onPress={() => navigation.navigate(ROUTES.DASHBOARD)}
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
    gap: spacing.sm,
  },
  hintTitle: {
    ...typography.h3,
    fontSize: typography.sizes.sm + 1,
    color: colors.primaryLight,
    marginBottom: 2,
  },
  commandCategory: {
    marginVertical: 2,
  },
  categoryLabel: {
    ...typography.caption,
    color: colors.accent,
    marginBottom: 2,
  },
  categoryText: {
    ...typography.body,
    fontSize: typography.sizes.xs + 1,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  codeText: {
    ...typography.code,
    color: colors.primaryLight,
    fontWeight: typography.weights.bold,
  },
  bottomNav: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  bottomBtn: {
    width: '100%',
  },
});
