/**
 * Git Quest - BranchGraph Component (Milestone 11)
 *
 * A React Native visual branch graph that renders commit history
 * using View elements (no SVG / external libraries).
 *
 * Layout:
 *  ┌────────────────────────────────────────────────────┐
 *  │  Branch lanes (colour-coded)  │  Commit info       │
 *  │  ○ ── ○ ── ○  (main)         │  sha  message      │
 *  │        └── ○ ── ○  (feature)  │                    │
 *  └────────────────────────────────────────────────────┘
 *
 * Props:
 *  graphData   - output of getBranchGraphData() from gitState
 *  style       - optional outer style override
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

// ── Layout constants ───────────────────────────────────────────────────────

const NODE_SIZE = 12;
const NODE_BORDER = 2;
const LANE_WIDTH = 24;   // px per branch lane
const ROW_HEIGHT = 44;   // px per commit row
const CONNECTOR_W = 2;   // vertical connector line width

// ── Helper: assign each branch a lane index ────────────────────────────────

function assignLanes(branches, currentBranch) {
  const lanes = {};
  // Current branch always gets lane 0.
  if (branches.includes(currentBranch)) {
    lanes[currentBranch] = 0;
  }
  let idx = 1;
  branches.forEach((b) => {
    if (b !== currentBranch) {
      lanes[b] = idx++;
    }
  });
  return lanes;
}

// ── Main component ─────────────────────────────────────────────────────────

export default function BranchGraph({ graphData, style }) {
  if (!graphData || graphData.nodes.length === 0) {
    return (
      <View style={[styles.emptyContainer, style]}>
        <Text style={styles.emptyIcon}>🌿</Text>
        <Text style={styles.emptyTitle}>No commits yet</Text>
        <Text style={styles.emptyHint}>
          Run git init → git add . → git commit -m "message" in the terminal to see your branch graph here.
        </Text>
      </View>
    );
  }

  const { nodes, branches, branchColors, currentBranch } = graphData;
  const lanes = assignLanes(branches, currentBranch);
  const totalLanes = branches.length || 1;
  const laneColumnWidth = totalLanes * LANE_WIDTH;

  // Build a map from shortSha → row index for drawing connectors.
  const shaToIdx = {};
  nodes.forEach((n, i) => { shaToIdx[n.shortSha] = i; });

  return (
    <View style={[styles.wrapper, style]}>
      {/* ── Legend ──────────────────────────────────────────────────────── */}
      <View style={styles.legendRow}>
        {branches.map((b) => (
          <View key={b} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: branchColors[b] || colors.textMuted }]} />
            <Text style={[
              styles.legendLabel,
              b === currentBranch && styles.legendLabelCurrent,
            ]}>
              {b === currentBranch ? `* ${b}` : b}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Graph rows ──────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {nodes.map((node, rowIdx) => {
          const lane = lanes[node.branch] ?? 0;
          const nodeColor = branchColors[node.branch] || colors.textMuted;
          const nodeCenterX = lane * LANE_WIDTH + LANE_WIDTH / 2 - NODE_SIZE / 2;

          // Check if there is a child commit in the same branch below this row.
          const hasChildBelow = nodes.slice(rowIdx + 1).some(
            (n) => n.branch === node.branch
          );

          // Check if this is a merge commit and find the lane of the other parent.
          const otherParentLane = (() => {
            if (!node.isMergeCommit || !node.mergeParents) return null;
            const otherSha = node.mergeParents.find(
              (sha) => sha && sha !== node.parentSha
            );
            if (!otherSha) return null;
            const otherNode = nodes.find((n) => n.shortSha === otherSha);
            if (!otherNode) return null;
            return lanes[otherNode.branch] ?? null;
          })();

          return (
            <View key={node.shortSha} style={[styles.row, { minHeight: ROW_HEIGHT }]}>
              {/* ── Lane column ──────────────────────────────────────────── */}
              <View style={[styles.laneColumn, { width: laneColumnWidth }]}>
                {/* Vertical connector going down from this node */}
                {hasChildBelow && (
                  <View
                    style={[
                      styles.connector,
                      {
                        left: lane * LANE_WIDTH + LANE_WIDTH / 2 - CONNECTOR_W / 2,
                        top: ROW_HEIGHT / 2 + NODE_SIZE / 2,
                        backgroundColor: nodeColor,
                      },
                    ]}
                  />
                )}

                {/* Merge arc: horizontal line connecting to other parent lane */}
                {otherParentLane !== null && (
                  <View
                    style={[
                      styles.mergeArc,
                      {
                        left: Math.min(lane, otherParentLane) * LANE_WIDTH + LANE_WIDTH / 2,
                        width: Math.abs(lane - otherParentLane) * LANE_WIDTH,
                        top: ROW_HEIGHT / 2 - 1,
                        backgroundColor: colors.git.merge,
                      },
                    ]}
                  />
                )}

                {/* Commit node ○ */}
                <View
                  style={[
                    styles.node,
                    {
                      left: nodeCenterX,
                      top: ROW_HEIGHT / 2 - NODE_SIZE / 2,
                      borderColor: nodeColor,
                      backgroundColor: node.isCurrent
                        ? nodeColor
                        : node.isMergeCommit
                        ? colors.git.merge
                        : colors.terminalBackground,
                    },
                  ]}
                >
                  {node.isCurrent && (
                    <View style={styles.headDot} />
                  )}
                </View>
              </View>

              {/* ── Info column ──────────────────────────────────────────── */}
              <View style={styles.infoColumn}>
                <View style={styles.infoRow}>
                  <Text style={[styles.sha, { color: nodeColor }]}>
                    {node.shortSha}
                  </Text>
                  {node.isMergeCommit && (
                    <View style={styles.mergeTag}>
                      <Text style={styles.mergeTagText}>merge</Text>
                    </View>
                  )}
                  {node.isCurrent && (
                    <View style={[styles.headTag, { backgroundColor: nodeColor }]}>
                      <Text style={styles.headTagText}>HEAD</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.commitMsg} numberOfLines={1}>
                  {node.message}
                </Text>
                <Text style={styles.branchTag} numberOfLines={1}>
                  {node.branch}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Bottom padding */}
        <View style={{ height: spacing.md }} />
      </ScrollView>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.terminalBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  // Legend
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.code,
  },
  legendLabelCurrent: {
    color: colors.success,
    fontWeight: typography.weights.bold,
  },

  // Graph
  scroll: {
    maxHeight: 320,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(39,53,78,0.4)',
  },
  laneColumn: {
    position: 'relative',
    minHeight: ROW_HEIGHT,
  },
  connector: {
    position: 'absolute',
    width: CONNECTOR_W,
    height: ROW_HEIGHT,
  },
  mergeArc: {
    position: 'absolute',
    height: 2,
  },
  node: {
    position: 'absolute',
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    borderWidth: NODE_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textPrimary,
  },

  // Info
  infoColumn: {
    flex: 1,
    paddingLeft: spacing.sm,
    paddingRight: spacing.md,
    paddingVertical: spacing.xs,
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 1,
  },
  sha: {
    fontFamily: typography.fontFamily.code,
    fontSize: 11,
    fontWeight: typography.weights.bold,
  },
  mergeTag: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  mergeTagText: {
    fontSize: 9,
    color: colors.git.merge,
    fontFamily: typography.fontFamily.code,
  },
  headTag: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  headTagText: {
    fontSize: 9,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.code,
    fontWeight: typography.weights.bold,
  },
  commitMsg: {
    ...typography.code,
    fontSize: 11,
    color: colors.textPrimary,
  },
  branchTag: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: typography.fontFamily.code,
    marginTop: 1,
  },

  // Empty state
  emptyContainer: {
    backgroundColor: colors.terminalBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  emptyHint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
