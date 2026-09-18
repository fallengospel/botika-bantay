import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { CheckCircle } from 'lucide-react';
import { getMedicineById, getPricesForMedicine } from '../services/supabase';
import { formatPrice } from '@botika-bantay/shared';
import PriceCard from '../components/price/PriceCard';

interface Medicine {
  id: string;
  brand_name: string;
  generic_name: string;
  dosage_form: string;
  strength: string;
  manufacturer: string;
  fda_registration_number: string;
}

interface Price {
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
}

export default function MedicineDetailScreen({ route }: any) {
  const { id } = route.params;
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicineDetails();
  }, [id]);

  const fetchMedicineDetails = async () => {
    setLoading(true);
    try {
      const medicineData = await getMedicineById(id);
      setMedicine(medicineData);

      const pricesData = await getPricesForMedicine(id);
      setPrices(pricesData);
    } catch (error) {
      console.error('Failed to fetch medicine details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!medicine) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Medicine not found</Text>
      </View>
    );
  }

  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedPrices[0]?.price || 0;
  const highestPrice = sortedPrices[sortedPrices.length - 1]?.price || 0;
  const savings = highestPrice - lowestPrice;

  return (
    <ScrollView style={styles.container}>
      {/* Medicine Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Medicine Information</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Brand Name</Text>
            <Text style={styles.infoValue}>{medicine.brand_name}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Generic Name</Text>
            <Text style={styles.infoValue}>{medicine.generic_name}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Dosage Form</Text>
            <Text style={styles.infoValue}>{medicine.dosage_form}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Strength</Text>
            <Text style={styles.infoValue}>{medicine.strength}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Manufacturer</Text>
            <Text style={styles.infoValue}>{medicine.manufacturer}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>FDA Registration</Text>
            <Text style={styles.infoValue}>{medicine.fda_registration_number}</Text>
          </View>
        </View>
      </View>

      {/* Savings Banner */}
      {savings > 0 && (
        <View style={styles.savingsBanner}>
          <CheckCircle size={24} color="#16a34a" />
          <View style={styles.savingsContent}>
            <Text style={styles.savingsTitle}>
              You can save up to {formatPrice(savings)}
            </Text>
            <Text style={styles.savingsSubtitle}>
              by choosing the lowest price option
            </Text>
          </View>
        </View>
      )}

      {/* Price List */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Prices ({prices.length} pharmacies)</Text>
        
        {prices.length === 0 ? (
          <View style={styles.emptyPrices}>
            <Text style={styles.emptyText}>No prices available yet</Text>
            <Text style={styles.emptySubtext}>Be the first to submit a price!</Text>
          </View>
        ) : (
          sortedPrices.map((price, index) => (
            <PriceCard 
              key={price.id} 
              price={price} 
              isLowest={index === 0}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 0,
  },
  savingsContent: {
    marginLeft: 12,
    flex: 1,
  },
  savingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
  },
  savingsSubtitle: {
    fontSize: 14,
    color: '#15803d',
  },
  emptyPrices: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
