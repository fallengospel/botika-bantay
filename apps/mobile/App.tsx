import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList } from './src/types/navigation';

import HomeScreen from './src/screens/HomeScreen';
import MedicinesScreen from './src/screens/MedicinesScreen';
import MedicineDetailScreen from './src/screens/MedicineDetailScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import NearbyScreen from './src/screens/NearbyScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#16a34a',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'BotikaBantay' }}
          />
          <Stack.Screen
            name="Medicines"
            component={MedicinesScreen}
            options={{ title: 'Presyo Check' }}
          />
          <Stack.Screen
            name="MedicineDetail"
            component={MedicineDetailScreen}
            options={{ title: 'Price Comparison' }}
          />
          <Stack.Screen
            name="Scanner"
            component={ScannerScreen}
            options={{ title: 'Tunay Check' }}
          />
          <Stack.Screen
            name="Nearby"
            component={NearbyScreen}
            options={{ title: 'Nearby Pharmacies' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
