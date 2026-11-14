import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { executeGitCommand, getGitState } from '../../services';
import Button from '../common/Button';

/**
 * Reusable Interactive Terminal Component.
 * Powered by the local Git Command Interpreter (Milestone 11):
 * - Supports git init, status, add, commit, log, config, remote,
 *   branch, switch, checkout, merge, and shell utilities.
 * - Live simulated repository state tracking.
 * - Mobile quick-command tap pills.
 */
export default function Terminal({ style, title }) {
  const initialHistory = [
    {
      id: 'init-1',
      type: 'info',
      text: 'Git Quest Command Interpreter [Engine v11.0]\nType \'help\' to list available Git & shell commands.',
    },
    {
      id: 'init-2',
      type: 'output',
      text: 'Session connected to /home/developer/workspace/git-quest\nRun \'git init\' to initialize your repository.',
    },
  ];

  const [history, setHistory] = useState(initialHistory);
  const [inputValue, setInputValue] = useState('');
  const [repoState, setRepoState] = useState(getGitState());
  const scrollRef = useRef(null);

  const quickCommands = [
    'git init',
    'git status',
    'git add .',
    'git commit -m "Initial commit"',
    'git branch',
    'git branch feature/my-feature',
    'git switch feature/my-feature',
    'git switch -c hotfix/bug-fix',
    'git checkout -b release/v1.0',
    'git merge feature/my-feature',
    'git log --oneline',
    'git remote -v',
    'help',
    'clear',
  ];

  const runCommand = (cmdText) => {
    const rawCmd = (cmdText !== undefined ? cmdText : inputValue).trim();
    if (!rawCmd) return;

    // Append user's command line to output
    const commandEntry = {
      id: `cmd-${Date.now()}-${Math.random()}`,
      type: 'command',
      text: rawCmd,
    };

    // Execute through the dedicated interpreter service
    const result = executeGitCommand(rawCmd);

    if (result.type === 'clear') {
      setHistory([]);
      setInputValue('');
      setRepoState(getGitState());
      return;
    }

    const outputEntry = {
      id: `res-${Date.now()}-${Math.random()}`,
      type: result.type,
      text: result.output,
    };

    // Only add output entry if output is non-empty (some git commands like `git add` are intentionally silent on success)
    if (result.output && result.output.length > 0) {
      setHistory((prev) => [...prev, commandEntry, outputEntry]);
    } else {
      setHistory((prev) => [...prev, commandEntry]);
    }

    setInputValue('');
    setRepoState(getGitState());
  };

  const handleClear = () => {
    setHistory([]);
  };

  const displayTitle =
    title ||
    `bash - git-quest@local: ~/workspace ${
      repoState.isInitialized ? `(${repoState.currentBranch})` : ''
    }`;

  return (
    <View style={[styles.container, style]}>
      {/* ========================================================
          1. TERMINAL HEADER
          ======================================================== */}
      <View style={styles.header}>
        {/* Window controls */}
        <View style={styles.dotsGroup}>
          <View style={[styles.dot, { backgroundColor: colors.error }]} />
          <View style={[styles.dot, { backgroundColor: colors.warning }]} />
          <View style={[styles.dot, { backgroundColor: colors.success }]} />
        </View>

        {/* Dynamic Title & Status */}
        <View style={styles.titleGroup}>
          <Text style={styles.titleText} numberOfLines={1}>
            {displayTitle}
          </Text>
          <View style={styles.statusIndicator}>
            <View style={styles.statusLight} />
            <Text style={styles.statusText}>
              {repoState.isInitialized ? 'git ready' : 'ready'}
            </Text>
          </View>
        </View>

        {/* Clear Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.clearBtn}
          onPress={handleClear}
        >
          <Text style={styles.clearBtnText}>Clear ⌫</Text>
        </TouchableOpacity>
      </View>

      {/* ========================================================
          2. SCROLLABLE TERMINAL OUTPUT
          ======================================================== */}
      <ScrollView
        ref={scrollRef}
        style={styles.outputScroll}
        contentContainerStyle={styles.outputContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      >
        {history.length === 0 ? (
          <Text style={styles.emptyNotice}>
            Terminal cleared. Type &apos;help&apos; or &apos;git status&apos; to continue.
          </Text>
        ) : (
          history.map((entry) => {
            if (entry.type === 'command') {
              return (
                <View key={entry.id} style={styles.commandRow}>
                  <Text style={styles.promptLabel}>guest@git-quest:~$ </Text>
                  <Text style={styles.commandText}>{entry.text}</Text>
                </View>
              );
            }

            const getTextColor = () => {
              switch (entry.type) {
                case 'success':
                  return colors.success;
                case 'error':
                  return colors.error;
                case 'warning':
                  return colors.warning;
                case 'info':
                  return colors.info;
                case 'output':
                default:
                  return colors.textSecondary;
              }
            };

            return (
              <View key={entry.id} style={styles.outputRow}>
                <Text style={[styles.outputText, { color: getTextColor() }]}>
                  {entry.text}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ========================================================
          3. QUICK COMMAND SUGGESTION PILLS
          ======================================================== */}
      <View style={styles.pillsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsScroll}
          keyboardShouldPersistTaps="handled"
        >
          {quickCommands.map((cmd) => (
            <TouchableOpacity
              key={cmd}
              activeOpacity={0.7}
              style={styles.pill}
              onPress={() => runCommand(cmd)}
            >
              <Text style={styles.pillText}>{cmd}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ========================================================
          4. COMMAND INPUT & RUN BUTTON
          ======================================================== */}
      <View style={styles.inputBar}>
        <Text style={styles.inputPrompt}>$ </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Try 'git branch', 'git switch -c feat', 'git merge'..."
          placeholderTextColor={colors.textMuted}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={() => runCommand()}
          returnKeyType="go"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button
          title="Run ⏎"
          variant="primary"
          size="sm"
          style={styles.runBtn}
          onPress={() => {
            runCommand();
            Keyboard.dismiss();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.terminalBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dotsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 48,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 6,
  },
  titleGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  titleText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.code,
    fontSize: typography.sizes.xs - 1,
    marginRight: spacing.xs,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
  },
  statusLight: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 4,
  },
  statusText: {
    ...typography.caption,
    fontSize: 9,
    color: colors.success,
  },
  clearBtn: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  clearBtnText: {
    ...typography.caption,
    fontSize: typography.sizes.xs - 1,
    color: colors.textMuted,
  },
  outputScroll: {
    minHeight: 220,
    maxHeight: 380,
    backgroundColor: colors.terminalBackground,
  },
  outputContent: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  emptyNotice: {
    ...typography.code,
    color: colors.textMuted,
    fontStyle: 'italic',
    fontSize: typography.sizes.xs,
  },
  commandRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  promptLabel: {
    ...typography.code,
    color: colors.success,
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
  },
  commandText: {
    ...typography.code,
    color: colors.textPrimary,
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
  },
  outputRow: {
    marginBottom: spacing.xs,
  },
  outputText: {
    ...typography.code,
    fontSize: typography.sizes.xs,
    lineHeight: 18,
  },
  pillsContainer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xs,
  },
  pillsScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  pill: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xxs + 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: {
    ...typography.code,
    fontSize: typography.sizes.xs - 1,
    color: colors.accentLight,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  inputPrompt: {
    ...typography.code,
    color: colors.primaryLight,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  textInput: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.code,
    fontSize: typography.sizes.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  runBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
});
