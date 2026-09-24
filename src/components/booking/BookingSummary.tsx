import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Room } from '../../types/room';
import { Colors } from '../../theme/colors';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';
import { formatFriendlyDate } from '../../utils/date';
import { getOverallTimeRange } from '../../utils/booking';

interface BookingSummaryProps {
  room: Room;
  date: string;
  slots: string[];
}

export const BookingSummary: React.FC<BookingSummaryProps> = React.memo(
  ({ room, date, slots }) => {
    const { startTime, endTime, durationHours } = getOverallTimeRange(slots);

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reservation Summary</Text>

        <View style={styles.itemRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="business-outline" size={18} color={Colors.primary} />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemLabel}>Room & Location</Text>
            <Text style={styles.itemValue}>{room.name}</Text>
            <Text style={styles.itemSubValue}>
              {room.building} • Floor {room.floor} ({room.roomNumber})
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.itemRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemLabel}>Selected Date</Text>
            <Text style={styles.itemValue}>{formatFriendlyDate(date)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.itemRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="time-outline" size={18} color={Colors.primary} />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemLabel}>Time & Duration</Text>
            <Text style={styles.itemValue}>
              {startTime && endTime ? `${startTime} - ${endTime}` : 'No slots selected'}
            </Text>
            {durationHours > 0 && (
              <Text style={styles.itemSubValue}>
                Total duration: {durationHours} hour{durationHours > 1 ? 's' : ''} ({slots.length} slot{slots.length > 1 ? 's' : ''})
              </Text>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.itemRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="people-outline" size={18} color={Colors.primary} />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemLabel}>Room Capacity</Text>
            <Text style={styles.itemValue}>Up to {room.capacity} participants</Text>
          </View>
        </View>
      </View>
    );
  }
);

BookingSummary.displayName = 'BookingSummary';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    marginVertical: Spacing.md,
  },
  cardTitle: {
    ...Typography.h3,
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
    marginBottom: 2,
  },
  itemValue: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  itemSubValue: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.xs,
  },
});

