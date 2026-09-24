import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeStackParamList } from '../../navigation/types';
import { useFilterStore } from '../../store/filterStore';
import { useUserStore } from '../../store/userStore';
import { useRooms } from '../../hooks/useRooms';
import { SearchBar } from '../../components/common/SearchBar';
import { RoomFilterChips } from '../../components/room/RoomFilterChips';
import { RoomList } from '../../components/room/RoomList';
import { LoadingView } from '../../components/common/LoadingView';
import { EmptyState } from '../../components/common/EmptyState';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';
import { RoomFilters } from '../../types/room';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  // Granular Zustand subscriptions to avoid full re-render on unrelated changes
  const searchQuery = useFilterStore((state) => state.searchQuery);
  const roomType = useFilterStore((state) => state.roomType);
  const minCapacity = useFilterStore((state) => state.minCapacity);
  const floor = useFilterStore((state) => state.floor);
  const facilities = useFilterStore((state) => state.facilities);
  const availableOnly = useFilterStore((state) => state.availableOnly);
  const setSearchQuery = useFilterStore((state) => state.setSearchQuery);
  const clearFilters = useFilterStore((state) => state.clearFilters);

  const currentUser = useUserStore((state) => state.currentUser);

  // Memoized query filter payload
  const filterParams: RoomFilters = useMemo(
    () => ({
      searchQuery,
      roomType,
      minCapacity: minCapacity || undefined,
      floor,
      facilities,
      availableOnly,
    }),
    [searchQuery, roomType, minCapacity, floor, facilities, availableOnly]
  );

  // TanStack Query for server state
  const { data: rooms = [], isLoading, isError, refetch, isRefetching } = useRooms(filterParams);

  // Stable navigation callback
  const handleRoomPress = useCallback(
    (roomId: string) => {
      navigation.navigate('RoomDetailScreen', { roomId });
    },
    [navigation]
  );

  // Header Component inside FlatList
  const ListHeader = useMemo(() => {
    return (
      <View style={styles.headerContainer}>
        {/* Campus Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.subGreeting}>Welcome back,</Text>
          <Text style={styles.userName}>{currentUser.name}</Text>
          <Text style={styles.campusSubtitle}>Find and reserve study spaces and science labs</Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search room, building, or code..."
          />
        </View>

        {/* Filter Chips Bar */}
        <RoomFilterChips />

        {/* Feed Counter */}
        <View style={styles.counterRow}>
          <Text style={styles.counterTitle}>Available Spaces</Text>
          <Text style={styles.counterBadge}>
            {rooms.length} room{rooms.length === 1 ? '' : 's'} found
          </Text>
        </View>
      </View>
    );
  }, [currentUser.name, searchQuery, setSearchQuery, rooms.length]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {isLoading ? (
        <LoadingView message="Loading campus rooms and labs..." />
      ) : isError ? (
        <EmptyState
          icon="alert-circle-outline"
          title="Unable to load rooms"
          description="There was an issue fetching room data from the campus directory."
          actionLabel="Try again"
          onAction={() => refetch()}
        />
      ) : (
        <RoomList
          rooms={rooms}
          onRoomPress={handleRoomPress}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="No rooms match your filters"
              description="Try adjusting your search query, capacity criteria, or removing selected facility filters."
              actionLabel="Clear all filters"
              onAction={clearFilters}
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
  headerContainer: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  greetingSection: {
    marginBottom: Spacing.md,
  },
  subGreeting: {
    ...Typography.subtitle,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  userName: {
    ...Typography.h1,
    color: Colors.primaryDark,
  },
  campusSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  searchSection: {
    marginBottom: Spacing.xs,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  counterTitle: {
    ...Typography.h3,
    fontSize: 18,
  },
  counterBadge: {
    ...Typography.caption,
    backgroundColor: Colors.primaryLight,
    color: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
    fontWeight: '700',
  },
});

