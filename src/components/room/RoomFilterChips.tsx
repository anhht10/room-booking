import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FilterChip } from '../common/FilterChip';
import { useFilterStore } from '../../store/filterStore';
import { RoomFacility, RoomType } from '../../types/room';
import { CAPACITY_OPTIONS } from '../../utils/constants';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';

const ROOM_TYPES: { label: string; value: RoomType | 'ALL' }[] = [
  { label: 'All Rooms', value: 'ALL' },
  { label: 'Study Room', value: 'STUDY_ROOM' },
  { label: 'Computer Lab', value: 'COMPUTER_LAB' },
  { label: 'Science Lab', value: 'SCIENCE_LAB' },
  { label: 'Group Room', value: 'GROUP_ROOM' },
];

const FACILITY_OPTIONS: { label: string; value: RoomFacility }[] = [
  { label: 'Computer', value: 'COMPUTER' },
  { label: 'Projector', value: 'PROJECTOR' },
  { label: 'Whiteboard', value: 'WHITEBOARD' },
  { label: 'Wi-Fi', value: 'WIFI' },
  { label: 'A/C', value: 'AIR_CONDITIONING' },
];

export const RoomFilterChips: React.FC = React.memo(() => {
  const roomType = useFilterStore((state) => state.roomType);
  const minCapacity = useFilterStore((state) => state.minCapacity);
  const facilities = useFilterStore((state) => state.facilities);
  const availableOnly = useFilterStore((state) => state.availableOnly);

  const setRoomType = useFilterStore((state) => state.setRoomType);
  const setMinCapacity = useFilterStore((state) => state.setMinCapacity);
  const toggleFacility = useFilterStore((state) => state.toggleFacility);
  const toggleAvailableOnly = useFilterStore((state) => state.toggleAvailableOnly);
  const clearFilters = useFilterStore((state) => state.clearFilters);

  const hasFilters =
    roomType !== 'ALL' ||
    minCapacity !== null ||
    facilities.length > 0 ||
    availableOnly;

  return (
    <View style={styles.container}>
      {/* Row 1: Room Types */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ROOM_TYPES.map((type) => (
          <FilterChip
            key={type.value}
            label={type.label}
            selected={roomType === type.value}
            onPress={() => setRoomType(type.value)}
          />
        ))}
      </ScrollView>

      {/* Row 2: Secondary Quick Filters (Capacity, Facilities, Availability) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, styles.secondaryRow]}
      >
        {/* Availability Toggle */}
        <FilterChip
          label="Available Now"
          selected={availableOnly}
          onPress={toggleAvailableOnly}
        />

        {/* Capacity Chips */}
        {CAPACITY_OPTIONS.filter((c) => c.value !== null).map((cap) => (
          <FilterChip
            key={cap.label}
            label={cap.label}
            selected={minCapacity === cap.value}
            onPress={() => setMinCapacity(minCapacity === cap.value ? null : cap.value)}
          />
        ))}

        {/* Facility Chips */}
        {FACILITY_OPTIONS.map((facility) => (
          <FilterChip
            key={facility.value}
            label={facility.label}
            selected={facilities.includes(facility.value)}
            onPress={() => toggleFacility(facility.value)}
          />
        ))}
      </ScrollView>

      {/* Reset Filter Action when Active */}
      {hasFilters && (
        <View style={styles.resetBar}>
          <Text style={styles.activeFiltersText}>Filters active</Text>
          <Pressable onPress={clearFilters} hitSlop={8}>
            <Text style={styles.resetText}>Reset all</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
});

RoomFilterChips.displayName = 'RoomFilterChips';

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  secondaryRow: {
    marginTop: Spacing.xs + 2,
  },
  resetBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs + 2,
  },
  activeFiltersText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  resetText: {
    ...Typography.bodySmall,
    color: Colors.danger,
    fontWeight: '600',
  },
});

