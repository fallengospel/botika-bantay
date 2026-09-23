import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingDown, ShieldCheck, Pill, MapPin, Search, ArrowRight } from 'lucide-react-native';
import { NavigationProp } from '../types/navigation';
import { colors, font, space, radius, MIN_TOUCH } from '../theme';

interface Props {
  navigation: NavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');

  const startSearch = () => {
    Keyboard.dismiss();
    navigation.navigate('Medicines', { initialSearch: query.trim() });
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>BotikaBantay</Text>
          <Text style={styles.heroTagline}>Presyo na Tama, Gamot na Tunay</Text>
          <Text style={styles.heroSubtitle}>The Right Price, The Real Medicine</Text>

          {/* Quick search — Lola's #4: search right on Home */}
          <View style={styles.searchBox}>
            <Search size={20} color={colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Hanapin ang gamot..."
              placeholderTextColor={colors.muted}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={startSearch}
              returnKeyType="search"
              accessibilityLabel="Search medicine from home"
            />
            <TouchableOpacity
              style={styles.searchGo}
              onPress={startSearch}
              accessibilityRole="button"
              accessibilityLabel="Start search"
            >
              <ArrowRight size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>What would you like to do?</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Medicines')}
            accessibilityRole="button"
            accessibilityLabel="Price Check — compare medicine prices"
          >
            <View style={[styles.actionIcon, styles.priceIcon]}>
              <TrendingDown size={28} color={colors.brand} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Price Check</Text>
              <Text style={styles.actionDescription}>
                I-compare ang presyo ng gamot across major pharmacy chains
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Scanner')}
            accessibilityRole="button"
            accessibilityLabel="Verify — scan medicine barcode"
          >
            <View style={[styles.actionIcon, styles.verifyIcon]}>
              <ShieldCheck size={28} color={colors.brandDeep} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Verify</Text>
              <Text style={styles.actionDescription}>
                Scan barcode to check kung naka-lista sa catalog namin ang gamot
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Nearby')}
            accessibilityRole="button"
            accessibilityLabel="Nearby Pharmacies"
          >
            <View style={[styles.actionIcon, styles.nearbyIcon]}>
              <MapPin size={28} color={colors.brandGold} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Nearby Pharmacies</Text>
              <Text style={styles.actionDescription}>
                Find pharmacies near you with directions
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Features — honest claims (Lola #21) */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Why BotikaBantay?</Text>

          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.brandMint }]}>
                <Pill size={24} color={colors.brand} />
              </View>
              <Text style={styles.featureTitle}>Medicine Catalog</Text>
              <Text style={styles.featureDescription}>
                Common OTC and maintenance medications
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.brandMint }]}>
                <ShieldCheck size={24} color={colors.brandDeep} />
              </View>
              <Text style={styles.featureTitle}>FDA Registry Check</Text>
              <Text style={styles.featureDescription}>
                Checked against our catalog of FDA-registered products
              </Text>
            </View>

            <View style={[styles.featureItem, styles.featureItemFull]}>
              <View style={[styles.featureIcon, { backgroundColor: colors.warningBg }]}>
                <MapPin size={24} color={colors.warning} />
              </View>
              <Text style={styles.featureTitle}>Location-Based</Text>
              <Text style={styles.featureDescription}>
                Find pharmacies within 10 km of you
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scrollContent: {
    paddingBottom: space.xxl,
  },
  hero: {
    backgroundColor: colors.ink,
    paddingTop: space.xxl,
    paddingBottom: space.xxl,
    paddingHorizontal: space.xl,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.white,
    marginBottom: space.sm,
  },
  heroTagline: {
    fontSize: font.lg,
    color: colors.brandMint,
    fontStyle: 'italic',
    marginBottom: space.xs,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: font.md,
    color: '#6FC49A',
    marginBottom: space.xl,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    width: '100%',
    minHeight: MIN_TOUCH + 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    height: MIN_TOUCH + 4,
    fontSize: font.md,
    color: colors.ink,
    marginLeft: space.sm,
  },
  searchGo: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    padding: space.xl,
  },
  sectionTitle: {
    fontSize: font.xl,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: space.lg,
  },
  actionCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.md,
    minHeight: MIN_TOUCH + 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: space.lg,
  },
  priceIcon: {
    backgroundColor: colors.brandMint,
  },
  verifyIcon: {
    backgroundColor: colors.brandMint,
  },
  nearbyIcon: {
    backgroundColor: colors.warningBg,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: space.xs,
  },
  actionDescription: {
    fontSize: font.sm,
    color: colors.muted,
    lineHeight: 20,
  },
  featuresContainer: {
    padding: space.xl,
    paddingTop: 0,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: space.md,
  },
  featureItem: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: space.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureItemFull: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    textAlign: 'left',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: space.md,
  },
  featureTitle: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: space.xs,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: font.xs + 1,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
