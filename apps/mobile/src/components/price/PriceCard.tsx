import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Clock } from 'lucide-react-native';
import { formatPrice, formatDate } from '../../utils/format';
import StalenessBadge from './StalenessBadge';
import { colors, font, space, radius } from '../../theme';

interface PriceCardProps {
  price: {
    id: string;
    price: number;
    source_type: 'official' | 'crowdsourced';
    last_updated: string;
    branch: {
      id: string;
      name: string;
      address: string;
      chain: {
        name: string;
        color: string;
      } | null;
    } | null;
  };
  isLowest?: boolean;
}

export default function PriceCard({ price, isLowest }: PriceCardProps) {
  const chain = price.branch?.chain;

  return (
    <View style={[styles.card, isLowest && styles.lowestCard]}>
      <View style={styles.header}>
        <View style={styles.chain}>
          <View
            style={[styles.dot, { backgroundColor: chain?.color || colors.brand }]}
          />
          <Text style={styles.chainName}>{chain?.name || 'Pharmacy'}</Text>
          {isLowest && (
            <View style={styles.lowestBadge}>
              <Text style={styles.lowestBadgeText}>Lowest</Text>
            </View>
          )}
        </View>
        <Text style={styles.amount}>{formatPrice(price.price)}</Text>
      </View>

      <View style={styles.location}>
        <MapPin size={16} color={colors.muted} />
        <Text style={styles.locationText}>
          {price.branch?.name}
          {price.branch?.address ? ` - ${price.branch.address}` : ''}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.time}>
          <Clock size={16} color={colors.muted} />
          <Text style={styles.timeText}>Updated: {formatDate(price.last_updated)}</Text>
        </View>
        <StalenessBadge lastUpdated={price.last_updated} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paper,
    borderRadius: radius.sm,
    padding: space.md,
    marginBottom: space.sm,
    borderWidth: 1,
    borderColor: colors.line,
  },
  lowestCard: {
    backgroundColor: colors.brandMint,
    borderColor: colors.brand,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.sm,
  },
  chain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: space.sm,
  },
  chainName: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.ink,
  },
  lowestBadge: {
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
    marginLeft: space.sm,
  },
  lowestBadgeText: {
    fontSize: font.xs,
    fontWeight: '600',
    color: colors.white,
  },
  amount: {
    fontSize: font.xl,
    fontWeight: 'bold',
    color: colors.ink,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.sm,
    gap: space.xs,
  },
  locationText: {
    fontSize: font.sm,
    color: colors.muted,
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  timeText: {
    fontSize: font.xs + 1,
    color: colors.muted,
  },
});
