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

export default function DashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Status Row */}
        <View style={styles.topRow}>
          <Badge
            label="branch: main"
            color={colors.git.main}
            style={styles.badge}
          />
          <Badge
            label="status: online"
            color={colors.success}
            style={styles.badge}
          />
        </View>

        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Mission Operations Center</Text>
        </View>

        {/* Overview Card */}
        <Card style={styles.card}>
          <View style={styles.terminalHeader}>
            <View style={[styles.terminalDot, { backgroundColor: '#EF4444' }]} />
            <View style={[styles.terminalDot, { backgroundColor: '#F59E0B' }]} />
            <View style={[styles.terminalDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.terminalTitle}>system://dashboard.status</Text>
          </View>

          <Text style={styles.cardText}>
            Welcome to Git Quest command center. Explore interactive lessons, track your simulator progress, and inspect your developer profile.
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>18</Text>
              <Text style={styles.statLabel}>Milestones</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.accent }]}>03</Text>
              <Text style={styles.statLabel}>Current</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.success }]}>Active</Text>
              <Text style={styles.statLabel}>Navigation</Text>
            </View>
          </View>
        </Card>

        {/* Navigation Action Hub */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionHeading}>Navigation Destinations</Text>

          <Button
            title="Explore Git Lessons →"
            variant="primary"
            size="lg"
            style={styles.actionBtn}
            onPress={() => navigation.navigate(ROUTES.LESSONS)}
          />

          <Button
            title="Developer Profile →"
            variant="accent"
            size="lg"
            style={styles.actionBtn}
            onPress={() => navigation.navigate(ROUTES.PROFILE)}
          />

          <Button
            title="← Back to Welcome Screen"
            variant="secondary"
            size="md"
            style={styles.backBtn}
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
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  badge: {
    marginRight: spacing.xs,
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
  cardText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionsSection: {
    gap: spacing.md,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  actionBtn: {
    marginBottom: spacing.xs,
  },
  backBtn: {
    marginTop: spacing.sm,
  },
});
