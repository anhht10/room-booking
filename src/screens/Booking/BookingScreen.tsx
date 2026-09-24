import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BookingStackParamList } from '../../navigation/types';
import { useRoom } from '../../hooks/useRoom';
import { useRoomBookings } from '../../hooks/useBookings';
import { useCreateBooking } from '../../hooks/useCreateBooking';
import { useBookingStore } from '../../store/bookingStore';
import { useUserStore } from '../../store/userStore';
import { TimeSlotSelector } from '../../components/room/TimeSlotSelector';
import { BookingSummary } from '../../components/booking/BookingSummary';
import { Button } from '../../components/common/Button';
import { LoadingView } from '../../components/common/LoadingView';
import { EmptyState } from '../../components/common/EmptyState';
import { Colors } from '../../theme/colors';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';
import { getUpcomingDays } from '../../utils/date';
import { STANDARD_TIME_SLOTS } from '../../utils/constants';
import { hasBookingConflict, isTimeSlotAvailable } from '../../utils/booking';

type BookingRouteProp = RouteProp<BookingStackParamList, 'BookingScreen'>;

export const BookingScreen: React.FC = () => {
  const route = useRoute<BookingRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<BookingStackParamList>>();
  const { roomId } = route.params;

  // Global client & user state
  const currentUser = useUserStore((state) => state.currentUser);
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedSlots = useBookingStore((state) => state.selectedSlots);
  const purpose = useBookingStore((state) => state.purpose);
  const setSelectedDate = useBookingStore((state) => state.setSelectedDate);
  const toggleSlot = useBookingStore((state) => state.toggleSlot);
  const setPurpose = useBookingStore((state) => state.setPurpose);
  const clearBookingDraft = useBookingStore((state) => state.clearBookingDraft);

  // Local conflict error message state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Room data & existing bookings for this room
  const { data: room, isLoading: isLoadingRoom } = useRoom(roomId);
  const { data: existingBookings = [], isLoading: isLoadingBookings } = useRoomBookings(roomId);

  // TanStack Mutation for creating a booking
  const createBookingMutation = useCreateBooking();

  // Upcoming 7 days options for the date selector
  const upcomingDays = useMemo(() => getUpcomingDays(7), []);

  // Conflict prevention checker passed to TimeSlotSelector
  const checkSlotAvailability = useCallback(
    (slotString: string) => {
      return isTimeSlotAvailable(roomId, selectedDate, slotString, existingBookings);
    },
    [roomId, selectedDate, existingBookings]
  );

  // Handle final booking submission
  const handleConfirmBooking = async () => {
    setErrorMessage(null);

    if (selectedSlots.length === 0) {
      Alert.alert('Select a Time Slot', 'Please select at least one available time slot to proceed.');
      return;
    }

    // Client-side conflict pre-validation
    const hasConflict = hasBookingConflict(
      {
        roomId,
        date: selectedDate,
        slots: selectedSlots,
      },
      existingBookings
    );

    if (hasConflict) {
      setErrorMessage('One or more of your selected time slots has just been booked. Please choose an alternate slot.');
      return;
    }

    try {
      const created = await createBookingMutation.mutateAsync({
        roomId,
        userId: currentUser.id,
        date: selectedDate,
        slots: selectedSlots,
        purpose: purpose.trim() || 'General Study and Academic Collaboration',
      });

      // Clear draft on successful creation
      clearBookingDraft();

      // Navigate to confirmation screen
      navigation.replace('BookingConfirmationScreen', {
        bookingId: created.id,
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to confirm booking. Please try again.');
    }
  };

  if (isLoadingRoom || isLoadingBookings) {
    return <LoadingView message="Loading schedule and slot availability..." />;
  }

  if (!room) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Room Not Found"
        description="Unable to find the requested campus room."
        actionLabel="Go back"
        onAction={() => navigation.goBack()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Selected Room Header Card */}
        <View style={styles.roomBanner}>
          <Text style={styles.roomType}>{room.type.replace('_', ' ')}</Text>
          <Text style={styles.roomTitle}>{room.name}</Text>
          <Text style={styles.roomLocation}>
            {room.building} • Floor {room.floor} ({room.roomNumber})
          </Text>
        </View>

        {/* Conflict Alert Banner if applicable */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* 1. Date Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datePickerRow}
          >
            {upcomingDays.map((day) => {
              const isSelected = selectedDate === day.dateString;
              return (
                <Pressable
                  key={day.dateString}
                  onPress={() => {
                    setErrorMessage(null);
                    setSelectedDate(day.dateString);
                  }}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Select date ${day.fullLabel}`}
                  style={[styles.dateCard, isSelected && styles.selectedDateCard]}
                >
                  <Text style={[styles.dayLabel, isSelected && styles.selectedDateText]}>
                    {day.dayLabel}
                  </Text>
                  <Text style={[styles.dayNumber, isSelected && styles.selectedDateText]}>
                    {day.dayNumber}
                  </Text>
                  <Text style={[styles.monthLabel, isSelected && styles.selectedDateText]}>
                    {day.monthLabel}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* 2. Time Slot Selector with Real-time Conflict Disabling */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>2. Select Time Slots</Text>
            <Text style={styles.slotHint}>Tap one or more slots</Text>
          </View>

          <TimeSlotSelector
            slots={STANDARD_TIME_SLOTS}
            selectedSlots={selectedSlots}
            onToggleSlot={toggleSlot}
            isSlotAvailable={checkSlotAvailability}
            openingTime={room.openingTime}
            closingTime={room.closingTime}
          />
        </View>

        {/* 3. Purpose (Optional Note) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Purpose of Reservation</Text>
          <TextInput
            style={styles.purposeInput}
            value={purpose}
            onChangeText={setPurpose}
            placeholder="e.g. AI project sprint, Physics lab report, Math study group"
            placeholderTextColor={Colors.textMuted}
            maxLength={100}
          />
        </View>

        {/* 4. Booking Summary */}
        <BookingSummary room={room} date={selectedDate} slots={selectedSlots} />
      </ScrollView>

      {/* Sticky Bottom Confirmation Action */}
      <View style={styles.footerBar}>
        <View style={styles.footerSummary}>
          <Text style={styles.footerSlotsCount}>
            {selectedSlots.length} slot{selectedSlots.length === 1 ? '' : 's'} selected
          </Text>
          <Text style={styles.footerTotal}>
            {selectedSlots.length > 0 ? `${selectedSlots.length} hr total` : 'None'}
          </Text>
        </View>
        <Button
          title="Confirm Booking"
          onPress={handleConfirmBooking}
          disabled={selectedSlots.length === 0}
          loading={createBookingMutation.isPending}
          size="lg"
          style={styles.confirmButton}
        />
      </View>
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
  roomBanner: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  roomType: {
    ...Typography.caption,
    color: Colors.secondary,
    fontWeight: '700',
    marginBottom: 2,
  },
  roomTitle: {
    ...Typography.h2,
    fontSize: 20,
  },
  roomLocation: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  errorBanner: {
    backgroundColor: Colors.dangerLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.danger,
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.danger,
    fontWeight: '600',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.h3,
    fontSize: 16,
    marginBottom: Spacing.sm,
  },
  slotHint: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontSize: 12,
  },
  datePickerRow: {
    gap: Spacing.sm,
    paddingVertical: 2,
  },
  dateCard: {
    width: 72,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  selectedDateCard: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  dayNumber: {
    ...Typography.h2,
    fontSize: 20,
    marginVertical: 2,
  },
  monthLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
  },
  selectedDateText: {
    color: Colors.textInverse,
  },
  purposeInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Typography.body,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  footerSummary: {
    flex: 1,
  },
  footerSlotsCount: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  footerTotal: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.primary,
  },
  confirmButton: {
    minWidth: 170,
  },
});

