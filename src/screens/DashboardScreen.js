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

export default function DashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Status Row */}
        <View style={styles.topRow}>
          <Badge
            label="branch: main"
            variant="gitMain"
            style={styles.badge}
          />
          <Badge
            label="status: online"
            variant="success"
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
            <View style={[styles.terminalDot, { backgroundColor: colors.error }]} />
            <View style={[styles.terminalDot, { backgroundColor: colors.warning }]} />
            <View style={[styles.terminalDot, { backgroundColor: colors.success }]} />
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
              <Text style={[styles.statNumber, { color: colors.accent }]}>04</Text>
              <Text style={styles.statLabel}>Current</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.success }]}>Active</Text>
              <Text style={styles.statLabel}>Design Sys</Text>
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
  cardText: {
    ...typography.body,
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
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    fontFamily: typography.fontFamily.code,
  },
  statLabel: {
    ...typography.caption,
    marginTop: spacing.xxs,
  },
  actionsSection: {
    gap: spacing.md,
  },
  sectionHeading: {
    ...typography.caption,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  actionBtn: {
    marginBottom: spacing.xs,
  },
  backBtn: {
    marginTop: spacing.sm,
  },
});
