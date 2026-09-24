import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// 1. Home Stack
export type HomeStackParamList = {
  HomeScreen: undefined;
  RoomDetailScreen: { roomId: string };
};

// 2. Booking Stack (Modal Flow)
export type BookingStackParamList = {
  BookingScreen: { roomId: string };
  BookingConfirmationScreen: { bookingId: string };
};

// 3. My Bookings Stack
export type MyBookingsStackParamList = {
  MyBookingsScreen: undefined;
  BookingDetailScreen: { bookingId: string };
};

// 4. Profile Stack
export type ProfileStackParamList = {
  ProfileScreen: undefined;
};

// 5. Main Tab Navigator
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  MyBookingsTab: NavigatorScreenParams<MyBookingsStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// 6. Root Stack (Wraps MainTabs and Modal BookingFlow)
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  BookingFlow: NavigatorScreenParams<BookingStackParamList>;
};

// Strongly typed navigation prop helpers
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type MainTabNavProp = BottomTabNavigationProp<MainTabParamList>;
export type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;
export type BookingNavigationProp = NativeStackNavigationProp<BookingStackParamList>;
export type MyBookingsNavigationProp = NativeStackNavigationProp<MyBookingsStackParamList>;

