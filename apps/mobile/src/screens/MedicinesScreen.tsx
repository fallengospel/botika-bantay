import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Pill, AlertTriangle, Search } from 'lucide-react-native';
import { getMedicines } from '../services/supabase';
import SearchBar from '../components/search/SearchBar';
import MedicineCard from '../components/search/MedicineCard';
import { NavigationProp, MedicinesRouteProp } from '../types/navigation';
import { colors, font, space, radius, MIN_TOUCH } from '../theme';

interface Props {
  navigation: NavigationProp;
  route?: MedicinesRouteProp;
}

interface Medicine {
  id: string;
  brand_name: string;
  generic_name: string;
  dosage_form: string;
  strength: string;
  manufacturer: string;
}

export default function MedicinesScreen({ navigation, route }: Props) {
  const initialSearch = route?.params?.initialSearch ?? '';
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchMedicines(initialSearch || undefined);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const fetchMedicines = async (search?: string, opts?: { background?: boolean }) => {
    if (!opts?.background) setLoading(true);
    setError(null);
    try {
      const data = await getMedicines(search);
      setMedicines(data || []);
    } catch (err) {
      console.error('Failed to fetch medicines:', err);
      const msg =
        err instanceof Error && /network|fetch|timeout/i.test(err.message)
          ? 'No internet connection. Check your data and try again.'
          : 'Failed to load medicines. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setSearching(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMedicines(searchQuery.trim() || undefined, { background: true });
  };

  const handleQueryChange = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      fetchMedicines(undefined, { background: true });
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(() => {
      fetchMedicines(value.trim(), { background: true });
    }, 350);
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchMedicines(undefined, { background: true });
  };

  const handleSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchMedicines(searchQuery.trim() || undefined, { background: true });
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChange={handleQueryChange}
        onSubmit={handleSearch}
        onClear={clearSearch}
        placeholder="Search by brand or generic name..."
        accessibilityLabel="Search medicines"
      />

      {loading ? (
        <View style={styles.centerBox} accessibilityRole="progressbar">
          <ActivityIndicator size="large" color={colors.brand} />
          <Text style={styles.centerText}>Loading medicines...</Text>
        </View>
      ) : error && medicines.length === 0 ? (
        <View style={styles.centerBox}>
          <AlertTriangle size={48} color={colors.warning} />
          <Text style={styles.centerText}>{error}</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => fetchMedicines(searchQuery.trim() || undefined)}
            accessibilityRole="button"
            accessibilityLabel="Try again"
          >
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : medicines.length === 0 ? (
        <View style={styles.centerBox}>
          <Pill size={48} color={colors.line} />
          <Text style={styles.centerText}>
            {searchQuery
              ? `Walang nakitang gamot para sa "${searchQuery.trim()}"`
              : 'No medicines found'}
          </Text>
          <Text style={styles.centerSubtext}>
            {searchQuery
              ? 'Subukang ibang brand or generic name.'
              : 'Pull down to refresh, or try again later.'}
          </Text>
          {searchQuery ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={clearSearch}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Text style={styles.primaryButtonText}>Clear Search</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => fetchMedicines()}
              accessibilityRole="button"
              accessibilityLabel="Try again"
            >
              <Text style={styles.primaryButtonText}>Try Again</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={medicines}
          renderItem={({ item }) => (
            <MedicineCard
              medicine={item}
              onPress={(id) => navigation.navigate('MedicineDetail', { id })}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.brand]}
              tintColor={colors.brand}
            />
          }
          ListHeaderComponent={
            searching ? (
              <View style={styles.searchingRow}>
                <ActivityIndicator size="small" color={colors.brand} />
                <Text style={styles.searchingText}>Searching...</Text>
              </View>
            ) : error ? (
              <Text style={styles.inlineError}>{error}</Text>
            ) : null
          }
        />
      )}

      {medicines.length > 0 && searchQuery.length > 0 && (
        <View style={styles.fabWrap}>
          <TouchableOpacity
            style={styles.clearFab}
            onPress={clearSearch}
            accessibilityRole="button"
            accessibilityLabel="Clear search and show all medicines"
          >
            <Search size={18} color={colors.white} />
            <Text style={styles.clearFabText}>Show all</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: space.xxxl,
  },
  centerText: {
    marginTop: space.md,
    color: colors.muted,
    fontSize: font.md,
    textAlign: 'center',
    lineHeight: 24,
  },
  centerSubtext: {
    marginTop: space.xs,
    color: colors.muted,
    fontSize: font.sm,
    textAlign: 'center',
    marginBottom: space.lg,
  },
  primaryButton: {
    backgroundColor: colors.brand,
    borderRadius: radius.sm,
    paddingHorizontal: space.xxl,
    paddingVertical: space.md,
    marginTop: space.lg,
    minHeight: MIN_TOUCH,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: font.md,
    fontWeight: '600',
  },
  listContent: {
    padding: space.lg,
    paddingBottom: space.xxxl,
  },
  searchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginBottom: space.md,
    paddingHorizontal: space.xs,
  },
  searchingText: {
    color: colors.muted,
    fontSize: font.sm,
  },
  inlineError: {
    color: colors.danger,
    fontSize: font.sm,
    marginBottom: space.md,
    textAlign: 'center',
  },
  fabWrap: {
    position: 'absolute',
    bottom: space.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  clearFab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    paddingHorizontal: space.xl,
    paddingVertical: space.md,
    minHeight: MIN_TOUCH,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  clearFabText: {
    color: colors.white,
    fontSize: font.sm,
    fontWeight: '600',
  },
});
