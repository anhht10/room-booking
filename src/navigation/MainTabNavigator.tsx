import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { HomeStackNavigator } from './HomeStackNavigator';
import { MyBookingsStackNavigator } from './MyBookingsStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { Colors } from '../theme/colors';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'cube-outline';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'MyBookingsTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Explore',
          tabBarAccessibilityLabel: 'Explore campus rooms and science labs tab',
        }}
      />
      <Tab.Screen
        name="MyBookingsTab"
        component={MyBookingsStackNavigator}
        options={{
          tabBarLabel: 'My Bookings',
          tabBarAccessibilityLabel: 'View your scheduled bookings tab',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: 'Student profile and settings tab',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});

