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

export default function ProfileScreen({ navigation }) {
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
            label="user: quest-dev"
            variant="gitMain"
          />
        </View>

        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Developer Profile</Text>
          <Text style={styles.subtitle}>Simulator Identity & Progress</Text>
        </View>

        {/* Profile Card */}
        <Card style={styles.card}>
          <View style={styles.terminalHeader}>
            <View style={[styles.terminalDot, { backgroundColor: colors.error }]} />
            <View style={[styles.terminalDot, { backgroundColor: colors.warning }]} />
            <View style={[styles.terminalDot, { backgroundColor: colors.success }]} />
            <Text style={styles.terminalTitle}>git-config://user.profile</Text>
          </View>

          {/* User info row */}
          <View style={styles.userRow}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>GQ</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Guest Developer</Text>
              <Text style={styles.userEmail}>dev@gitquest.local</Text>
            </View>
          </View>

          {/* Stats grid */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>0</Text>
              <Text style={styles.statLbl}>Commits</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: colors.accent }]}>0 / 18</Text>
              <Text style={styles.statLbl}>Missions</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: colors.git.release }]}>Novice</Text>
              <Text style={styles.statLbl}>Rank</Text>
            </View>
          </View>
        </Card>

        {/* Navigation Action Buttons */}
        <View style={styles.actionsSection}>
          <Button
            title="Go to Dashboard →"
            variant="primary"
            size="md"
            style={styles.btn}
            onPress={() => navigation.navigate(ROUTES.DASHBOARD)}
          />
          <Button
            title="Go to Lessons →"
            variant="accent"
            size="md"
            style={styles.btn}
            onPress={() => navigation.navigate(ROUTES.LESSONS)}
          />
          <Button
            title="← Back to Welcome Screen"
            variant="secondary"
            size="md"
            style={styles.btn}
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
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.badgeBackground,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
    fontFamily: typography.fontFamily.code,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.h3,
    fontSize: typography.sizes.md + 1,
  },
  userEmail: {
    ...typography.code,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.xxs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    fontFamily: typography.fontFamily.code,
  },
  statLbl: {
    ...typography.caption,
    marginTop: spacing.xxs,
  },
  actionsSection: {
    gap: spacing.md,
  },
  btn: {
    marginBottom: spacing.xs,
  },
});
