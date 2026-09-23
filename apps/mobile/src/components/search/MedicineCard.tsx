import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pill, ChevronRight } from 'lucide-react-native';
import { colors, font, space, radius, MIN_TOUCH } from '../../theme';

interface MedicineCardProps {
  medicine: {
    id: string;
    brand_name: string;
    generic_name: string;
    dosage_form: string;
    strength: string;
    manufacturer: string;
  };
  onPress: (id: string) => void;
}

export default function MedicineCard({ medicine, onPress }: MedicineCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(medicine.id)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`View prices for ${medicine.brand_name}`}
    >
      <View style={styles.icon}>
        <Pill size={24} color={colors.brand} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{medicine.brand_name}</Text>
        <Text style={styles.generic}>{medicine.generic_name}</Text>
        <Text style={styles.details}>
          {medicine.dosage_form} • {medicine.strength}
        </Text>
      </View>
      <View style={styles.cta}>
        <Text style={styles.viewPrices}>View Prices</Text>
        <ChevronRight size={18} color={colors.brand} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.md,
    minHeight: MIN_TOUCH + 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.brandMint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: space.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: font.md,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: 2,
  },
  generic: {
    fontSize: font.sm,
    color: colors.muted,
    marginBottom: 2,
  },
  details: {
    fontSize: font.sm,
    color: colors.muted,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: space.sm,
    paddingVertical: space.md,
    minHeight: MIN_TOUCH,
    justifyContent: 'center',
  },
  viewPrices: {
    fontSize: font.sm,
    color: colors.brand,
    fontWeight: '600',
  },
});
