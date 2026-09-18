import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Pill, AlertTriangle } from 'lucide-react';
import { getMedicines } from '../services/supabase';
import SearchBar from '../components/search/SearchBar';
import MedicineCard from '../components/search/MedicineCard';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMedicines(search);
      setMedicines(data || []);
    } catch (err) {
      console.error('Failed to fetch medicines:', err);
      setError('Failed to load medicines. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchMedicines(searchQuery);
  };

  const renderMedicine = ({ item }: { item: Medicine }) => (
    <MedicineCard 
      medicine={item} 
      onPress={(id) => navigation.navigate('MedicineDetail', { id })}
    />
  );

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSubmit={handleSearch}
        placeholder="Search by brand or generic name..."
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>Loading medicines...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <AlertTriangle size={48} color="#f59e0b" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchMedicines(searchQuery)}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
});
