import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  RefreshControl,
} from 'react-native';
import { MapPin, Navigation, AlertTriangle } from 'lucide-react';
import * as Location from 'expo-location';
import { supabase } from '../services/supabase';
import { NavigationProp } from '../types/navigation';

interface Props {
  navigation: NavigationProp;
}

interface PharmacyBranch {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  province: string;
  distance?: number;
  chain: {
    id: string;
    name: string;
    color: string;
  };
}

export default function NearbyScreen() {
  const [branches, setBranches] = useState<PharmacyBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission is required to find nearby pharmacies.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      fetchNearbyBranches(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      setLocationError('Unable to get your location. Please enable location services.');
      setLoading(false);
    }
  };

  const fetchNearbyBranches = async (lat: number, lng: number) => {
    try {
      const { data, error } = await supabase
        .from('pharmacy_branches')
        .select('*, chain:pharmacy_chains(*)');

      if (error) throw error;

      const branchesWithDistance = (data || []).map((branch: any) => {
        const distance = calculateDistance(lat, lng, branch.latitude, branch.longitude);
        return { ...branch, distance };
      });

      const nearbyBranches = branchesWithDistance
        .filter((branch: any) => branch.distance <= 10)
        .sort((a: any, b: any) => a.distance - b.distance);

      setBranches(nearbyBranches);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      setLocationError('Failed to load pharmacy data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLocationError(null);
    getUserLocation();
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getDirections = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  const renderBranch = ({ item }: { item: PharmacyBranch }) => (
    <View style={styles.branchCard}>
      <View style={styles.branchHeader}>
        <View style={[styles.chainDot, { backgroundColor: item.chain.color }]} />
        <Text style={styles.chainName}>{item.chain.name}</Text>
        {item.distance !== undefined && (
          <Text style={styles.distance}>{item.distance.toFixed(1)} km</Text>
        )}
      </View>
      <Text style={styles.branchName}>{item.name}</Text>
      <Text style={styles.branchAddress}>{item.address}</Text>
      <TouchableOpacity
        style={styles.directionsButton}
        onPress={() => getDirections(item.latitude, item.longitude)}
      >
        <Navigation size={16} color="#16a34a" />
        <Text style={styles.directionsText}>Get Directions</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>Finding nearby pharmacies...</Text>
        </View>
      ) : locationError ? (
        <View style={styles.errorContainer}>
          <AlertTriangle size={48} color="#f59e0b" />
          <Text style={styles.errorText}>{locationError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={getUserLocation}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : branches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MapPin size={48} color="#d1d5db" />
          <Text style={styles.emptyText}>No pharmacies found nearby</Text>
        </View>
      ) : (
        <FlatList
          data={branches}
          renderItem={renderBranch}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#16a34a']}
              tintColor="#16a34a"
            />
          }
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
  branchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  branchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  chainDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  chainName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  distance: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '500',
  },
  branchName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  branchAddress: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  directionsText: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '500',
  },
});
