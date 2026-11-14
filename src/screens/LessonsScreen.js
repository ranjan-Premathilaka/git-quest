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

export default function LessonsScreen({ navigation }) {
  const lessonTracks = [
    {
      id: '1',
      title: 'Git Fundamentals',
      desc: 'init, status, add, commit',
      tag: 'Beginner',
      variant: 'gitRelease',
    },
    {
      id: '2',
      title: 'Branching & Merging',
      desc: 'branch, switch, merge, rebase',
      tag: 'Intermediate',
      variant: 'gitDevelop',
    },
    {
      id: '3',
      title: 'Remotes & Collaboration',
      desc: 'fetch, pull, push, remotes',
      tag: 'Advanced',
      variant: 'gitMain',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Bar */}
        <View style={styles.topRow}>
          <Button
            title="← Back"
            variant="secondary"
            size="sm"
            onPress={() => navigation.goBack()}
          />
          <Badge
            label="topic: git-basics"
            variant="gitFeature"
          />
        </View>

        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Git Lessons</Text>
          <Text style={styles.subtitle}>Interactive Learning Tracks</Text>
        </View>

        {/* Tracks Placeholder Card */}
        <Card style={styles.card}>
          <View style={styles.terminalHeader}>
            <View style={[styles.terminalDot, { backgroundColor: colors.error }]} />
            <View style={[styles.terminalDot, { backgroundColor: colors.warning }]} />
            <View style={[styles.terminalDot, { backgroundColor: colors.success }]} />
            <Text style={styles.terminalTitle}>lessons://catalog.json</Text>
          </View>

          <Text style={styles.cardIntro}>
            Lesson modules will be populated in upcoming milestones. Below is a preview of the planned learning tracks:
          </Text>

          {lessonTracks.map((track) => (
            <View key={track.id} style={styles.trackItem}>
              <View style={styles.trackContent}>
                <Text style={styles.trackTitle}>{track.title}</Text>
                <Text style={styles.trackDesc}>{track.desc}</Text>
              </View>
              <Badge
                label={track.tag}
                variant={track.variant}
                size="sm"
                style={styles.trackBadge}
              />
            </View>
          ))}
        </Card>

        {/* Navigation Actions */}
        <View style={styles.actionsSection}>
          <Button
            title="Go to Dashboard →"
            variant="primary"
            size="md"
            style={styles.btn}
            onPress={() => navigation.navigate(ROUTES.DASHBOARD)}
          />
          <Button
            title="View Profile →"
            variant="accent"
            size="md"
            style={styles.btn}
            onPress={() => navigation.navigate(ROUTES.PROFILE)}
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
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    fontSize: typography.sizes.display - 4,
  },
  subtitle: {
    ...typography.subtitle,
    marginTop: spacing.xs,
  },
  card: {
    marginBottom: spacing.xl,
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
  cardIntro: {
    ...typography.body,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  trackItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  trackContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  trackTitle: {
    ...typography.h3,
    fontSize: typography.sizes.md,
  },
  trackDesc: {
    ...typography.code,
    fontSize: typography.sizes.xs + 1,
    color: colors.textMuted,
    marginTop: spacing.xxs,
  },
  trackBadge: {
    paddingHorizontal: spacing.sm + 2,
  },
  actionsSection: {
    gap: spacing.md,
  },
  btn: {
    marginBottom: spacing.xs,
  },
});
