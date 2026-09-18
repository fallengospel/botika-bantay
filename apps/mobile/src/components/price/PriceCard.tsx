import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Clock } from 'lucide-react';
import { formatPrice } from '@botika-bantay/shared';
import StalenessBadge from './StalenessBadge';

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
      };
    };
  };
  isLowest?: boolean;
}

export default function PriceCard({ price, isLowest }: PriceCardProps) {
  return (
    <View style={[styles.card, isLowest && styles.lowestCard]}>
      <View style={styles.header}>
        <View style={styles.chain}>
          <View style={[styles.dot, { backgroundColor: price.branch.chain.color }]} />
          <Text style={styles.chainName}>{price.branch.chain.name}</Text>
          {isLowest && (
            <View style={styles.lowestBadge}>
              <Text style={styles.lowestBadgeText}>Lowest</Text>
            </View>
          )}
        </View>
        <Text style={styles.amount}>{formatPrice(price.price)}</Text>
      </View>
      
      <View style={styles.location}>
        <MapPin size={14} color="#6b7280" />
        <Text style={styles.locationText}>
          {price.branch.name} - {price.branch.address}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.time}>
          <Clock size={14} color="#9ca3af" />
          <Text style={styles.timeText}>
            Updated: {new Date(price.last_updated).toLocaleDateString()}
          </Text>
        </View>
        <StalenessBadge lastUpdated={price.last_updated} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  lowestCard: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  chainName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  lowestBadge: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  lowestBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 4,
  },
});
