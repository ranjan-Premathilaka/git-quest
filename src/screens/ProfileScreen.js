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
            color={colors.primary}
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
            <View style={[styles.terminalDot, { backgroundColor: '#EF4444' }]} />
            <View style={[styles.terminalDot, { backgroundColor: '#F59E0B' }]} />
            <View style={[styles.terminalDot, { backgroundColor: '#10B981' }]} />
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
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  statLbl: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionsSection: {
    gap: spacing.md,
  },
  btn: {
    marginBottom: spacing.xs,
  },
});
