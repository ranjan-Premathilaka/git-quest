import React, { useState } from 'react';
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

export default function OnboardingScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 0,
      badge: 'Interactive Terminal',
      badgeVariant: 'gitMain',
      title: 'Learn Git Commands Interactively',
      description:
        'Execute real Git commands in an interactive sandbox. From git init to rebasing, receive instant feedback and watch your repository state evolve.',
      terminalHeader: 'terminal://git-cli.sh',
      visualType: 'terminal',
    },
    {
      id: 1,
      badge: 'Visual Branching',
      badgeVariant: 'gitFeature',
      title: 'Practice Branching & Merging',
      description:
        'Master Git branch graphs, resolve merge conflicts, and explore safe experiment workflows without the fear of corrupting a real project.',
      terminalHeader: 'graph://branches.visual',
      visualType: 'graph',
    },
    {
      id: 2,
      badge: 'Gamified Quests',
      badgeVariant: 'gitRelease',
      title: 'Complete Challenges & Earn XP',
      description:
        'Conquer missions designed by senior developers. Unlock achievements, level up your developer profile, and build muscle memory for professional workflows.',
      terminalHeader: 'quests://rewards.xp',
      visualType: 'rewards',
    },
  ];

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate(ROUTES.DASHBOARD);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigation.navigate(ROUTES.DASHBOARD);
  };

  // Render developer-themed visual illustrations for each step
  const renderVisual = () => {
    if (step.visualType === 'terminal') {
      return (
        <View style={styles.visualContainer}>
          <View style={styles.codeLine}>
            <Text style={styles.promptSymbol}>$ </Text>
            <Text style={styles.commandText}>git init git-quest</Text>
          </View>
          <Text style={styles.outputText}>Initialized empty Git repository in .git/</Text>

          <View style={[styles.codeLine, { marginTop: spacing.sm }]}>
            <Text style={styles.promptSymbol}>$ </Text>
            <Text style={styles.commandText}>git add -A</Text>
          </View>

          <View style={styles.codeLine}>
            <Text style={styles.promptSymbol}>$ </Text>
            <Text style={styles.commandText}>git commit -m &quot;feat: first quest&quot;</Text>
          </View>
          <Text style={[styles.outputText, { color: colors.success }]}>
            [main (root-commit) 8f3a912] feat: first quest
          </Text>
        </View>
      );
    }

    if (step.visualType === 'graph') {
      return (
        <View style={styles.visualContainer}>
          {/* Main branch line */}
          <View style={styles.branchRow}>
            <View style={[styles.commitNode, { backgroundColor: colors.git.main }]} />
            <View style={[styles.branchLine, { backgroundColor: colors.git.main }]} />
            <View style={[styles.commitNode, { backgroundColor: colors.git.main }]} />
            <View style={[styles.branchLine, { backgroundColor: colors.git.main }]} />
            <View style={[styles.commitNode, { backgroundColor: colors.git.merge }]} />
            <Text style={[styles.branchLabel, { color: colors.git.main }]}> main</Text>
          </View>

          {/* Feature branch line */}
          <View style={[styles.branchRow, { marginLeft: spacing.xl }]}>
            <View style={[styles.branchSplit, { borderColor: colors.git.feature }]} />
            <View style={[styles.commitNode, { backgroundColor: colors.git.feature }]} />
            <View style={[styles.branchLine, { backgroundColor: colors.git.feature }]} />
            <View style={[styles.commitNode, { backgroundColor: colors.git.feature }]} />
            <Text style={[styles.branchLabel, { color: colors.git.feature }]}> feat/quest</Text>
          </View>

          <View style={styles.graphNote}>
            <Text style={styles.graphNoteText}>Merge into main • 0 conflicts</Text>
          </View>
        </View>
      );
    }

    // Rewards step visual
    return (
      <View style={styles.visualContainer}>
        <View style={styles.rewardCard}>
          <View style={styles.rewardHeader}>
            <Text style={styles.rewardBadge}>★ QUEST COMPLETED</Text>
            <Text style={styles.rewardXp}>+250 XP</Text>
          </View>

          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '75%' }]} />
          </View>

          <View style={styles.rewardFooter}>
            <Text style={styles.rewardRank}>Rank: Git Novice</Text>
            <Text style={styles.rewardLevel}>Level 2 (750/1000 XP)</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Controls: Step Indicator & Skip */}
        <View style={styles.topBar}>
          <Text style={styles.stepCounter}>
            STEP {currentStep + 1} OF {steps.length}
          </Text>
          <Button
            title="Skip →"
            variant="outline"
            size="sm"
            onPress={handleSkip}
          />
        </View>

        {/* Progress Bar Indicators */}
        <View style={styles.progressIndicators}>
          {steps.map((s, idx) => (
            <View
              key={s.id}
              style={[
                styles.indicatorSegment,
                idx === currentStep && styles.indicatorActive,
                idx < currentStep && styles.indicatorCompleted,
              ]}
            />
          ))}
        </View>

        {/* Badge & Title */}
        <View style={styles.header}>
          <Badge
            label={step.badge}
            variant={step.badgeVariant}
            style={styles.badge}
          />
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.description}>{step.description}</Text>
        </View>

        {/* Interactive Feature Visual Card */}
        <Card style={styles.card} variant="terminal">
          <View style={styles.terminalHeader}>
            <View style={[styles.terminalDot, { backgroundColor: colors.error }]} />
            <View style={[styles.terminalDot, { backgroundColor: colors.warning }]} />
            <View style={[styles.terminalDot, { backgroundColor: colors.success }]} />
            <Text style={styles.terminalTitle}>{step.terminalHeader}</Text>
          </View>
          {renderVisual()}
        </Card>

        {/* Navigation Controls: Back & Continue */}
        <View style={styles.controlsSection}>
          {currentStep > 0 ? (
            <Button
              title="← Previous"
              variant="secondary"
              size="lg"
              style={styles.prevBtn}
              onPress={handlePrevious}
            />
          ) : null}

          <Button
            title={currentStep === steps.length - 1 ? 'Start Learning Now →' : 'Continue →'}
            variant="primary"
            size="lg"
            style={styles.nextBtn}
            onPress={handleNext}
          />
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
    paddingBottom: spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  stepCounter: {
    ...typography.caption,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  progressIndicators: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    marginBottom: spacing.xl,
  },
  indicatorSegment: {
    flex: 1,
    height: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
  },
  indicatorActive: {
    backgroundColor: colors.primary,
  },
  indicatorCompleted: {
    backgroundColor: colors.accent,
  },
  header: {
    marginBottom: spacing.lg,
  },
  badge: {
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    fontSize: typography.sizes.display - 6,
    lineHeight: 36,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  card: {
    marginVertical: spacing.lg,
    minHeight: 180,
    justifyContent: 'center',
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
  visualContainer: {
    paddingVertical: spacing.xs,
  },
  codeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  promptSymbol: {
    color: colors.accent,
    fontFamily: typography.fontFamily.code,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
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
    marginVertical: 2,
  },
  branchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  commitNode: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  branchLine: {
    width: 32,
    height: 3,
  },
  branchSplit: {
    width: 16,
    height: 16,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    marginRight: spacing.xs,
  },
  branchLabel: {
    fontFamily: typography.fontFamily.code,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    marginLeft: spacing.xs,
  },
  graphNote: {
    marginTop: spacing.md,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  graphNoteText: {
    ...typography.caption,
    color: colors.success,
  },
  rewardCard: {
    backgroundColor: colors.surfaceLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  rewardBadge: {
    ...typography.caption,
    color: colors.warning,
  },
  rewardXp: {
    fontFamily: typography.fontFamily.code,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    fontSize: typography.sizes.md,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    marginVertical: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  rewardRank: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  rewardLevel: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  controlsSection: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  prevBtn: {
    marginBottom: spacing.xs,
  },
  nextBtn: {
    marginBottom: spacing.xs,
  },
});
