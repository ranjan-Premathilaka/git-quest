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
import Button from '../common/Button';

/**
 * Reusable Interactive Terminal Component.
 * Simulates a Unix/Git developer terminal with command execution,
 * history tracking, color-coded output, and auto-scrolling.
 */
export default function Terminal({ style, title = 'bash - git-quest@local: ~/workspace' }) {
  const initialHistory = [
    {
      id: 'init-1',
      type: 'info',
      text: 'Git Quest Interactive Terminal Simulation [v1.0.0]\nType \'help\' to display available commands.',
    },
    {
      id: 'init-2',
      type: 'output',
      text: 'Workspace initialized at /home/developer/workspace/git-quest (branch: main)',
    },
  ];

  const [history, setHistory] = useState(initialHistory);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef(null);

  const quickCommands = ['help', 'git --version', 'pwd', 'ls', 'clear'];

  const executeCommand = (cmdText) => {
    const rawCmd = (cmdText || inputValue).trim();
    if (!rawCmd) return;

    // Append the user's entered command to history
    const commandEntry = {
      id: `cmd-${Date.now()}-${Math.random()}`,
      type: 'command',
      text: rawCmd,
    };

    const lowerCmd = rawCmd.toLowerCase();

    if (lowerCmd === 'clear') {
      setHistory([]);
      setInputValue('');
      return;
    }

    let resultEntry;

    switch (lowerCmd) {
      case 'help':
        resultEntry = {
          id: `res-${Date.now()}`,
          type: 'info',
          text: [
            'Available demo commands (Milestone 09):',
            '  help          - List all supported commands and simulator info',
            '  clear         - Clear terminal history',
            '  git --version - Display simulated Git CLI engine version',
            '  pwd           - Print current working directory',
            '  ls            - List files and directories in current workspace',
            '',
            '💡 Full Git command interpretation & repository engine will be',
            '   expanded in Milestone 10 (git init, add, commit, status, etc.)',
          ].join('\n'),
        };
        break;

      case 'git --version':
        resultEntry = {
          id: `res-${Date.now()}`,
          type: 'success',
          text: 'git version 2.44.0.simulation.1',
        };
        break;

      case 'pwd':
        resultEntry = {
          id: `res-${Date.now()}`,
          type: 'output',
          text: '/home/developer/workspace/git-quest',
        };
        break;

      case 'ls':
        resultEntry = {
          id: `res-${Date.now()}`,
          type: 'output',
          text: 'assets/   src/   node_modules/   App.js   app.json   package.json   README.md',
        };
        break;

      default:
        resultEntry = {
          id: `res-${Date.now()}`,
          type: 'warning',
          text: [
            `git-quest: command received: '${rawCmd}'`,
            '💡 Milestone 09 supports predefined demo commands: help, clear, git --version, pwd, ls.',
            '   Full Git command interpretation and repository simulation will be expanded in Milestone 10!',
          ].join('\n'),
        };
        break;
    }

    setHistory((prev) => [...prev, commandEntry, resultEntry]);
    setInputValue('');
  };

  const handleClear = () => {
    setHistory([]);
  };

  return (
    <View style={[styles.container, style]}>
      {/* ========================================================
          1. TERMINAL WINDOW HEADER
          ======================================================== */}
      <View style={styles.header}>
        {/* macOS / Linux window dots */}
        <View style={styles.dotsGroup}>
          <View style={[styles.dot, { backgroundColor: colors.error }]} />
          <View style={[styles.dot, { backgroundColor: colors.warning }]} />
          <View style={[styles.dot, { backgroundColor: colors.success }]} />
        </View>

        {/* Title & Status */}
        <View style={styles.titleGroup}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.statusIndicator}>
            <View style={styles.statusLight} />
            <Text style={styles.statusText}>ready</Text>
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
          2. TERMINAL OUTPUT AREA (SCROLLABLE & AUTO-PINNED)
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
            Terminal cleared. Type &apos;help&apos; to view commands.
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
              onPress={() => executeCommand(cmd)}
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
          placeholder="Type a command (try 'help', 'git --version')..."
          placeholderTextColor={colors.textMuted}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={() => executeCommand()}
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
            executeCommand();
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
    width: 50,
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
