import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';
import { parseSlotInterval, timeStringToMinutes } from '../../utils/date';

interface TimeSlotSelectorProps {
  slots: readonly string[];
  selectedSlots: string[];
  onToggleSlot: (slot: string) => void;
  isSlotAvailable: (slot: string) => boolean;
  openingTime?: string;
  closingTime?: string;
}

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = React.memo(
  ({
    slots,
    selectedSlots,
    onToggleSlot,
    isSlotAvailable,
    openingTime,
    closingTime,
  }) => {
    return (
      <View style={styles.container}>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendAvailable]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendSelected]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendBooked]} />
            <Text style={styles.legendText}>Booked</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {slots.map((slot) => {
            const { startMinutes, endMinutes } = parseSlotInterval(slot);

            // Check operating hours
            const isWithinHours =
              (!openingTime || startMinutes >= timeStringToMinutes(openingTime)) &&
              (!closingTime || endMinutes <= timeStringToMinutes(closingTime));

            const isAvailable = isWithinHours && isSlotAvailable(slot);
            const isSelected = selectedSlots.includes(slot);

            let slotStyle: StyleProp<ViewStyle> = styles.slotAvailable;
            let textStyle: StyleProp<TextStyle> = styles.textAvailable;
            let statusLabel = 'Available';

            if (!isWithinHours) {
              slotStyle = styles.slotClosed;
              textStyle = styles.textBooked;
              statusLabel = 'Closed';
            } else if (!isAvailable) {
              slotStyle = styles.slotBooked;
              textStyle = styles.textBooked;
              statusLabel = 'Already Booked';
            } else if (isSelected) {
              slotStyle = styles.slotSelected;
              textStyle = styles.textSelected;
              statusLabel = 'Selected';
            }

            return (
              <Pressable
                key={slot}
                onPress={() => isAvailable && onToggleSlot(slot)}
                disabled={!isAvailable}
                accessible={true}
                accessibilityRole="checkbox"
                accessibilityState={{
                  checked: isSelected,
                  disabled: !isAvailable,
                }}
                accessibilityLabel={`Time slot ${slot}, status: ${statusLabel}`}
                accessibilityHint={
                  isAvailable
                    ? isSelected
                      ? 'Tap to unselect this time slot'
                      : 'Tap to select this time slot for your booking'
                    : 'This time slot is unavailable due to an existing booking or campus closing hours'
                }
                style={({ pressed }) => [
                  styles.slotBase,
                  slotStyle,
                  pressed && isAvailable && styles.slotPressed,
                ]}
              >
                <View style={styles.slotContent}>
                  <Text style={[styles.slotText, textStyle]}>{slot}</Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={Colors.textInverse}
                      style={styles.checkIcon}
                    />
                  )}
                  {!isAvailable && (
                    <Text style={styles.bookedTag}>
                      {isWithinHours ? 'BOOKED' : 'CLOSED'}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }
);

TimeSlotSelector.displayName = 'TimeSlotSelector';

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
  },
  legendAvailable: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderDark,
  },
  legendSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  legendBooked: {
    backgroundColor: Colors.slotBooked,
    borderColor: Colors.border,
  },
  legendText: {
    ...Typography.bodySmall,
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  slotBase: {
    width: '48%',
    paddingVertical: Spacing.md - 2,
    paddingHorizontal: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    minHeight: 52,
    justifyContent: 'center',
  },
  slotAvailable: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderDark,
  },
  slotSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  slotBooked: {
    backgroundColor: Colors.slotBooked,
    borderColor: Colors.border,
    opacity: 0.8,
  },
  slotClosed: {
    backgroundColor: Colors.surfaceHover,
    borderColor: Colors.border,
    opacity: 0.5,
  },
  slotPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  slotContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotText: {
    ...Typography.body,
    fontWeight: '600',
    fontSize: 13,
  },
  textAvailable: {
    color: Colors.textPrimary,
  },
  textSelected: {
    color: Colors.textInverse,
  },
  textBooked: {
    color: Colors.slotBookedText,
    textDecorationLine: 'line-through',
  },
  checkIcon: {
    marginLeft: 4,
  },
  bookedTag: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.danger,
    backgroundColor: Colors.dangerLight,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
});

