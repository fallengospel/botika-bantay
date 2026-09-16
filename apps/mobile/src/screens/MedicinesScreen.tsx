import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Search, Pill } from 'lucide-react';
import { getMedicines } from '../services/supabase';

interface Medicine {
  id: string;
  brand_name: string;
  generic_name: string;
  dosage_form: string;
  strength: string;
  manufacturer: string;
}

export default function MedicinesScreen({ navigation }: any) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async (search?: string) => {
    setLoading(true);
    try {
      const data = await getMedicines(search);
      setMedicines(data);
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchMedicines(searchQuery);
  };

  const renderMedicine = ({ item }: { item: Medicine }) => (
    <TouchableOpacity
      style={styles.medicineCard}
      onPress={() => navigation.navigate('MedicineDetail', { id: item.id })}
    >
      <View style={styles.medicineIcon}>
        <Pill size={24} color="#16a34a" />
      </View>
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{item.brand_name}</Text>
        <Text style={styles.medicineGeneric}>{item.generic_name}</Text>
        <Text style={styles.medicineDetails}>
          {item.dosage_form} • {item.strength}
        </Text>
      </View>
      <Text style={styles.viewPrices}>View Prices</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by brand or generic name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Medicine List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>Loading medicines...</Text>
        </View>
      ) : medicines.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Pill size={48} color="#d1d5db" />
          <Text style={styles.emptyText}>No medicines found</Text>
        </View>
      ) : (
        <FlatList
          data={medicines}
          renderItem={renderMedicine}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  medicineCard: {
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
  medicineIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  medicineGeneric: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  medicineDetails: {
    fontSize: 12,
    color: '#9ca3af',
  },
  viewPrices: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '500',
  },
});
