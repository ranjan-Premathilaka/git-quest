/**
 * Git Quest - Branch Visualizer Screen (Milestone 11)
 *
 * Displays the interactive branch graph alongside a mini terminal
 * so users can run branching commands and see the graph update live.
 */

import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar as NativeStatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { Button, Badge, BranchGraph } from '../components';
import { getBranchGraphData, getGitState, executeGitCommand } from '../services';

// ── Quick-action branch workflow commands ──────────────────────────────────

const WORKFLOW_STEPS = [
  { label: '1. Init', cmd: 'git init', hint: 'Initialize repo' },
  { label: '2. Add all', cmd: 'git add .', hint: 'Stage files' },
  { label: '3. First commit', cmd: 'git commit -m "Initial commit"', hint: 'Root commit' },
  { label: '4. New branch', cmd: 'git branch feature/login', hint: 'Create branch' },
  { label: '5. Switch', cmd: 'git switch feature/login', hint: 'Go to branch' },
  { label: '6. Commit feat', cmd: 'git commit -m "Add login feature"', hint: 'Feature commit' },
  { label: '7. Switch main', cmd: 'git switch main', hint: 'Back to main' },
  { label: '8. Merge', cmd: 'git merge feature/login', hint: 'Merge branch' },
];

export default function BranchVisualizerScreen({ navigation }) {
  const [graphData, setGraphData] = useState(() => getBranchGraphData());
  const [repoState, setRepoState] = useState(() => getGitState());
  const [lastOutput, setLastOutput] = useState(null);

  const refresh = useCallback(() => {
    setGraphData(getBranchGraphData());
    setRepoState(getGitState());
  }, []);

  const runWorkflowCmd = useCallback((cmd) => {
    // Some commands need staged files; simulate a fresh file for feature commits.
    const state = getGitState();
    if (
      cmd.startsWith('git commit') &&
      state.isInitialized &&
      state.stagedFiles.length === 0
    ) {
      // Auto-add a placeholder file so the commit doesn't fail in the demo.
      executeGitCommand('git add .');
    }

    const result = executeGitCommand(cmd);
    setLastOutput({ cmd, ...result });
    refresh();
  }, [refresh]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Top navigation ──────────────────────────────────────────── */}
        <View style={styles.topRow}>
          <Button
            title="← Dashboard"
            variant="secondary"
            size="sm"
            onPress={() => navigation.navigate(ROUTES.DASHBOARD)}
          />
          <Badge label="Branch Visualizer v11.0" variant="gitMain" />
        </View>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.headerApp}>Git Quest • Branch Visualizer</Text>
          <Text style={styles.title}>Branch Graph</Text>
          <Text style={styles.subtitle}>
            Visualize your commit history and branch structure. Run the guided
            workflow steps below or head to the Terminal to type commands manually.
          </Text>
        </View>

        {/* ── Current branch status bar ───────────────────────────────── */}
        <View style={styles.statusBar}>
          <View style={styles.statusIndicator}>
            <View style={[
              styles.statusDot,
              { backgroundColor: repoState.isInitialized ? colors.success : colors.textMuted },
            ]} />
            <Text style={styles.statusText}>
              {repoState.isInitialized
                ? `On branch: ${repoState.currentBranch}`
                : 'No repository initialized'}
            </Text>
          </View>
          <TouchableOpacity onPress={refresh} style={styles.refreshBtn}>
            <Text style={styles.refreshText}>⟳ Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* ── Branch Graph ─────────────────────────────────────────────── */}
        <BranchGraph graphData={graphData} style={styles.graph} />

        {/* ── Last command output ─────────────────────────────────────── */}
        {lastOutput && (
          <View style={[
            styles.outputBox,
            lastOutput.type === 'error' && styles.outputBoxError,
            lastOutput.type === 'success' && styles.outputBoxSuccess,
          ]}>
            <Text style={styles.outputCmd}>$ {lastOutput.cmd}</Text>
            {lastOutput.output ? (
              <Text style={[
                styles.outputText,
                lastOutput.type === 'error' && styles.outputTextError,
                lastOutput.type === 'success' && styles.outputTextSuccess,
              ]}>
                {lastOutput.output}
              </Text>
            ) : (
              <Text style={styles.outputMuted}>(command executed successfully)</Text>
            )}
          </View>
        )}

        {/* ── Guided workflow ─────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Guided Branch Workflow</Text>
          <Text style={styles.sectionHint}>
            Tap each step in order to build your first feature branch workflow.
          </Text>
          <View style={styles.workflowGrid}>
            {WORKFLOW_STEPS.map((step, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.workflowCard}
                activeOpacity={0.75}
                onPress={() => runWorkflowCmd(step.cmd)}
              >
                <Text style={styles.workflowLabel}>{step.label}</Text>
                <Text style={styles.workflowCmd} numberOfLines={1}>
                  {step.cmd}
                </Text>
                <Text style={styles.workflowHint}>{step.hint}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Branch command reference ────────────────────────────────── */}
        <View style={styles.refCard}>
          <Text style={styles.refTitle}>Branch Commands (Milestone 11):</Text>

          {[
            ['git branch', 'List all branches'],
            ['git branch <name>', 'Create a new branch'],
            ['git branch -d <name>', 'Delete a branch'],
            ['git switch <name>', 'Switch to branch'],
            ['git switch -c <name>', 'Create & switch'],
            ['git checkout -b <name>', 'Create & switch (classic)'],
            ['git merge <name>', 'Merge branch into current'],
          ].map(([cmd, desc]) => (
            <View key={cmd} style={styles.refRow}>
              <Text style={styles.refCmd}>{cmd}</Text>
              <Text style={styles.refDesc}>{desc}</Text>
            </View>
          ))}
        </View>

        {/* ── Bottom navigation ───────────────────────────────────────── */}
        <View style={styles.bottomNav}>
          <Button
            title="💻 Open Terminal Sandbox →"
            variant="primary"
            size="md"
            style={styles.bottomBtn}
            onPress={() => navigation.navigate(ROUTES.TERMINAL)}
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
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? NativeStatusBar.currentHeight : 0,
  },
  scroll: {
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
    color: colors.git.feature,
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

  // Status bar
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    ...typography.code,
    fontSize: 11,
    color: colors.textSecondary,
  },
  refreshBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  refreshText: {
    ...typography.code,
    fontSize: 11,
    color: colors.accentLight,
  },

  // Graph
  graph: {
    marginBottom: spacing.md,
  },

  // Output box
  outputBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  outputBoxError: {
    borderColor: colors.error,
    backgroundColor: 'rgba(239,68,68,0.08)',
  },
  outputBoxSuccess: {
    borderColor: colors.success,
    backgroundColor: 'rgba(16,185,129,0.08)',
  },
  outputCmd: {
    ...typography.code,
    fontSize: 11,
    color: colors.success,
    marginBottom: 4,
  },
  outputText: {
    ...typography.code,
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  outputTextError: { color: colors.error },
  outputTextSuccess: { color: colors.success },
  outputMuted: {
    ...typography.code,
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
  },

  // Workflow
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sectionHint: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  workflowGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  workflowCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  workflowLabel: {
    ...typography.caption,
    color: colors.accentLight,
    marginBottom: 2,
  },
  workflowCmd: {
    ...typography.code,
    fontSize: 10,
    color: colors.primaryLight,
    marginBottom: 2,
  },
  workflowHint: {
    fontSize: 10,
    color: colors.textMuted,
  },

  // Reference card
  refCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  refTitle: {
    ...typography.h3,
    fontSize: typography.sizes.sm + 1,
    color: colors.git.main,
    marginBottom: spacing.xs,
  },
  refRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  refCmd: {
    ...typography.code,
    fontSize: 11,
    color: colors.primaryLight,
    minWidth: 160,
  },
  refDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },

  // Bottom nav
  bottomNav: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  bottomBtn: {
    width: '100%',
  },
});
