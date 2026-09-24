import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { RoomDetailScreen } from '../screens/Home/RoomDetailScreen';
import { Colors } from '../theme/colors';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontWeight: '600', fontSize: 17 },
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RoomDetailScreen"
        component={RoomDetailScreen}
        options={{ title: 'Room Specifications' }}
      />
    </Stack.Navigator>
  );
};

