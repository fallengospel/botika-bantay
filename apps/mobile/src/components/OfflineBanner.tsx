import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { colors, font, space } from '../theme';

/**
 * Global offline banner (Miguel #14): shows when connectivity drops
 * so users know why requests may fail.
 */
export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state: NetInfoState) => {
      const online =
        state.isConnected !== false && state.isInternetReachable !== false;
      setOffline(!online);
    });
    return () => unsub();
  }, []);

  if (!offline) return null;

  return (
    <View style={styles.banner} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <Text style={styles.text}>
        No internet connection. Prices and verification may be unavailable.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.warningBg,
    borderBottomColor: colors.warning,
    borderBottomWidth: 1,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
  },
  text: {
    color: colors.warning,
    fontSize: font.sm,
    textAlign: 'center',
  },
});
