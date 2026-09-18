import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Medicines: undefined;
  MedicineDetail: { id: string };
  Scanner: undefined;
  Nearby: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type MedicineDetailRouteProp = RouteProp<RootStackParamList, 'MedicineDetail'>;
