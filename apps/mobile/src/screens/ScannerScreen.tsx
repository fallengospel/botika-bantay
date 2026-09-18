import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ShieldCheck, X } from 'lucide-react';
import { verifyMedicine } from '../services/supabase';
import { NavigationProp } from '../types/navigation';

interface Props {
  navigation: NavigationProp;
}

export default function ScannerScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || verifying) return;
    
    setScanned(true);
    setVerifying(true);

    try {
      const result = await verifyMedicine(data);
      
      if (result.status === 'found') {
        Alert.alert(
          'Product Verified ✓',
          `${result.medicine.brand_name} is FDA-registered.\n\nGeneric: ${result.medicine.generic_name}\nManufacturer: ${result.medicine.manufacturer}`,
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
      } else {
        Alert.alert(
          'Product Not Found',
          'This product was not found in the FDA registry. Please verify manually or report it.',
          [
            {
              text: 'Report Product',
              onPress: () => {
                // TODO: Navigate to report screen
                Alert.alert('Report', 'Report feature coming soon');
              },
            },
            {
              text: 'Scan Again',
              onPress: () => setScanned(false),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to verify product. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => setScanned(false),
          },
        ]
      );
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
    return (
      <View style={styles.container}>
        <ShieldCheck size={64} color="#16a34a" style={styles.icon} />
        <Text style={styles.title}>Camera Permission Required</Text>
        <Text style={styles.text}>
          BotikaBantay needs camera access to scan medicine barcodes and verify their authenticity.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.scannerContainer}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39'],
        }}
      />
      
      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.topOverlay}>
          <Text style={styles.instructionText}>
            Point camera at medicine barcode or QR code
          </Text>
        </View>
        
        {/* Scan Area */}
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
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    padding: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6b7280',
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
    paddingTop: 40,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
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
    borderColor: '#16a34a',
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
    fontSize: 16,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
