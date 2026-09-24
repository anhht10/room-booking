import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../../types/booking';
import { Colors } from '../../theme/colors';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';
import { Badge } from '../common/Badge';
import { formatFriendlyDate } from '../../utils/date';
import { ROOM_TYPE_LABELS } from '../../utils/constants';

interface BookingCardProps {
  booking: Booking;
  onPress: (bookingId: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = React.memo(({ booking, onPress }) => {
  const badgeVariant =
    booking.status === 'CONFIRMED'
      ? 'confirmed'
      : booking.status === 'COMPLETED'
      ? 'completed'
      : 'cancelled';

  return (
    <Pressable
      onPress={() => onPress(booking.id)}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Booking ${booking.id} for ${booking.roomName}, on ${formatFriendlyDate(booking.date)} at ${booking.startTime} to ${booking.endTime}. Status: ${booking.status}`}
      accessibilityHint="Tap to view reservation details and cancellation options"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View style={styles.idContainer}>
          <Text style={styles.idText}>{booking.id}</Text>
          <Text style={styles.typeLabel}>{ROOM_TYPE_LABELS[booking.roomType]}</Text>
        </View>
        <Badge label={booking.status} variant={badgeVariant} />
      </View>

      <Text style={styles.roomName}>{booking.roomName}</Text>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={15} color={Colors.textSecondary} />
        <Text style={styles.infoText}>
          {booking.building} • Floor {booking.floor} ({booking.roomNumber})
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={15} color={Colors.textSecondary} />
        <Text style={styles.infoText}>{formatFriendlyDate(booking.date)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={15} color={Colors.textSecondary} />
        <Text style={styles.infoText}>
          {booking.startTime} - {booking.endTime} ({booking.slots.length} hr{booking.slots.length > 1 ? 's' : ''})
        </Text>
      </View>

      {booking.purpose && (
        <View style={styles.purposeBox}>
          <Text style={styles.purposeLabel}>Purpose:</Text>
          <Text style={styles.purposeText} numberOfLines={1}>
            {booking.purpose}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.detailsActionText}>View details</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
      </View>
    </Pressable>
  );
});

BookingCard.displayName = 'BookingCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  pressed: {
    opacity: 0.95,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  idText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  typeLabel: {
    ...Typography.caption,
    color: Colors.secondary,
    fontWeight: '600',
  },
  roomName: {
    ...Typography.h3,
    fontSize: 17,
    marginVertical: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  infoText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  purposeBox: {
    backgroundColor: Colors.surfaceHover,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
    flexDirection: 'row',
    gap: 6,
  },
  purposeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  purposeText: {
    fontSize: 11,
    color: Colors.textPrimary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: 2,
  },
  detailsActionText: {
    ...Typography.button,
    fontSize: 12,
    color: Colors.primary,
  },
});

