import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Camera, PermissionResponse } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from '@react-navigation/native';
import { ShieldCheck, X, Settings } from 'lucide-react-native';
import { verifyMedicine } from '../services/supabase';
import { NavigationProp } from '../types/navigation';
import { colors, font, space, radius, MIN_TOUCH } from '../theme';

interface Props {
  navigation: NavigationProp;
}

export default function ScannerScreen({ navigation }: Props) {
  const [permission, setPermission] = useState<PermissionResponse | null>(null);
  const [scanned, setScanned] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await Camera.getCameraPermissionsAsync();
      setPermission(res);
      if (!res.granted && res.canAskAgain) {
        const asked = await Camera.requestCameraPermissionsAsync();
        setPermission(asked);
      }
    })();
  }, []);

  // Reset frozen camera when leaving the screen (Lola #12)
  useFocusEffect(
    useCallback(() => {
      return () => {
        setScanned(false);
        setVerifying(false);
      };
    }, [])
  );

  const requestPermission = async () => {
    const res = await Camera.requestCameraPermissionsAsync();
    setPermission(res);
  };

  const openSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      Alert.alert(
        'Settings',
        'Please open your phone Settings and enable camera access for BotikaBantay.'
      );
    }
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || verifying) return;

    setScanned(true);
    setVerifying(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    try {
      const result = await verifyMedicine(data);

      if (result.status === 'found' && result.medicine) {
        Alert.alert(
          'Product Verified ✓',
          `${result.medicine.brand_name} is in our FDA-registered catalog.\n\nGeneric: ${result.medicine.generic_name}\nManufacturer: ${result.medicine.manufacturer}`,
          [
            {
              text: 'View Prices',
              onPress: () => {
                navigation.navigate('MedicineDetail', { id: result.medicine.id });
              },
            },
            {
              text: 'Scan Again',
              onPress: () => setScanned(false),
            },
          ]
        );
      } else if (result.status === 'not_found') {
        Alert.alert(
          'Not in our catalog yet',
          'Hindi namin mahanap ang code na ito sa database namin. Baka bago or hindi pa naka-lista. You can try another barcode, or check again later.',
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
      } else {
        Alert.alert(
          'Could not check right now',
          result.message || 'Parang may problema sa connection. Subukan muli mamaya.',
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
      }
    } catch {
      Alert.alert('Something went wrong', 'Failed to verify product. Please try again.', [
        { text: 'OK', onPress: () => setScanned(false) },
      ]);
    } finally {
      setVerifying(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    const canAskAgain = permission.canAskAgain;
    return (
      <View style={styles.container}>
        <ShieldCheck size={64} color={colors.brand} style={styles.icon} />
        <Text style={styles.title}>Camera Access Needed</Text>
        <Text style={styles.text}>
          BotikaBantay needs the camera to scan medicine barcodes. You can turn it on in
          Settings.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={canAskAgain ? requestPermission : openSettings}
          accessibilityRole="button"
          accessibilityLabel={canAskAgain ? 'Allow camera permission' : 'Open settings'}
        >
          <Text style={styles.buttonText}>
            {canAskAgain ? 'Allow Camera' : 'Open Settings'}
          </Text>
        </TouchableOpacity>
        {!canAskAgain && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={openSettings}
            accessibilityRole="button"
            accessibility-label="Open phone settings"
          >
            <Settings size={18} color={colors.brand} />
            <Text style={styles.secondaryButtonText}>Open Phone Settings</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibility-label="Cancel and go back"
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.scannerContainer}>
      <Camera
        style={styles.camera}
        onBarCodeScanned={scanned || verifying ? undefined : handleBarCodeScanned}
      />

      <View style={styles.overlay}>
        <View style={styles.topOverlay}>
          <Text style={styles.instructionText}>
            Point camera at medicine barcode or QR code
          </Text>
        </View>

        <View style={styles.scanAreaContainer}>
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        <View style={styles.bottomOverlay}>
          {verifying ? (
            <Text style={styles.verifyingText}>Verifying product...</Text>
          ) : (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibility-label="Close scanner"
            >
              <X size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    justifyContent: 'center',
    alignItems: 'center',
    padding: space.xxxl,
  },
  icon: {
    marginBottom: space.xl,
  },
  title: {
    fontSize: font.xl,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: space.md,
    textAlign: 'center',
  },
  text: {
    fontSize: font.md,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: space.xl,
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.brand,
    borderRadius: radius.sm,
    paddingHorizontal: space.xxl,
    paddingVertical: space.md,
    marginBottom: space.md,
    minWidth: 220,
    minHeight: MIN_TOUCH + 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: font.md,
    fontWeight: '600',
    color: colors.white,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    marginBottom: space.sm,
    minHeight: MIN_TOUCH,
  },
  secondaryButtonText: {
    fontSize: font.md,
    color: colors.brand,
    fontWeight: '600',
  },
  cancelButton: {
    padding: space.md,
    minHeight: MIN_TOUCH,
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: font.md,
    color: colors.muted,
  },
  scannerContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: space.xxxl,
  },
  instructionText: {
    color: '#fff',
    fontSize: font.md,
    textAlign: 'center',
    paddingHorizontal: space.xxxl,
  },
  scanAreaContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.brand,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyingText: {
    color: '#fff',
    fontSize: font.md,
  },
  closeButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
