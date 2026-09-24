import React, { useCallback } from 'react';
import {
  FlatList,
  ListRenderItem,
  Platform,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { Room } from '../../types/room';
import { RoomCard } from './RoomCard';
import { Spacing } from '../../theme/spacing';
import { Colors } from '../../theme/colors';

interface RoomListProps {
  rooms: Room[];
  onRoomPress: (roomId: string) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  ListHeaderComponent?: React.ReactElement | null;
  ListEmptyComponent?: React.ReactElement | null;
}

// Stable key extractor to prevent unnecessary reconciliation
const keyExtractor = (item: Room): string => item.id;

export const RoomList: React.FC<RoomListProps> = React.memo(
  ({
    rooms,
    onRoomPress,
    refreshing = false,
    onRefresh,
    ListHeaderComponent,
    ListEmptyComponent,
  }) => {
    // Stable renderItem callback
    const renderItem: ListRenderItem<Room> = useCallback(
      ({ item }) => <RoomCard room={item} onPress={onRoomPress} />,
      [onRoomPress]
    );

    return (
      <FlatList
        data={rooms}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        // 60 FPS Performance Optimizations
        initialNumToRender={5}
        maxToRenderPerBatch={6}
        windowSize={7}
        removeClippedSubviews={Platform.OS === 'android'}
        updateCellsBatchingPeriod={50}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          ) : undefined
        }
      />
    );
  }
);

RoomList.displayName = 'RoomList';

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    flexGrow: 1,
  },
});

