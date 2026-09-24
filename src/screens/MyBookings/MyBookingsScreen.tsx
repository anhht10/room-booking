import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyBookingsStackParamList } from '../../navigation/types';
import { useBookings } from '../../hooks/useBookings';
import { useUserStore } from '../../store/userStore';
import { BookingCard } from '../../components/booking/BookingCard';
import { LoadingView } from '../../components/common/LoadingView';
import { EmptyState } from '../../components/common/EmptyState';
import { Colors } from '../../theme/colors';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';
import { Booking, BookingStatus } from '../../types/booking';

type TabStatus = 'ALL' | BookingStatus;

const TABS: { label: string; value: TabStatus }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const keyExtractor = (item: Booking) => item.id;

export const MyBookingsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MyBookingsStackParamList>>();
  const currentUser = useUserStore((state) => state.currentUser);
  const [selectedTab, setSelectedTab] = useState<TabStatus>('ALL');

  const { data: bookings = [], isLoading, isError, refetch, isRefetching } = useBookings(
    currentUser.id
  );

  const filteredBookings = useMemo(() => {
    if (selectedTab === 'ALL') return bookings;
    return bookings.filter((b) => b.status === selectedTab);
  }, [bookings, selectedTab]);

  const handleBookingPress = useCallback(
    (bookingId: string) => {
      navigation.navigate('BookingDetailScreen', { bookingId });
    },
    [navigation]
  );

  const renderItem: ListRenderItem<Booking> = useCallback(
    ({ item }) => <BookingCard booking={item} onPress={handleBookingPress} />,
    [handleBookingPress]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Screen Title */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>Manage your reserved study rooms and campus labs</Text>

        {/* Status Filter Segment Bar */}
        <View style={styles.segmentBar}>
          {TABS.map((tab) => {
            const isSelected = selectedTab === tab.value;
            return (
              <Pressable
                key={tab.value}
                onPress={() => setSelectedTab(tab.value)}
                style={[styles.segmentBtn, isSelected && styles.activeSegmentBtn]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    isSelected && styles.activeSegmentText,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Bookings Feed */}
      {isLoading ? (
        <LoadingView message="Loading your bookings..." />
      ) : isError ? (
        <EmptyState
          icon="alert-circle-outline"
          title="Could not load bookings"
          description="Failed to retrieve your booking history."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      ) : (
        <FlatList
          data={filteredBookings}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          maxToRenderPerBatch={8}
          windowSize={7}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="No bookings found"
              description={
                selectedTab === 'ALL'
                  ? "You haven't booked any rooms or labs yet. Browse available spaces from the Explore tab."
                  : `You don't have any bookings marked as ${selectedTab.toLowerCase()}.`
              }
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    ...Typography.h1,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  segmentBar: {
    flexDirection: 'row',
    backgroundColor: Colors.border,
    padding: 3,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  activeSegmentBtn: {
    backgroundColor: Colors.surface,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'none',
  },
  activeSegmentText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxxl,
    flexGrow: 1,
  },
});

