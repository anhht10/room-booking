import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { MainTabNavigator } from './MainTabNavigator';
import { BookingStackNavigator } from './BookingStackNavigator';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {/* 1. Primary Bottom Tabs Application Shell */}
      <RootStack.Screen name="MainTabs" component={MainTabNavigator} />

      {/* 2. Focused Modal Booking Flow */}
      <RootStack.Screen
        name="BookingFlow"
        component={BookingStackNavigator}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </RootStack.Navigator>
  );
};

