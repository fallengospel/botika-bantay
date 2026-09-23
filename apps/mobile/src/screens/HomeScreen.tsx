import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingDown, ShieldCheck, Pill, MapPin } from 'lucide-react';
import { NavigationProp } from '../types/navigation';

interface Props {
  navigation: NavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>BotikaBantay</Text>
          <Text style={styles.heroTagline}>Presyo na Tama, Gamot na Tunay</Text>
          <Text style={styles.heroSubtitle}>The Right Price, The Real Medicine</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>What would you like to do?</Text>
          
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Medicines')}
          >
            <View style={[styles.actionIcon, styles.priceIcon]}>
              <TrendingDown size={32} color="#12924A" />
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
          >
            <View style={[styles.actionIcon, styles.verifyIcon]}>
              <ShieldCheck size={32} color="#2563eb" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Verify</Text>
              <Text style={styles.actionDescription}>
                Scan barcode to check kung FDA-registered ang gamot
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Nearby')}
          >
            <View style={[styles.actionIcon, styles.nearbyIcon]}>
              <MapPin size={32} color="#ea580c" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Nearby Pharmacies</Text>
              <Text style={styles.actionDescription}>
                Find pharmacies near you with directions
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Why BotikaBantay?</Text>
          
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#E7F4EC' }]}>
                <Pill size={24} color="#12924A" />
              </View>
              <Text style={styles.featureTitle}>100+ Medicines</Text>
              <Text style={styles.featureDescription}>
                Common OTC and maintenance medications
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#dbeafe' }]}>
                <ShieldCheck size={24} color="#2563eb" />
              </View>
              <Text style={styles.featureTitle}>FDA Verified</Text>
              <Text style={styles.featureDescription}>
                Cross-referenced with FDA Philippines
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#ffedd5' }]}>
                <MapPin size={24} color="#ea580c" />
              </View>
              <Text style={styles.featureTitle}>Location-Based</Text>
              <Text style={styles.featureDescription}>
                Find pharmacies near you
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F2',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  hero: {
    backgroundColor: '#0F1F17',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroTagline: {
    fontSize: 18,
    color: '#A6D9BF',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6FC49A',
  },
  actionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  actionCard: {
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
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  priceIcon: {
    backgroundColor: '#E7F4EC',
  },
  verifyIcon: {
    backgroundColor: '#dbeafe',
  },
  nearbyIcon: {
    backgroundColor: '#ffedd5',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  featuresContainer: {
    padding: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});
