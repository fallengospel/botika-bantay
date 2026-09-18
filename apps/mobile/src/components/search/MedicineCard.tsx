import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pill } from 'lucide-react';

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
    >
      <View style={styles.icon}>
        <Pill size={24} color="#16a34a" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{medicine.brand_name}</Text>
        <Text style={styles.generic}>{medicine.generic_name}</Text>
        <Text style={styles.details}>
          {medicine.dosage_form} • {medicine.strength}
        </Text>
      </View>
      <Text style={styles.viewPrices}>View Prices</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  generic: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  details: {
    fontSize: 12,
    color: '#9ca3af',
  },
  viewPrices: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '500',
  },
});
