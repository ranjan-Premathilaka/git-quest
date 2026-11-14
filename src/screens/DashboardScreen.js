import React from 'react';
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
import { colors, spacing, borderRadius, typography, shadows } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { dashboardData } from '../data';
import { Card, Badge, Button } from '../components';

export default function DashboardScreen({ navigation }) {
  const { user, nextActivity, learningPaths, dailyChallenge } = dashboardData;

  const xpProgressPercent = Math.round((user.currentXP / user.nextLevelXP) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================
            1. HEADER: BRANDING, STATUS & GREETING
            ======================================================== */}
        <View style={styles.topStatusRow}>
          <View style={styles.branchStatusGroup}>
            <Badge
              label="branch: main"
              variant="gitMain"
              style={styles.headerBadge}
            />
            <Badge
              label={`🔥 ${user.streakDays}d streak`}
              variant="warning"
              style={styles.headerBadge}
            />
          </View>

          {/* Profile shortcut avatar */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.avatarButton}
            onPress={() => navigation.navigate(ROUTES.PROFILE)}
          >
            <Text style={styles.avatarText}>{user.avatarInitials}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greetingApp}>Git Quest • Mission Control</Text>
          <Text style={styles.greetingTitle}>Welcome Back, {user.name.split(' ')[0]} 👋</Text>
          <Text style={styles.greetingSubtitle}>Ready to commit to your learning today?</Text>
        </View>

        {/* ========================================================
            2. LEARNING PROGRESS: LEVEL & XP PROGRESS BAR
            ======================================================== */}
        <Card style={styles.progressCard} variant="elevated">
          <View style={styles.levelHeader}>
            <View>
              <Text style={styles.levelBadgeText}>LEVEL {user.level}</Text>
              <Text style={styles.levelTitle}>{user.levelTitle}</Text>
            </View>
            <View style={styles.xpBox}>
              <Text style={styles.xpValue}>
                {user.currentXP}{' '}
                <Text style={styles.xpMax}>/ {user.nextLevelXP} XP</Text>
              </Text>
              <Text style={styles.xpRemaining}>
                {user.nextLevelXP - user.currentXP} XP to Level {user.level + 1}
              </Text>
            </View>
          </View>

          {/* Animated styled progress bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${xpProgressPercent}%` }]} />
          </View>

          <View style={styles.progressMeta}>
            <Text style={styles.progressMetaText}>
              {user.completedMissions} of {user.totalMissions} Quests Completed
            </Text>
            <Text style={styles.progressMetaPercent}>{xpProgressPercent}% Mastery</Text>
          </View>
        </Card>

        {/* ========================================================
            3. CONTINUE LEARNING: NEXT MISSION HIGHLIGHT
            ======================================================== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <Badge label="In Progress" variant="gitFeature" size="sm" />
        </View>

        <Card style={styles.continueCard} variant="terminal">
          <View style={styles.terminalHeader}>
            <View style={[styles.terminalDot, { backgroundColor: colors.error }]} />
            <View style={[styles.terminalDot, { backgroundColor: colors.warning }]} />
            <View style={[styles.terminalDot, { backgroundColor: colors.success }]} />
            <Text style={styles.terminalTitle}>mission://active-quest</Text>
            <Text style={styles.rewardPill}>+{nextActivity.xpReward} XP</Text>
          </View>

          <Text style={styles.nextMilestone}>{nextActivity.milestone.toUpperCase()}</Text>
          <Text style={styles.nextTitle}>{nextActivity.title}</Text>
          <Text style={styles.nextDesc}>{nextActivity.description}</Text>

          {/* Code snippet prompt */}
          <View style={styles.codeSnippetContainer}>
            <Text style={styles.promptSymbol}>$ </Text>
            <Text style={styles.commandCode}>{nextActivity.commandSnippet}</Text>
          </View>

          <View style={styles.continueFooter}>
            <Text style={styles.timeEstimate}>⏱ Est. {nextActivity.estimatedTime}</Text>
            <Button
              title="Resume Mission →"
              variant="primary"
              size="md"
              onPress={() => navigation.navigate(ROUTES.LESSONS)}
            />
          </View>
        </Card>

        {/* ========================================================
            4. LEARNING PATHS: FUNDAMENTALS, BRANCHING, COLLABORATION
            ======================================================== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Learning Paths</Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LESSONS)}>
            <Text style={styles.sectionLink}>View All ({learningPaths.length}) →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pathsContainer}>
          {learningPaths.map((path) => (
            <TouchableOpacity
              key={path.id}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(ROUTES.LESSONS)}
            >
              <Card style={styles.pathCard}>
                <View style={styles.pathHeader}>
                  <View style={styles.pathTitleCol}>
                    <Text style={styles.pathTitle}>{path.title}</Text>
                    <Text style={styles.pathSubtitle}>{path.subtitle}</Text>
                  </View>
                  <Badge
                    label={path.badge}
                    variant={path.badgeVariant}
                    size="sm"
                  />
                </View>

                {/* Commands preview */}
                <View style={styles.pathCommandsBox}>
                  <Text style={styles.pathCommands}>{path.commands}</Text>
                </View>

                {/* Path progress bar */}
                <View style={styles.pathProgressRow}>
                  <View style={styles.pathProgressBarBg}>
                    <View
                      style={[
                        styles.pathProgressBarFill,
                        {
                          width: `${path.progressPercent}%`,
                          backgroundColor:
                            path.progressPercent > 0 ? colors.git.release : colors.border,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.pathProgressRatio}>
                    {path.completedCount}/{path.totalCount}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* ========================================================
            5. DAILY CHALLENGE: HIGHLIGHTED CHALLENGE CARD
            ======================================================== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Challenge</Text>
          <Badge label="Sprint Quest" variant="warning" size="sm" />
        </View>

        <Card style={styles.challengeCard} variant="elevated">
          <View style={styles.challengeTop}>
            <View style={styles.challengeIconBox}>
              <Text style={styles.challengeIcon}>⚡</Text>
            </View>
            <View style={styles.challengeHeaderInfo}>
              <Text style={styles.challengeTitle}>{dailyChallenge.title}</Text>
              <Text style={styles.challengeReward}>
                +{dailyChallenge.xpReward} XP Bonus • {dailyChallenge.timeEstimate}
              </Text>
            </View>
          </View>

          <Text style={styles.challengeDesc}>{dailyChallenge.description}</Text>

          <View style={styles.challengeSnippetBox}>
            <Text style={styles.promptSymbol}>$ </Text>
            <Text style={styles.challengeCode}>{dailyChallenge.commandSnippet}</Text>
          </View>

          <Button
            title="Start Daily Challenge →"
            variant="accent"
            size="md"
            style={styles.challengeBtn}
            onPress={() => navigation.navigate(ROUTES.LESSONS)}
          />
        </Card>

        {/* ========================================================
            6. QUICK STATISTICS: TOTAL XP, COMPLETED, STREAK
            ======================================================== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Statistics</Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.PROFILE)}>
            <Text style={styles.sectionLink}>Full Profile →</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.statsGrid}>
            <View style={styles.statColumn}>
              <Text style={styles.statLargeVal}>{user.currentXP}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>

            <View style={[styles.statColumn, styles.statBorderCol]}>
              <Text style={[styles.statLargeVal, { color: colors.accent }]}>
                {user.completedMissions}/{user.totalMissions}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>

            <View style={styles.statColumn}>
              <Text style={[styles.statLargeVal, { color: colors.warning }]}>
                {user.streakDays} Days
              </Text>
              <Text style={styles.statLabel}>Active Streak</Text>
            </View>
          </View>
        </Card>

        {/* Bottom Navigation Quick Links */}
        <View style={styles.bottomQuickLinks}>
          <Button
            title="Launch Terminal Simulator 💻"
            variant="primary"
            size="md"
            style={styles.quickLinkBtn}
            onPress={() => navigation.navigate(ROUTES.TERMINAL)}
          />
          <Button
            title="🌿 Branch Visualizer"
            variant="secondary"
            size="md"
            style={styles.quickLinkBtn}
            onPress={() => navigation.navigate(ROUTES.BRANCH_VISUALIZER)}
          />
          <Button
            title="Browse All Git Lessons"
            variant="secondary"
            size="md"
            style={styles.quickLinkBtn}
            onPress={() => navigation.navigate(ROUTES.LESSONS)}
          />
          <Button
            title="← Back to Welcome Screen"
            variant="outline"
            size="sm"
            style={styles.quickLinkBtn}
            onPress={() => navigation.navigate(ROUTES.WELCOME)}
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

  // 1. Header Styles
  topStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  branchStatusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerBadge: {
    marginRight: spacing.xs,
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  avatarText: {
    ...typography.caption,
    color: colors.primaryLight,
    fontWeight: typography.weights.extrabold,
    fontFamily: typography.fontFamily.code,
  },
  greetingSection: {
    marginBottom: spacing.lg,
  },
  greetingApp: {
    ...typography.caption,
    color: colors.accent,
    letterSpacing: 1.5,
    marginBottom: spacing.xxs,
  },
  greetingTitle: {
    ...typography.h2,
    fontSize: typography.sizes.display - 6,
    color: colors.textPrimary,
    lineHeight: 36,
  },
  greetingSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // 2. Learning Progress Card Styles
  progressCard: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderColor: colors.border,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  levelBadgeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: typography.weights.extrabold,
  },
  levelTitle: {
    ...typography.h3,
    fontSize: typography.sizes.lg,
    marginTop: 2,
  },
  xpBox: {
    alignItems: 'flex-end',
  },
  xpValue: {
    fontFamily: typography.fontFamily.code,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  xpMax: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
  },
  xpRemaining: {
    ...typography.bodySmall,
    fontSize: typography.sizes.xs - 1,
    color: colors.textMuted,
    marginTop: 2,
  },
  progressBarBg: {
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.terminalBackground,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginVertical: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  progressMetaText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  progressMetaPercent: {
    ...typography.caption,
    color: colors.primaryLight,
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: typography.sizes.lg,
    letterSpacing: -0.2,
  },
  sectionLink: {
    ...typography.bodySmall,
    color: colors.accent,
    fontWeight: typography.weights.semibold,
  },

  // 3. Continue Learning Styles
  continueCard: {
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
    flex: 1,
  },
  rewardPill: {
    ...typography.caption,
    color: colors.primaryLight,
    fontFamily: typography.fontFamily.code,
    backgroundColor: colors.badgeBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  nextMilestone: {
    ...typography.caption,
    color: colors.accent,
    marginBottom: 2,
  },
  nextTitle: {
    ...typography.h3,
    fontSize: typography.sizes.lg,
    marginBottom: spacing.xs,
  },
  nextDesc: {
    ...typography.body,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  codeSnippetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.terminalBackground,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  promptSymbol: {
    color: colors.primary,
    fontFamily: typography.fontFamily.code,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  commandCode: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.code,
    fontSize: typography.sizes.sm,
  },
  continueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeEstimate: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },

  // 4. Learning Paths Styles
  pathsContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  pathCard: {
    padding: spacing.md + 2,
  },
  pathHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  pathTitleCol: {
    flex: 1,
    marginRight: spacing.sm,
  },
  pathTitle: {
    ...typography.h3,
    fontSize: typography.sizes.md + 1,
  },
  pathSubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },
  pathCommandsBox: {
    backgroundColor: colors.terminalBackground,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  pathCommands: {
    ...typography.code,
    fontSize: typography.sizes.xs - 1,
    color: colors.textSecondary,
  },
  pathProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pathProgressBarBg: {
    flex: 1,
    height: 5,
    backgroundColor: colors.terminalBackground,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  pathProgressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  pathProgressRatio: {
    ...typography.caption,
    fontSize: typography.sizes.xs - 1,
    color: colors.textMuted,
    fontFamily: typography.fontFamily.code,
  },

  // 5. Daily Challenge Styles
  challengeCard: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  challengeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  challengeIconBox: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  challengeIcon: {
    fontSize: 18,
  },
  challengeHeaderInfo: {
    flex: 1,
  },
  challengeTitle: {
    ...typography.h3,
    fontSize: typography.sizes.md + 1,
  },
  challengeReward: {
    ...typography.caption,
    color: colors.warning,
    marginTop: 2,
  },
  challengeDesc: {
    ...typography.body,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  challengeSnippetBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.terminalBackground,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  challengeCode: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.code,
    fontSize: typography.sizes.sm,
  },
  challengeBtn: {
    width: '100%',
  },

  // 6. Quick Statistics Styles
  statsCard: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statBorderCol: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  statLargeVal: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    fontFamily: typography.fontFamily.code,
    marginBottom: spacing.xxs,
  },
  statLabel: {
    ...typography.caption,
    fontSize: typography.sizes.xs - 1,
    color: colors.textMuted,
  },

  // Bottom Links
  bottomQuickLinks: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  quickLinkBtn: {
    width: '100%',
  },
});
