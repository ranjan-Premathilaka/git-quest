import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar as NativeStatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { modulesData } from '../data';
import { Badge, Button, ModuleCard, Card } from '../components';

export default function LessonsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'in-progress' | 'available' | 'completed' | 'locked'

  // Calculate overall metrics
  const totalLessonsCount = modulesData.reduce((acc, m) => acc + m.totalLessons, 0);
  const completedLessonsCount = modulesData.reduce((acc, m) => acc + m.completedLessons, 0);
  const overallProgressPercent = Math.round((completedLessonsCount / totalLessonsCount) * 100);

  const filterTabs = [
    { key: 'all', label: `All (${modulesData.length})` },
    {
      key: 'in-progress',
      label: `In Progress (${modulesData.filter((m) => m.status === 'in-progress').length})`,
    },
    {
      key: 'available',
      label: `Available (${modulesData.filter((m) => m.status === 'available').length})`,
    },
    {
      key: 'completed',
      label: `Completed (${modulesData.filter((m) => m.status === 'completed').length})`,
    },
    {
      key: 'locked',
      label: `Locked (${modulesData.filter((m) => m.status === 'locked').length})`,
    },
  ];

  // Filter and search logic
  const filteredModules = useMemo(() => {
    return modulesData.filter((m) => {
      const matchesFilter =
        activeFilter === 'all' ? true : m.status === activeFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === ''
          ? true
          : m.title.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q) ||
            m.lessons.some((l) => l.title.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  const handleSelectModule = (module) => {
    // In Milestone 07, actual lesson execution is not yet implemented.
    // We can show feedback or navigate back to dashboard when needed.
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Navigation Row */}
        <View style={styles.topRow}>
          <Button
            title="← Dashboard"
            variant="secondary"
            size="sm"
            onPress={() => navigation.navigate(ROUTES.DASHBOARD)}
          />
          <Badge
            label={`${completedLessonsCount}/${totalLessonsCount} Lessons Done`}
            variant="gitRelease"
          />
        </View>

        {/* Screen Header */}
        <View style={styles.header}>
          <Text style={styles.headerApp}>Git Quest • Learning Catalog</Text>
          <Text style={styles.title}>Git Learning Modules</Text>
          <Text style={styles.subtitle}>
            Explore structured topics from command foundations to collaborative workflows.
          </Text>
        </View>

        {/* Overall Progress Summary Card */}
        <Card style={styles.summaryCard} variant="elevated">
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>TRACK PROGRESS</Text>
              <Text style={styles.summaryTitle}>
                {completedLessonsCount} of {totalLessonsCount} Lessons Completed
              </Text>
            </View>
            <Text style={styles.summaryPercent}>{overallProgressPercent}%</Text>
          </View>
          <View style={styles.summaryBarBg}>
            <View
              style={[
                styles.summaryBarFill,
                { width: `${overallProgressPercent}%` },
              ]}
            />
          </View>
          <View style={styles.summaryMetaRow}>
            <Text style={styles.summaryMeta}>
              1 Completed • 1 In Progress • 1 Available • 2 Locked
            </Text>
          </View>
        </Card>

        {/* Search Field */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search topics, commands (init, commit, remote, branch)..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearSearchBtn}
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContainer}
        >
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.7}
                style={[
                  styles.filterTab,
                  isActive && styles.filterTabActive,
                ]}
                onPress={() => setActiveFilter(tab.key)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    isActive && styles.filterTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Modules List */}
        <View style={styles.modulesSection}>
          {filteredModules.length > 0 ? (
            filteredModules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onSelect={handleSelectModule}
              />
            ))
          ) : (
            <Card style={styles.emptyCard} variant="terminal">
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No Matching Modules</Text>
              <Text style={styles.emptyDesc}>
                No learning modules match &quot;{searchQuery}&quot; under the &quot;{activeFilter}&quot; filter.
              </Text>
              <Button
                title="Reset Filters"
                variant="outline"
                size="sm"
                style={styles.resetBtn}
                onPress={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
              />
            </Card>
          )}
        </View>

        {/* Bottom Navigation Links */}
        <View style={styles.bottomNavSection}>
          <Button
            title="← Back to Dashboard"
            variant="secondary"
            size="md"
            style={styles.navBtn}
            onPress={() => navigation.navigate(ROUTES.DASHBOARD)}
          />
          <Button
            title="View Developer Profile →"
            variant="outline"
            size="sm"
            style={styles.navBtn}
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
  headerApp: {
    ...typography.caption,
    color: colors.accent,
    letterSpacing: 1.5,
    marginBottom: spacing.xxs,
  },
  title: {
    ...typography.h2,
    fontSize: typography.sizes.display - 6,
    color: colors.textPrimary,
    lineHeight: 36,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  summaryCard: {
    marginBottom: spacing.lg,
    padding: spacing.md + 2,
    borderColor: colors.border,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.primary,
  },
  summaryTitle: {
    ...typography.h3,
    fontSize: typography.sizes.md,
    marginTop: 2,
  },
  summaryPercent: {
    fontFamily: typography.fontFamily.code,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primaryLight,
  },
  summaryBarBg: {
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.terminalBackground,
    overflow: 'hidden',
    marginVertical: spacing.xs,
  },
  summaryBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  summaryMetaRow: {
    marginTop: spacing.xs,
  },
  summaryMeta: {
    ...typography.bodySmall,
    fontSize: typography.sizes.xs - 1,
    color: colors.textMuted,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.code,
  },
  clearSearchBtn: {
    padding: spacing.xs,
  },
  clearSearchText: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  filterTabsContainer: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    marginBottom: spacing.lg,
    paddingRight: spacing.md,
  },
  filterTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.badgeBackground,
    borderColor: colors.primary,
  },
  filterTabText: {
    ...typography.caption,
    fontSize: typography.sizes.xs - 1,
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: colors.primaryLight,
    fontWeight: typography.weights.bold,
  },
  modulesSection: {
    marginBottom: spacing.lg,
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginVertical: spacing.md,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    ...typography.h3,
    fontSize: typography.sizes.md,
    marginBottom: spacing.xs,
  },
  emptyDesc: {
    ...typography.body,
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  resetBtn: {
    marginTop: spacing.xs,
  },
  bottomNavSection: {
    gap: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  navBtn: {
    width: '100%',
  },
});
