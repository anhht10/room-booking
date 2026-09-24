import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MyBookingsStackParamList } from './types';
import { MyBookingsScreen } from '../screens/MyBookings/MyBookingsScreen';
import { BookingDetailScreen } from '../screens/MyBookings/BookingDetailScreen';
import { Colors } from '../theme/colors';

const Stack = createNativeStackNavigator<MyBookingsStackParamList>();

export const MyBookingsStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MyBookingsScreen"
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontWeight: '600', fontSize: 17 },
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="MyBookingsScreen"
        component={MyBookingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookingDetailScreen"
        component={BookingDetailScreen}
        options={{ title: 'Reservation Details' }}
      />
    </Stack.Navigator>
  );
};

