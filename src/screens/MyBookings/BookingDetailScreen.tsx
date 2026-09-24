import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MyBookingsStackParamList } from '../../navigation/types';
import { useBookings } from '../../hooks/useBookings';
import { useCancelBooking } from '../../hooks/useCancelBooking';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingView } from '../../components/common/LoadingView';
import { EmptyState } from '../../components/common/EmptyState';
import { Colors } from '../../theme/colors';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';
import { formatFriendlyDate } from '../../utils/date';
import { ROOM_TYPE_LABELS } from '../../utils/constants';

type BookingDetailRouteProp = RouteProp<MyBookingsStackParamList, 'BookingDetailScreen'>;

export const BookingDetailScreen: React.FC = () => {
  const route = useRoute<BookingDetailRouteProp>();
  const navigation = useNavigation();
  const { bookingId } = route.params;

  const { data: bookings = [], isLoading } = useBookings();
  const cancelBookingMutation = useCancelBooking();

  const booking = bookings.find((b) => b.id === bookingId);

  const handleCancelPress = () => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel this booking? This will immediately release the time slot for other students.',
      [
        { text: 'Keep Reservation', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelBookingMutation.mutateAsync(bookingId);
              Alert.alert('Booking Cancelled', 'Your reservation has been successfully cancelled.');
            } catch (err: any) {
              Alert.alert('Cancellation Error', err?.message || 'Could not cancel booking.');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingView message="Loading reservation details..." />;
  }

  if (!booking) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Booking Not Found"
        description="This reservation record could not be found."
        actionLabel="Go back"
        onAction={() => navigation.goBack()}
      />
    );
  }

  const isConfirmed = booking.status === 'CONFIRMED';
  const badgeVariant =
    booking.status === 'CONFIRMED'
      ? 'confirmed'
      : booking.status === 'COMPLETED'
      ? 'completed'
      : 'cancelled';

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card Header */}
        <View style={styles.headerCard}>
          <View style={styles.refRow}>
            <Text style={styles.refLabel}>REFERENCE ID</Text>
            <Badge label={booking.status} variant={badgeVariant} />
          </View>
          <Text style={styles.bookingId}>{booking.id}</Text>
          <Text style={styles.typeLabel}>{ROOM_TYPE_LABELS[booking.roomType]}</Text>
          <Text style={styles.roomName}>{booking.roomName}</Text>
        </View>

        {/* Schedule & Location Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Reservation Details</Text>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color={Colors.primary} />
            <View style={styles.detailTextCol}>
              <Text style={styles.detailLabel}>Building & Floor</Text>
              <Text style={styles.detailValue}>
                {booking.building} • Floor {booking.floor} (Room {booking.roomNumber})
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            <View style={styles.detailTextCol}>
              <Text style={styles.detailLabel}>Reserved Date</Text>
              <Text style={styles.detailValue}>{formatFriendlyDate(booking.date)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <View style={styles.detailTextCol}>
              <Text style={styles.detailLabel}>Time Window</Text>
              <Text style={styles.detailValue}>
                {booking.startTime} - {booking.endTime}
              </Text>
              <Text style={styles.detailSub}>
                {booking.slots.length} reserved hour{booking.slots.length > 1 ? 's' : ''}: {booking.slots.join(', ')}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
            <View style={styles.detailTextCol}>
              <Text style={styles.detailLabel}>Purpose of Use</Text>
              <Text style={styles.detailValue}>{booking.purpose || 'Academic Study'}</Text>
            </View>
          </View>
        </View>

        {/* Cancellation Notice if already cancelled */}
        {!isConfirmed && (
          <View
            style={[
              styles.noticeCard,
              booking.status === 'CANCELLED' ? styles.cancelledNotice : styles.completedNotice,
            ]}
          >
            <Ionicons
              name={booking.status === 'CANCELLED' ? 'close-circle-outline' : 'checkmark-circle-outline'}
              size={20}
              color={booking.status === 'CANCELLED' ? Colors.danger : Colors.info}
            />
            <Text
              style={[
                styles.noticeText,
                booking.status === 'CANCELLED' ? styles.cancelledNoticeText : styles.completedNoticeText,
              ]}
            >
              {booking.status === 'CANCELLED'
                ? 'This booking was cancelled and the room has been returned to the campus availability pool.'
                : 'This session has concluded. Thank you for utilizing campus study spaces.'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Cancel Action Footer */}
      {isConfirmed && (
        <View style={styles.footer}>
          <Button
            title="Cancel Booking"
            variant="danger"
            size="lg"
            onPress={handleCancelPress}
            loading={cancelBookingMutation.isPending}
            style={styles.cancelBtn}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 110,
  },
  headerCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  refRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  refLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  bookingId: {
    ...Typography.h1,
    fontSize: 22,
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  typeLabel: {
    ...Typography.caption,
    color: Colors.secondary,
    fontWeight: '700',
    marginBottom: 2,
  },
  roomName: {
    ...Typography.h2,
    fontSize: 18,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    ...Typography.h3,
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  detailTextCol: {
    flex: 1,
  },
  detailLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    ...Typography.body,
    fontWeight: '600',
  },
  detailSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.sm,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  cancelledNotice: {
    backgroundColor: Colors.dangerLight,
  },
  completedNotice: {
    backgroundColor: Colors.infoLight,
  },
  noticeText: {
    ...Typography.bodySmall,
    flex: 1,
    lineHeight: 18,
  },
  cancelledNoticeText: {
    color: Colors.danger,
  },
  completedNoticeText: {
    color: Colors.info,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    elevation: 8,
  },
  cancelBtn: {
    width: '100%',
  },
});

