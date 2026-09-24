import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BookingStackParamList, RootNavigationProp } from '../../navigation/types';
import { useBookings } from '../../hooks/useBookings';
import { Button } from '../../components/common/Button';
import { LoadingView } from '../../components/common/LoadingView';
import { Colors } from '../../theme/colors';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';
import { formatFriendlyDate } from '../../utils/date';

type ConfirmationRouteProp = RouteProp<BookingStackParamList, 'BookingConfirmationScreen'>;

export const BookingConfirmationScreen: React.FC = () => {
  const route = useRoute<ConfirmationRouteProp>();
  const navigation = useNavigation<RootNavigationProp>();
  const { bookingId } = route.params;

  const { data: bookings = [], isLoading } = useBookings();
  const booking = bookings.find((b) => b.id === bookingId);

  if (isLoading) {
    return <LoadingView message="Finalizing reservation details..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Animated-like Success Icon Ring */}
        <View style={styles.successIconCircle}>
          <Ionicons name="checkmark-sharp" size={48} color={Colors.textInverse} />
        </View>

        <Text style={styles.title}>Booking Successful!</Text>
        <Text style={styles.subtitle}>
          Your campus study space reservation has been confirmed and scheduled.
        </Text>

        {/* Confirmation Details Card */}
        {booking && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderLabel}>BOOKING REFERENCE</Text>
              <Text style={styles.bookingId}>{booking.id}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Ionicons name="business-outline" size={18} color={Colors.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Room & Space</Text>
                <Text style={styles.detailValue}>{booking.roomName}</Text>
                <Text style={styles.detailSub}>
                  {booking.building} • Floor {booking.floor} ({booking.roomNumber})
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{formatFriendlyDate(booking.date)}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color={Colors.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Reserved Time Slot</Text>
                <Text style={styles.detailValue}>
                  {booking.startTime} - {booking.endTime} ({booking.slots.length} hr)
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.instructionsBox}>
          <Ionicons name="bulb-outline" size={18} color={Colors.accent} />
          <Text style={styles.instructionsText}>
            Please show your student ID card or this digital confirmation pass when checking in with building proctors.
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <Button
          title="View My Bookings"
          onPress={() => {
            navigation.navigate('MainTabs', {
              screen: 'MyBookingsTab',
              params: {
                screen: 'MyBookingsScreen',
              },
            });
          }}
          size="lg"
          style={styles.primaryBtn}
        />

        <Button
          title="Back to Home"
          onPress={() => {
            navigation.navigate('MainTabs', {
              screen: 'HomeTab',
              params: {
                screen: 'HomeScreen',
              },
            });
          }}
          variant="outline"
          size="lg"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    ...Typography.h1,
    fontSize: 24,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 290,
    marginBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    width: '100%',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  bookingId: {
    ...Typography.h3,
    fontSize: 18,
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    ...Typography.caption,
    fontSize: 10,
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
    marginTop: 1,
  },
  instructionsBox: {
    flexDirection: 'row',
    backgroundColor: Colors.warningLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    alignItems: 'flex-start',
    width: '100%',
  },
  instructionsText: {
    ...Typography.bodySmall,
    color: Colors.warning,
    flex: 1,
    lineHeight: 18,
  },
  buttonGroup: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  primaryBtn: {
    marginBottom: Spacing.xs,
  },
});

