import React, { useEffect, useState } from 'react';
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
import { lessonsData } from '../data';
import { Card, Badge, Button } from '../components';
import { getProgress, markLessonCompleted } from '../services/progressService';

export default function LessonDetailsScreen({ route, navigation }) {
  // Read lessonId passed through navigation params, fallback to sample 'l-01'
  const lessonId = route?.params?.lessonId || 'l-01';
  const lesson = lessonsData[lessonId] || lessonsData['l-01'];

  // Load saved completion state for this lesson.
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionLoading, setCompletionLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getProgress()
      .then((progress) => {
        if (active) setIsCompleted(progress.completedLessons.includes(lessonId));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setCompletionLoading(false);
      });
    return () => { active = false; };
  }, [lessonId]);

  const progressPercent = Math.round(
    (lesson.lessonIndex / lesson.totalLessonsInModule) * 100
  );

  const handleToggleComplete = async () => {
    if (isCompleted || completionLoading) return;
    try {
      await markLessonCompleted(lessonId, lesson.xpReward);
      setIsCompleted(true);
    } catch (error) {
      console.warn('Unable to save lesson progress:', error);
    }
  };

  const handleNavigateNext = () => {
    if (lesson.nextLessonId) {
      navigation.navigate(ROUTES.LESSON_DETAILS, {
        lessonId: lesson.nextLessonId,
      });
    } else {
      navigation.navigate(ROUTES.LESSONS);
    }
  };

  const handleNavigatePrevious = () => {
    if (lesson.previousLessonId) {
      navigation.navigate(ROUTES.LESSON_DETAILS, {
        lessonId: lesson.previousLessonId,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================
            1. TOP BAR: BACK & MODULE BADGE
            ======================================================== */}
        <View style={styles.topRow}>
          <Button
            title="← Modules"
            variant="secondary"
            size="sm"
            onPress={() => navigation.navigate(ROUTES.LESSONS)}
          />
          <Badge
            label={lesson.moduleName}
            variant="gitMain"
          />
        </View>

        {/* ========================================================
            2. PROGRESS INDICATOR
            ======================================================== */}
        <View style={styles.progressHeader}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.stepCaption}>
              LESSON {lesson.lessonIndex} OF {lesson.totalLessonsInModule}
            </Text>
            <Text style={styles.progressPercentText}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercent}%` },
              ]}
            />
          </View>
        </View>

        {/* ========================================================
            3. LESSON HEADER & INTRODUCTION
            ======================================================== */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{lesson.title}</Text>
          <View style={styles.metaRow}>
            <Badge
              label={`⏱ ${lesson.estimatedTime}`}
              variant="gitFeature"
              size="sm"
              style={styles.metaBadge}
            />
            <Badge
              label={`+${lesson.xpReward} XP`}
              variant="gitRelease"
              size="sm"
            />
          </View>
          <Text style={styles.introduction}>{lesson.introduction}</Text>
        </View>

        {/* ========================================================
            4. LEARNING OBJECTIVES
            ======================================================== */}
        <Card style={styles.objectivesCard} variant="elevated">
          <View style={styles.terminalHeader}>
            <View style={[styles.terminalDot, { backgroundColor: colors.error }]} />
            <View style={[styles.terminalDot, { backgroundColor: colors.warning }]} />
            <View style={[styles.terminalDot, { backgroundColor: colors.success }]} />
            <Text style={styles.terminalTitle}>objectives://checklist.md</Text>
          </View>

          <Text style={styles.objectivesHeading}>Learning Objectives</Text>
          {lesson.objectives.map((obj, index) => (
            <View key={index} style={styles.objectiveItem}>
              <Text style={styles.objectiveCheck}>✓</Text>
              <Text style={styles.objectiveText}>{obj}</Text>
            </View>
          ))}
        </Card>

        {/* ========================================================
            5. EXPLANATION SECTIONS & TERMINOLOGY
            ======================================================== */}
        {lesson.sections.map((section, idx) => (
          <View key={idx} style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            {section.body && <Text style={styles.sectionBody}>{section.body}</Text>}

            {/* Terminology definition cards */}
            {section.terms && (
              <View style={styles.termsContainer}>
                {section.terms.map((item, tIdx) => (
                  <View key={tIdx} style={styles.termCard}>
                    <Text style={styles.termTitle}>{item.term}</Text>
                    <Text style={styles.termDefinition}>{item.definition}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* ========================================================
            6. GIT COMMAND EXAMPLES & TERMINAL OUTPUT
            ======================================================== */}
        {lesson.commandExample && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>{lesson.commandExample.title}</Text>
            <Text style={styles.sectionBody}>{lesson.commandExample.description}</Text>

            <Card style={styles.terminalCard} variant="terminal">
              <View style={styles.terminalHeader}>
                <View style={[styles.terminalDot, { backgroundColor: colors.error }]} />
                <View style={[styles.terminalDot, { backgroundColor: colors.warning }]} />
                <View style={[styles.terminalDot, { backgroundColor: colors.success }]} />
                <Text style={styles.terminalTitle}>bash://git-terminal</Text>
              </View>

              <View style={styles.commandLine}>
                <Text style={styles.promptSymbol}>$ </Text>
                <Text style={styles.commandText}>{lesson.commandExample.command}</Text>
              </View>

              <View style={styles.outputBox}>
                <Text style={styles.outputText}>{lesson.commandExample.output}</Text>
              </View>
            </Card>
          </View>
        )}

        {lesson.workflowExample && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>{lesson.workflowExample.title}</Text>
            <Text style={styles.sectionBody}>{lesson.workflowExample.description}</Text>

            <Card style={styles.terminalCard} variant="terminal">
              <View style={styles.terminalHeader}>
                <View style={[styles.terminalDot, { backgroundColor: colors.error }]} />
                <View style={[styles.terminalDot, { backgroundColor: colors.warning }]} />
                <View style={[styles.terminalDot, { backgroundColor: colors.success }]} />
                <Text style={styles.terminalTitle}>bash://git-status</Text>
              </View>

              <View style={styles.commandLine}>
                <Text style={styles.promptSymbol}>$ </Text>
                <Text style={styles.commandText}>{lesson.workflowExample.command}</Text>
              </View>

              <View style={styles.outputBox}>
                <Text style={styles.outputText}>{lesson.workflowExample.output}</Text>
              </View>
            </Card>
          </View>
        )}

        {/* ========================================================
            7. IMPORTANT TIPS & NOTES
            ======================================================== */}
        {lesson.tips && lesson.tips.length > 0 && (
          <Card style={styles.tipsCard} variant="subtle">
            <View style={styles.tipHeader}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipTitle}>Pro Tips for Developers</Text>
            </View>
            {lesson.tips.map((tip, tipIdx) => (
              <View key={tipIdx} style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* ========================================================
            8. MARK AS COMPLETED BUTTON (LOCAL STATE)
            ======================================================== */}
        <View style={styles.completionSection}>
          {isCompleted && (
            <View style={styles.completedBanner}>
              <Text style={styles.completedBannerText}>
                ✓ Lesson Completed! (+{lesson.xpReward} XP Earned)
              </Text>
            </View>
          )}

          <Button
            title={completionLoading ? 'Loading Progress...' : isCompleted ? 'Lesson Completed ✓' : 'Mark as Completed ✓'}
            variant={isCompleted ? 'secondary' : 'primary'}
            disabled={completionLoading || isCompleted}
            size="lg"
            style={styles.completionBtn}
            onPress={handleToggleComplete}
          />
        </View>

        {/* ========================================================
            9. PREVIOUS AND NEXT LESSON NAVIGATION
            ======================================================== */}
        <View style={styles.navRow}>
          <Button
            title="← Previous"
            variant="secondary"
            size="md"
            disabled={!lesson.previousLessonId}
            style={styles.prevLessonBtn}
            onPress={handleNavigatePrevious}
          />

          <Button
            title={lesson.nextLessonId ? 'Next Lesson →' : 'Finish Module →'}
            variant="accent"
            size="md"
            style={styles.nextLessonBtn}
            onPress={handleNavigateNext}
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  progressHeader: {
    marginBottom: spacing.lg,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  stepCaption: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  progressPercentText: {
    fontFamily: typography.fontFamily.code,
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  progressBarBg: {
    height: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  headerSection: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    fontSize: typography.sizes.display - 4,
    color: colors.textPrimary,
    lineHeight: 40,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  metaBadge: {
    marginRight: spacing.sm,
  },
  introduction: {
    ...typography.body,
    fontSize: typography.sizes.md,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  objectivesCard: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
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
  objectivesHeading: {
    ...typography.h3,
    fontSize: typography.sizes.md + 1,
    marginBottom: spacing.sm,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: spacing.xs,
  },
  objectiveCheck: {
    color: colors.success,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.md,
    marginRight: spacing.sm,
  },
  objectiveText: {
    ...typography.body,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  sectionBlock: {
    marginBottom: spacing.xl,
  },
  sectionHeading: {
    ...typography.h3,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sectionBody: {
    ...typography.body,
    fontSize: typography.sizes.sm + 1,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  termsContainer: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  termCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  termTitle: {
    ...typography.h3,
    fontSize: typography.sizes.sm + 1,
    color: colors.primaryLight,
    marginBottom: 2,
  },
  termDefinition: {
    ...typography.body,
    fontSize: typography.sizes.xs + 1,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  terminalCard: {
    marginVertical: spacing.xs,
    padding: spacing.md,
  },
  commandLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  promptSymbol: {
    color: colors.primary,
    fontFamily: typography.fontFamily.code,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  commandText: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.code,
    fontSize: typography.sizes.sm,
  },
  outputBox: {
    backgroundColor: colors.terminalBackground,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outputText: {
    ...typography.code,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  tipsCard: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  tipTitle: {
    ...typography.h3,
    fontSize: typography.sizes.md,
    color: colors.warning,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2,
  },
  tipBullet: {
    color: colors.warning,
    marginRight: spacing.sm,
    fontSize: typography.sizes.md,
  },
  tipText: {
    ...typography.body,
    fontSize: typography.sizes.xs + 1,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  completionSection: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  completedBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    width: '100%',
    alignItems: 'center',
  },
  completedBannerText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: typography.weights.bold,
  },
  completionBtn: {
    width: '100%',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  prevLessonBtn: {
    flex: 1,
  },
  nextLessonBtn: {
    flex: 1,
  },
});
