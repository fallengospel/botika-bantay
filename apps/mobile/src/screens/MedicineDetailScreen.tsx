import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { CheckCircle, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react-native';
import { getMedicineById, getPricesForMedicine } from '../services/supabase';
import { formatPrice } from '../utils/format';
import PriceCard from '../components/price/PriceCard';
import { MedicineDetailRouteProp } from '../types/navigation';
import { colors, font, space, radius, MIN_TOUCH } from '../theme';

interface Props {
  route: MedicineDetailRouteProp;
  navigation: any;
}

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
    } | null;
  } | null;
}

type LoadState = 'loading' | 'ready' | 'not_found' | 'error';

export default function MedicineDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [prices, setPrices] = useState<Price[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  const fetchMedicineDetails = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoadState('loading');

      try {
        const [medicineResult, pricesResult] = await Promise.allSettled([
          getMedicineById(id),
          getPricesForMedicine(id),
        ]);

        if (medicineResult.status === 'rejected') {
          const msg =
            medicineResult.reason instanceof Error &&
            /network|fetch|timeout/i.test(medicineResult.reason.message)
              ? 'No internet connection. Check your data and try again.'
              : 'Could not load this medicine. Please try again.';
          if (isRefresh) {
            setRefreshMessage(msg);
          } else {
            setLoadState('error');
          }
          return;
        }

        const med = medicineResult.value;
        if (!med) {
          if (isRefresh) setRefreshMessage('This medicine may have been removed.');
          else setLoadState('not_found');
          return;
        }

        setMedicine(med);
        if (pricesResult.status === 'fulfilled') {
          setPrices(pricesResult.value || []);
          setRefreshMessage(null);
        } else if (isRefresh) {
          setRefreshMessage('Prices could not be refreshed. Showing last known prices.');
        } else {
          setPrices([]);
        }
        setLoadState('ready');
      } catch (err) {
        console.error('Failed to fetch medicine details:', err);
        if (isRefresh) setRefreshMessage('Could not refresh. Please try again.');
        else setLoadState('error');
      } finally {
        setLoadingFalse();
      }
    },
    [id]
  );

  const setLoadingFalse = () => {
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMedicineDetails();
  }, [fetchMedicineDetails]);

  if (loadState === 'loading') {
    return (
      <View style={styles.centerBox} accessibilityRole="progressbar">
        <ActivityIndicator size="large" color={colors.brand} />
        <Text style={styles.centerText}>Loading medicine...</Text>
      </View>
    );
  }

  if (loadState === 'error') {
    return (
      <View style={styles.centerBox}>
        <AlertTriangle size={48} color={colors.warning} />
        <Text style={styles.centerTitle}>Could not load details</Text>
        <Text style={styles.centerText}>
          Parang may problema sa connection. Subukan muli.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => fetchMedicineDetails()}
          accessibilityRole="button"
          accessibilityLabel="Try again"
        >
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibility-label="Go back"
        >
          <ArrowLeft size={18} color={colors.brand} />
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loadState === 'not_found' || !medicine) {
    return (
      <View style={styles.centerBox}>
        <AlertTriangle size={48} color={colors.warning} />
        <Text style={styles.centerTitle}>Medicine not found</Text>
        <Text style={styles.centerText}>
          Baka wala pa sa catalog namin ito. Bumalik sa search at ibang gamot naman ang i-try.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibility-label="Go back to search"
        >
          <Text style={styles.primaryButtonText}>Back to Search</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedPrices[0]?.price || 0;
  const highestPrice = sortedPrices[sortedPrices.length - 1]?.price || 0;
  const savings = highestPrice - lowestPrice;
  const pharmacyCount = new Set(
    prices.map((p) => p.branch?.id).filter(Boolean)
  ).size;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchMedicineDetails(true)}
          colors={[colors.brand]}
          tintColor={colors.brand}
        />
      }
    >
      {refreshMessage && (
        <View style={styles.refreshBanner}>
          <RefreshCw size={16} color={colors.warning} />
          <Text style={styles.refreshBannerText}>{refreshMessage}</Text>
        </View>
      )}

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

      {savings > 0 && (
        <View style={styles.savingsBanner}>
          <CheckCircle size={24} color={colors.brand} />
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

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Prices ({pharmacyCount} pharmac{pharmacyCount === 1 ? 'y' : 'ies'})
        </Text>

        {prices.length === 0 ? (
          <View style={styles.emptyPrices}>
            <Text style={styles.emptyText}>No prices available yet</Text>
            <Text style={styles.emptySubtext}>
              Wala pang price na naka-lista dito. Subukan mong i-refresh, or bumalik sa
              Price Check para makita ang ibang gamot.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => fetchMedicineDetails(true)}
              accessibilityRole="button"
              accessibility-label="Refresh prices"
            >
              <Text style={styles.primaryButtonText}>Refresh Prices</Text>
            </TouchableOpacity>
          </View>
        ) : (
          sortedPrices.map((price, index) => (
            <PriceCard key={price.id} price={price} isLowest={index === 0} />
          ))
        )}
      </View>

      <View style={{ height: space.xxxl }} />
    </ScrollView>
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
    backgroundColor: colors.paper,
  },
  centerTitle: {
    fontSize: font.xl,
    fontWeight: '700',
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
    backgroundColor: colors.brand,
    borderRadius: radius.sm,
    paddingHorizontal: space.xxl,
    paddingVertical: space.md,
    minHeight: MIN_TOUCH,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: space.sm,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: font.md,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
  refreshBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: colors.warningBg,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    marginHorizontal: space.lg,
    marginTop: space.lg,
    borderRadius: radius.sm,
  },
  refreshBannerText: {
    flex: 1,
    color: colors.warning,
    fontSize: font.sm,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: space.lg,
    margin: space.lg,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: space.lg,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: space.lg,
    paddingRight: space.sm,
  },
  infoLabel: {
    fontSize: font.xs,
    color: colors.muted,
    marginBottom: space.xs,
  },
  infoValue: {
    fontSize: font.sm + 1,
    fontWeight: '500',
    color: colors.ink,
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandMint,
    borderRadius: radius.md,
    padding: space.lg,
    margin: space.lg,
    marginBottom: 0,
  },
  savingsContent: {
    marginLeft: space.md,
    flex: 1,
  },
  savingsTitle: {
    fontSize: font.md,
    fontWeight: '600',
    color: colors.brandDeep,
  },
  savingsSubtitle: {
    fontSize: font.sm,
    color: colors.brand,
  },
  emptyPrices: {
    alignItems: 'center',
    paddingVertical: space.xxl,
  },
  emptyText: {
    fontSize: font.md,
    color: colors.ink,
    fontWeight: '600',
    marginBottom: space.sm,
  },
  emptySubtext: {
    fontSize: font.sm,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: space.md,
  },
});
