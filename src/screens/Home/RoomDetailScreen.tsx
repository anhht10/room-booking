import React, { useCallback } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { HomeStackParamList, RootNavigationProp } from '../../navigation/types';
import { useRoom } from '../../hooks/useRoom';
import { useBookingStore } from '../../store/bookingStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingView } from '../../components/common/LoadingView';
import { EmptyState } from '../../components/common/EmptyState';
import { Colors } from '../../theme/colors';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';
import {
  FACILITY_ICONS,
  FACILITY_LABELS,
  ROOM_TYPE_LABELS,
} from '../../utils/constants';

type RoomDetailRouteProp = RouteProp<HomeStackParamList, 'RoomDetailScreen'>;

export const RoomDetailScreen: React.FC = () => {
  const route = useRoute<RoomDetailRouteProp>();
  const navigation = useNavigation<RootNavigationProp>();
  const { roomId } = route.params;

  const { data: room, isLoading, isError } = useRoom(roomId);
  const setSelectedRoomId = useBookingStore((state) => state.setSelectedRoomId);

  const handleBookNow = useCallback(() => {
    if (!room) return;
    setSelectedRoomId(room.id);
    navigation.navigate('BookingFlow', {
      screen: 'BookingScreen',
      params: { roomId: room.id },
    });
  }, [navigation, room, setSelectedRoomId]);

  if (isLoading) {
    return <LoadingView message="Loading room details..." />;
  }

  if (isError || !room) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Room Not Found"
        description="We couldn't retrieve the specifications for this space."
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
        {/* Banner Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: room.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.badgeOverlay}>
            <Badge
              label={room.available ? 'Available for booking' : 'Currently Unavailable'}
              variant={room.available ? 'available' : 'unavailable'}
            />
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.content}>
          <Text style={styles.typeLabel}>{ROOM_TYPE_LABELS[room.type]}</Text>
          <Text style={styles.title}>{room.name}</Text>

          {/* Quick Stats Grid */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Ionicons name="business-outline" size={20} color={Colors.primary} />
              <Text style={styles.statValue}>{room.building}</Text>
              <Text style={styles.statLabel}>Floor {room.floor} • Room {room.roomNumber}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={20} color={Colors.secondary} />
              <Text style={styles.statValue}>{room.capacity} Persons</Text>
              <Text style={styles.statLabel}>Max Capacity</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color={Colors.accent} />
              <Text style={styles.statValue}>
                {room.openingTime} - {room.closingTime}
              </Text>
              <Text style={styles.statLabel}>Daily Hours</Text>
            </View>
          </View>

          {/* Room Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this space</Text>
            <Text style={styles.description}>{room.description}</Text>
          </View>

          {/* Facilities & Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Facilities & Amenities</Text>
            <View style={styles.facilitiesGrid}>
              {room.facilities.map((facility) => (
                <View key={facility} style={styles.facilityCard}>
                  <View style={styles.facilityIconCircle}>
                    <Ionicons
                      name={(FACILITY_ICONS[facility] as any) || 'checkmark-outline'}
                      size={18}
                      color={Colors.primary}
                    />
                  </View>
                  <Text style={styles.facilityName}>{FACILITY_LABELS[facility]}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Campus Booking Guidelines */}
          <View style={styles.guidelinesBox}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.info} />
            <Text style={styles.guidelinesText}>
              Student reservations are subject to campus honor code policies. Please ensure workstations and whiteboards are left clean for subsequent study groups.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Booking CTA Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarInfo}>
          <Text style={styles.bottomBarLabel}>Ready to reserve?</Text>
          <Text style={styles.bottomBarStatus}>
            {room.available ? 'Instant confirmation' : 'Limited availability'}
          </Text>
        </View>
        <Button
          title="Book this room"
          onPress={handleBookNow}
          size="lg"
          style={styles.bookButton}
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
    paddingBottom: 110,
  },
  imageContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
    backgroundColor: Colors.surfaceHover,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
  },
  content: {
    padding: Spacing.lg,
  },
  typeLabel: {
    ...Typography.caption,
    color: Colors.secondary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  title: {
    ...Typography.h1,
    fontSize: 24,
    marginBottom: Spacing.md,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.divider,
    alignSelf: 'center',
  },
  statValue: {
    ...Typography.body,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  facilitiesGrid: {
    gap: Spacing.sm,
  },
  facilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  facilityIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  facilityName: {
    ...Typography.body,
    fontWeight: '500',
  },
  guidelinesBox: {
    flexDirection: 'row',
    backgroundColor: Colors.infoLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  guidelinesText: {
    ...Typography.bodySmall,
    color: Colors.info,
    flex: 1,
    lineHeight: 18,
  },
  bottomBar: {
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
    elevation: 10,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  bottomBarInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  bottomBarLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  bottomBarStatus: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.success,
  },
  bookButton: {
    minWidth: 160,
  },
});

