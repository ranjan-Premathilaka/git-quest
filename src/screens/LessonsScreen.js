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
import { colors, spacing, borderRadius } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { Card, Badge, Button } from '../components';

export default function LessonsScreen({ navigation }) {
  const lessonTracks = [
    { id: '1', title: 'Git Fundamentals', desc: 'init, status, add, commit', tag: 'Beginner' },
    { id: '2', title: 'Branching & Merging', desc: 'branch, switch, merge, rebase', tag: 'Intermediate' },
    { id: '3', title: 'Remotes & Collaboration', desc: 'fetch, pull, push, remotes', tag: 'Advanced' },
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
            color={colors.accent}
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
            <View style={[styles.terminalDot, { backgroundColor: '#EF4444' }]} />
            <View style={[styles.terminalDot, { backgroundColor: '#F59E0B' }]} />
            <View style={[styles.terminalDot, { backgroundColor: '#10B981' }]} />
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
                color={colors.git.release}
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
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.accent,
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
    borderRadius: 4,
    marginRight: 6,
  },
  terminalTitle: {
    marginLeft: spacing.xs,
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  cardIntro: {
    fontSize: 14,
    color: colors.textSecondary,
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
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  trackDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
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
