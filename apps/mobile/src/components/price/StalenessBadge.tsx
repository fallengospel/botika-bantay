import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, font, radius, space } from '../../theme';

interface StalenessBadgeProps {
  lastUpdated: string;
}

function calculateStaleness(date: Date): 'fresh' | 'stale' | 'very_stale' {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return 'very_stale';
  const days = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  if (days <= 7) return 'fresh';
  if (days <= 30) return 'stale';
  return 'very_stale';
}

export default function StalenessBadge({ lastUpdated }: StalenessBadgeProps) {
  const staleness = calculateStaleness(new Date(lastUpdated));

  const badges = {
    fresh: { text: 'Fresh', color: colors.brandMint, textColor: colors.brandDeep },
    stale: { text: 'Stale', color: colors.warningBg, textColor: colors.warning },
    very_stale: { text: 'Outdated', color: colors.dangerBg, textColor: colors.danger },
  };

  const badge = badges[staleness];

  return (
    <View
      style={[styles.badge, { backgroundColor: badge.color }]}
      accessibilityLabel={`Price is ${badge.text}`}
    >
      <Text style={[styles.badgeText, { color: badge.textColor }]}>{badge.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: font.xs,
    fontWeight: '600',
  },
});
