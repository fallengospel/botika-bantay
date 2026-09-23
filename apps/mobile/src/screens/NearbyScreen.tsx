import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { MapPin, Navigation, AlertTriangle, Settings, Search } from 'lucide-react-native';
import * as Location from 'expo-location';
import { supabase } from '../services/supabase';
import { NavigationProp } from '../types/navigation';
import { colors, font, space, radius, MIN_TOUCH } from '../theme';

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
  } | null;
}

const RADIUS_KM = 10;

export default function NearbyScreen({ navigation }: Props) {
  const [branches, setBranches] = useState<PharmacyBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorKind, setErrorKind] = useState<'permission' | 'location' | 'network' | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  const openSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      Alert.alert(
        'Settings',
        'Please open your phone Settings and enable location for BotikaBantay.'
      );
    }
  };

  const getUserLocation = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setLocationError(null);
    setErrorKind(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(
          'Location access is needed to find pharmacies near you. You can turn it on in Settings.'
        );
        setErrorKind('permission');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      await fetchNearbyBranches(location.coords.latitude, location.coords.longitude);
    } catch {
      setLocationError(
        'Could not get your location. Please make sure Location/GPS is turned on.'
      );
      setErrorKind('location');
      setLoading(false);
      setRefreshing(false);
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
        .filter((branch: any) => branch.distance <= RADIUS_KM)
        .sort((a: any, b: any) => a.distance - b.distance);

      setBranches(nearbyBranches);
      setErrorKind(null);
      setLocationError(null);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      setLocationError('Could not load pharmacy data. Check your connection and try again.');
      setErrorKind('network');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    getUserLocation(true);
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getDirections = async (lat: number, lng: number) => {
    const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    const appleUrl = `maps://?daddr=${lat},${lng}`;
    const url = Platform.OS === 'ios' ? appleUrl : googleUrl;
    try {
      const supported = await Linking.canOpenURL(url);
      await Linking.openURL(supported ? url : googleUrl);
    } catch {
      Alert.alert(
        'Could not open maps',
        'Hindi ma-open ang maps app. You can search the address manually instead.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderBranch = ({ item }: { item: PharmacyBranch }) => (
    <View style={styles.branchCard}>
      <View style={styles.branchHeader}>
        <View
          style={[styles.chainDot, { backgroundColor: item.chain?.color || colors.brand }]}
        />
        <Text style={styles.chainName}>{item.chain?.name || 'Pharmacy'}</Text>
        {item.distance !== undefined && (
          <Text style={styles.distance}>{item.distance.toFixed(1)} km</Text>
        )}
      </View>
      <Text style={styles.branchName}>{item.name}</Text>
      <Text style={styles.branchAddress}>{item.address}</Text>
      <TouchableOpacity
        style={styles.directionsButton}
        onPress={() => getDirections(item.latitude, item.longitude)}
        accessibilityRole="button"
        accessibility-label={`Get directions to ${item.name}`}
      >
        <Navigation size={18} color={colors.brandDeep} />
        <Text style={styles.directionsText}>Get Directions</Text>
      </TouchableOpacity>
    </View>
  );

  const showSearchCta = (
    <TouchableOpacity
      style={styles.secondaryButton}
      onPress={() => navigation.navigate('Medicines')}
      accessibilityRole="button"
      accessibility-label="Search medicines"
    >
      <Search size={18} color={colors.brand} />
      <Text style={styles.secondaryButtonText}>Search Medicines</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.radiusHint}>Showing pharmacies within {RADIUS_KM} km</Text>

      {loading ? (
        <View style={styles.centerBox} accessibilityRole="progressbar">
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={styles.centerText}>Finding nearby pharmacies...</Text>
        </View>
      ) : errorKind === 'permission' ? (
        <View style={styles.centerBox}>
          <AlertTriangle size={48} color={colors.warning} />
          <Text style={styles.centerText}>{locationError}</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={openSettings}
            accessibilityRole="button"
            accessibility-label="Open settings"
          >
            <Settings size={18} color={colors.white} />
            <Text style={styles.primaryButtonText}>Open Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => getUserLocation()}
            accessibilityRole="button"
            accessibility-label="Try again"
          >
            <Text style={styles.secondaryButtonText}>Try Again</Text>
          </TouchableOpacity>
          {showSearchCta}
        </View>
      ) : errorKind ? (
        <View style={styles.centerBox}>
          <AlertTriangle size={48} color={colors.warning} />
          <Text style={styles.centerText}>{locationError}</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => getUserLocation()}
            accessibilityRole="button"
            accessibility-label="Try again"
          >
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>
          {showSearchCta}
        </View>
      ) : branches.length === 0 ? (
        <View style={styles.centerBox}>
          <MapPin size={48} color={colors.line} />
          <Text style={styles.centerTitle}>No pharmacies found nearby</Text>
          <Text style={styles.centerText}>
            Wala kaming nakita within {RADIUS_KM} km mo. Subukang i-refresh, or maghanap
            ng gamot muna.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => getUserLocation(true)}
            accessibilityRole="button"
            accessibility-label="Refresh location"
          >
            <Text style={styles.primaryButtonText}>Refresh Location</Text>
          </TouchableOpacity>
          {showSearchCta}
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
              colors={[colors.brand]}
              tintColor={colors.brand}
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
    backgroundColor: colors.paper,
  },
  radiusHint: {
    fontSize: font.sm,
    color: colors.muted,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    backgroundColor: colors.paper,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: space.xxxl,
  },
  centerTitle: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.ink,
    marginTop: space.md,
    textAlign: 'center',
  },
  centerText: {
    fontSize: font.md,
    color: colors.muted,
    textAlign: 'center',
    marginTop: space.sm,
    marginBottom: space.lg,
    lineHeight: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    backgroundColor: colors.brand,
    borderRadius: radius.sm,
    paddingHorizontal: space.xxl,
    paddingVertical: space.md,
    minHeight: MIN_TOUCH,
    marginTop: space.sm,
    minWidth: 200,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: font.md,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    minHeight: MIN_TOUCH,
    marginTop: space.sm,
  },
  secondaryButtonText: {
    color: colors.brand,
    fontSize: font.md,
    fontWeight: '600',
  },
  listContent: {
    padding: space.lg,
    paddingTop: space.sm,
    paddingBottom: space.xxxl,
  },
  branchCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: space.lg,
    marginBottom: space.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  branchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.sm,
  },
  chainDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: space.sm,
  },
  chainName: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.ink,
    flex: 1,
  },
  distance: {
    fontSize: font.sm,
    color: colors.brand,
    fontWeight: '600',
  },
  branchName: {
    fontSize: font.md,
    fontWeight: '500',
    color: colors.ink,
    marginBottom: space.xs,
  },
  branchAddress: {
    fontSize: font.sm,
    color: colors.muted,
    marginBottom: space.md,
    lineHeight: 20,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    backgroundColor: colors.brandMint,
    borderRadius: radius.sm,
    paddingVertical: space.md,
    minHeight: MIN_TOUCH,
  },
  directionsText: {
    fontSize: font.md,
    color: colors.brandDeep,
    fontWeight: '600',
  },
});
