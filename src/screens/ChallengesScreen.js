import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { Badge, Button, Card } from '../components';
import { executeGitCommand, getGitState, resetGitState } from '../services';
import { awardChallenge } from '../services/progressService';

const tasks = [
  { title: 'Initialize a repository', description: 'Create a new local Git repository.', hint: 'git init', check: (s) => s.isInitialized },
  { title: 'Stage a file', description: 'Add README.md to the staging area.', hint: 'git add README.md', check: (s) => s.stagedFiles.includes('README.md') },
  { title: 'Create your first commit', description: 'Save the staged file with a commit message.', hint: 'git commit -m "My first commit"', check: (s) => (s.branches[s.currentBranch] || []).length > 0 },
  { title: 'Create and switch to a branch', description: 'Create a branch named feature/profile and switch to it.', hint: 'git switch -c feature/profile', check: (s) => s.currentBranch === 'feature/profile' },
  { title: 'Connect a remote repository', description: 'Add a remote named origin.', hint: 'git remote add origin https://github.com/user/project.git', check: (s) => Boolean(s.remotes.origin) },
];

export default function ChallengesScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([{ type: 'info', text: 'Welcome to Practical Git Challenges. Enter a Git command to complete each task.' }]);
  const [completed, setCompleted] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');

  useEffect(() => { resetGitState(); }, []);

  const runCommand = async (value = command) => {
    const input = value.trim();
    if (!input || completed) return;
    const result = executeGitCommand(input);
    const state = getGitState();
    const nextHistory = [...history, { type: 'command', text: `$ ${input}` }, ...(result.output ? [{ type: result.type, text: result.output }] : [])];
    if (tasks[step].check(state)) {
      nextHistory.push({ type: 'success', text: `✓ Challenge ${step + 1} completed: ${tasks[step].title}` });
      if (step === tasks.length - 1) {
        setCompleted(true);
        try {
          const reward = await awardChallenge('practical-git-basics', 50);
          setRewardMessage(reward.xpAwarded > 0 ? 'You earned 50 XP!' : 'Challenge already completed. No extra XP awarded.');
        } catch (error) {
          setRewardMessage('Challenge completed, but XP could not be saved.');
        }
      } else {
        setStep((current) => current + 1);
      }
    }
    setHistory(nextHistory);
    setCommand('');
    Keyboard.dismiss();
  };

  const restart = () => {
    resetGitState(); setStep(0); setCommand(''); setCompleted(false); setRewardMessage('');
    setHistory([{ type: 'info', text: 'New challenge session started. Complete the tasks in order.' }]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.topRow}>
          <Button title="← Dashboard" variant="secondary" size="sm" onPress={() => navigation.navigate(ROUTES.DASHBOARD)} />
        <Badge label={`${completed ? tasks.length : step + 1}/${tasks.length} Tasks`} variant="gitFeature" />
        </View>
        <Text style={styles.eyebrow}>GIT QUEST • HANDS-ON PRACTICE</Text>
        <Text style={styles.title}>Practical Git Challenges</Text>
        <Text style={styles.subtitle}>Complete five real-world Git tasks using the simulated terminal. Commands run only inside Git Quest.</Text>

        <Card style={styles.taskCard} variant="elevated">
          {completed ? (
            <>
              <Text style={styles.taskLabel}>ALL CHALLENGES COMPLETE</Text>
              <Text style={styles.taskTitle}>🎉 Quest completed!</Text>
              <Text style={styles.description}>You initialized a repository, staged and committed a file, created a branch, and connected a remote.</Text>
              <Text style={styles.reward}>{rewardMessage}</Text>
              <Button title="Try Again" onPress={restart} />
            </>
          ) : (
            <>
              <Text style={styles.taskLabel}>TASK {step + 1} OF {tasks.length}</Text>
              <Text style={styles.taskTitle}>{tasks[step].title}</Text>
              <Text style={styles.description}>{tasks[step].description}</Text>
              <Text style={styles.hintLabel}>COMMAND HINT</Text>
              <TouchableOpacity onPress={() => setCommand(tasks[step].hint)} style={styles.hintBox}>
                <Text style={styles.hint}>{tasks[step].hint}</Text>
                <Text style={styles.hintTap}>Tap to use</Text>
              </TouchableOpacity>
            </>
          )}
        </Card>

        <View style={styles.terminal}>
          <View style={styles.terminalHeader}><Text style={styles.terminalTitle}>●  ●  ●   git-quest@simulator</Text></View>
          <ScrollView style={styles.output} nestedScrollEnabled>
            {history.map((item, index) => <Text key={`${index}-${item.text}`} style={[styles.outputText, item.type === 'command' ? styles.command : item.type === 'error' ? styles.error : item.type === 'success' ? styles.success : null]}>{item.text}</Text>)}
          </ScrollView>
          {!completed && <View style={styles.inputRow}>
            <TextInput style={styles.input} value={command} onChangeText={setCommand} placeholder="Type a Git command..." placeholderTextColor={colors.textMuted} autoCapitalize="none" autoCorrect={false} onSubmitEditing={() => runCommand()} />
            <Button title="Run" size="sm" onPress={() => runCommand()} />
          </View>}
        </View>
        <Text style={styles.footer}>Progress is checked automatically after each command. Finish all five tasks to earn 50 XP on your first completion.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  eyebrow: { ...typography.caption, color: colors.accent, letterSpacing: 1.2 }, title: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg },
  taskCard: { marginBottom: spacing.lg, gap: spacing.sm }, taskLabel: { ...typography.caption, color: colors.accent }, taskTitle: { ...typography.h3, color: colors.textPrimary },
  description: { ...typography.body, color: colors.textSecondary }, hintLabel: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm },
  hintBox: { backgroundColor: colors.terminalBackground, borderRadius: borderRadius.md, padding: spacing.md, gap: spacing.xs }, hint: { ...typography.code, color: colors.primaryLight }, hintTap: { ...typography.caption, color: colors.textMuted },
  terminal: { backgroundColor: colors.terminalBackground, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  terminalHeader: { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }, terminalTitle: { ...typography.caption, color: colors.textSecondary },
  output: { maxHeight: 260, padding: spacing.md }, outputText: { ...typography.code, color: colors.textSecondary, marginBottom: spacing.sm }, command: { color: colors.primaryLight }, error: { color: colors.error }, success: { color: colors.success },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.sm },
  input: { flex: 1, color: colors.textPrimary, ...typography.code, padding: spacing.sm }, reward: { ...typography.h3, color: colors.success, marginVertical: spacing.md },
  footer: { ...typography.caption, color: colors.textMuted, marginTop: spacing.md, lineHeight: 20 },
});
