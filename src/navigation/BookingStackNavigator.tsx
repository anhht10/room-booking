import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookingStackParamList } from './types';
import { BookingScreen } from '../screens/Booking/BookingScreen';
import { BookingConfirmationScreen } from '../screens/Booking/BookingConfirmationScreen';
import { Colors } from '../theme/colors';

const Stack = createNativeStackNavigator<BookingStackParamList>();

export const BookingStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="BookingScreen"
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontWeight: '600', fontSize: 17 },
        headerBackTitle: 'Cancel',
      }}
    >
      <Stack.Screen
        name="BookingScreen"
        component={BookingScreen}
        options={{ title: 'Schedule Reservation' }}
      />
      <Stack.Screen
        name="BookingConfirmationScreen"
        component={BookingConfirmationScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

