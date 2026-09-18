import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateStaleness } from '@botika-bantay/shared';

interface StalenessBadgeProps {
  lastUpdated: string;
}

export default function StalenessBadge({ lastUpdated }: StalenessBadgeProps) {
  const staleness = calculateStaleness(new Date(lastUpdated));
  
  const badges = {
    fresh: { text: 'Fresh', color: '#dcfce7', textColor: '#166534' },
    stale: { text: 'Stale', color: '#fef9c3', textColor: '#854d0e' },
    very_stale: { text: 'Outdated', color: '#fee2e2', textColor: '#991b1b' },
  };

  const badge = badges[staleness];

  return (
    <View style={[styles.badge, { backgroundColor: badge.color }]}>
      <Text style={[styles.badgeText, { color: badge.textColor }]}>
        {badge.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
