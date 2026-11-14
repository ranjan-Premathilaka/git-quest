import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

/**
 * Reusable Card component representing a single Git Learning Module.
 * Displays progress, lesson subtopics, status indicators, and call-to-actions.
 */
export default function ModuleCard({ module, onSelect, onSelectLesson }) {
  const [expanded, setExpanded] = useState(false);

  const isCompleted = module.status === 'completed';
  const isInProgress = module.status === 'in-progress';
  const isAvailable = module.status === 'available';
  const isLocked = module.status === 'locked';

  const progressPercent = Math.round((module.completedLessons / module.totalLessons) * 100);

  const getStatusBadge = () => {
    if (isCompleted) {
      return <Badge label="✓ Completed" variant="success" size="sm" />;
    }
    if (isInProgress) {
      return <Badge label="● In Progress" variant="gitMain" size="sm" />;
    }
    if (isAvailable) {
      return <Badge label="★ Available" variant="gitFeature" size="sm" />;
    }
    return <Badge label="🔒 Locked" variant="secondary" size="sm" />;
  };

  const getButtonConfig = () => {
    if (isCompleted) {
      return {
        title: 'Review Module ↺',
        variant: 'secondary',
        disabled: false,
      };
    }
    if (isInProgress) {
      return {
        title: 'Continue Module →',
        variant: 'primary',
        disabled: false,
      };
    }
    if (isAvailable) {
      return {
        title: 'Start Module →',
        variant: 'accent',
        disabled: false,
      };
    }
    return {
      title: `Locked • Requires ${module.unlockRequirement ? module.unlockRequirement.replace('Complete ', '') : 'Prior Module'}`,
      variant: 'secondary',
      disabled: true,
    };
  };

  const btnConfig = getButtonConfig();

  return (
    <Card
      style={[
        styles.card,
        isInProgress && styles.activeCardBorder,
        isLocked && styles.lockedCard,
      ]}
      variant={isLocked ? 'subtle' : 'default'}
    >
      {/* Terminal header */}
      <View style={styles.terminalHeader}>
        <View style={[styles.terminalDot, { backgroundColor: colors.error }]} />
        <View style={[styles.terminalDot, { backgroundColor: colors.warning }]} />
        <View style={[styles.terminalDot, { backgroundColor: colors.success }]} />
        <Text style={styles.terminalTitle}>module://{module.moduleNumber}_{module.id}.git</Text>
        <Text style={styles.rewardText}>+{module.xpReward} XP</Text>
      </View>

      {/* Status & Level Tag Row */}
      <View style={styles.statusRow}>
        {getStatusBadge()}
        <Text style={styles.metaText}>
          {module.level} • {module.estimatedTime}
        </Text>
      </View>

      {/* Title & Description */}
      <Text style={styles.title}>
        <Text style={styles.numberPrefix}>{module.moduleNumber}. </Text>
        {module.title}
      </Text>
      <Text style={styles.description}>{module.description}</Text>

      {/* Progress Bar Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressInfoRow}>
          <Text style={styles.progressLabel}>
            {module.completedLessons} of {module.totalLessons} lessons completed
          </Text>
          <Text style={styles.progressPercent}>{progressPercent}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progressPercent}%`,
                backgroundColor: isCompleted
                  ? colors.success
                  : isInProgress
                  ? colors.primary
                  : colors.accent,
              },
            ]}
          />
        </View>
      </View>

      {/* Lessons Subtopic Toggle / Preview */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.lessonsToggle}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.lessonsToggleText}>
          {expanded ? '▲ Hide Subtopics' : `▼ View Lessons (${module.lessons.length})`}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.lessonsList}>
          {module.lessons.map((lesson, idx) => (
            <TouchableOpacity
              key={lesson.id}
              activeOpacity={0.7}
              style={styles.lessonItem}
              disabled={isLocked}
              onPress={() => onSelectLesson && onSelectLesson(lesson.id, module)}
            >
              <Text
                style={[
                  styles.lessonStatusIcon,
                  lesson.completed ? styles.lessonDone : styles.lessonPending,
                ]}
              >
                {lesson.completed ? '✓' : '○'}
              </Text>
              <Text
                style={[
                  styles.lessonTitle,
                  lesson.completed && styles.lessonCompletedText,
                ]}
              >
                {idx + 1}. {lesson.title}
              </Text>
              {!isLocked && <Text style={styles.lessonArrow}>→</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Action Button */}
      <View style={styles.actionContainer}>
        <Button
          title={btnConfig.title}
          variant={btnConfig.variant}
          disabled={btnConfig.disabled}
          size="md"
          style={styles.actionBtn}
          onPress={() => onSelect && onSelect(module)}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  activeCardBorder: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  lockedCard: {
    opacity: 0.8,
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
  rewardText: {
    ...typography.caption,
    color: colors.primaryLight,
    fontFamily: typography.fontFamily.code,
    fontSize: typography.sizes.xs - 1,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metaText: {
    ...typography.bodySmall,
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  title: {
    ...typography.h3,
    fontSize: typography.sizes.lg,
    marginBottom: spacing.xs,
  },
  numberPrefix: {
    color: colors.accent,
    fontFamily: typography.fontFamily.code,
  },
  description: {
    ...typography.body,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    ...typography.bodySmall,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  progressPercent: {
    ...typography.caption,
    color: colors.primaryLight,
    fontFamily: typography.fontFamily.code,
  },
  progressBarBg: {
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.terminalBackground,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  lessonsToggle: {
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
    alignSelf: 'flex-start',
  },
  lessonsToggleText: {
    ...typography.caption,
    color: colors.accent,
    fontSize: typography.sizes.xs,
  },
  lessonsList: {
    backgroundColor: colors.terminalBackground,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  lessonStatusIcon: {
    fontFamily: typography.fontFamily.code,
    fontSize: typography.sizes.sm,
    marginRight: spacing.sm,
    width: 16,
    textAlign: 'center',
  },
  lessonDone: {
    color: colors.success,
    fontWeight: typography.weights.bold,
  },
  lessonPending: {
    color: colors.textMuted,
  },
  lessonTitle: {
    ...typography.code,
    fontSize: typography.sizes.xs + 1,
    color: colors.textSecondary,
    flex: 1,
  },
  lessonCompletedText: {
    color: colors.textMuted,
  },
  lessonArrow: {
    color: colors.accent,
    fontSize: typography.sizes.sm,
    marginLeft: spacing.xs,
  },
  actionContainer: {
    marginTop: spacing.xs,
  },
  actionBtn: {
    width: '100%',
  },
});
