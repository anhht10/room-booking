import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Room } from '../../types/room';
import { Colors } from '../../theme/colors';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';
import { Badge } from '../common/Badge';
import { ROOM_TYPE_LABELS, FACILITY_ICONS } from '../../utils/constants';

interface RoomCardProps {
  room: Room;
  onPress: (roomId: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = React.memo(({ room, onPress }) => {
  const handlePress = () => onPress(room.id);

  return (
    <Pressable
      onPress={handlePress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${room.name}, ${ROOM_TYPE_LABELS[room.type]}, Capacity: ${room.capacity} people, ${room.available ? 'Available' : 'Unavailable'}`}
      accessibilityHint="Tap to view room details and reserve time slots"
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {/* Room Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: room.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.badgeOverlay}>
          <Badge
            label={room.available ? 'Available' : 'Unavailable'}
            variant={room.available ? 'available' : 'unavailable'}
          />
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleColumn}>
            <Text style={styles.typeText}>{ROOM_TYPE_LABELS[room.type]}</Text>
            <Text style={styles.nameText} numberOfLines={1}>
              {room.name}
            </Text>
          </View>
        </View>

        {/* Location & Capacity */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="business-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {room.building} • Floor {room.floor} ({room.roomNumber})
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>Max Capacity: {room.capacity} seats</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>
              {room.openingTime} - {room.closingTime}
            </Text>
          </View>
        </View>

        {/* Facilities Preview */}
        <View style={styles.facilitiesRow}>
          {room.facilities.slice(0, 4).map((facility) => (
            <View key={facility} style={styles.facilityPill}>
              <Ionicons
                name={(FACILITY_ICONS[facility] as any) || 'checkmark-outline'}
                size={12}
                color={Colors.primary}
              />
              <Text style={styles.facilityText}>
                {facility.replace('_', ' ').toLowerCase()}
              </Text>
            </View>
          ))}
          {room.facilities.length > 4 && (
            <View style={styles.facilityPill}>
              <Text style={styles.facilityText}>+{room.facilities.length - 4}</Text>
            </View>
          )}
        </View>

        {/* Footer Action */}
        <View style={styles.footer}>
          <Text style={styles.viewDetailsText}>View details & reserve</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
        </View>
      </View>
    </Pressable>
  );
});

RoomCard.displayName = 'RoomCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  imageContainer: {
    height: 140,
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
    top: Spacing.sm,
    right: Spacing.sm,
  },
  content: {
    padding: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  titleColumn: {
    flex: 1,
  },
  typeText: {
    ...Typography.caption,
    color: Colors.secondary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  nameText: {
    ...Typography.h3,
    fontSize: 17,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...Typography.bodySmall,
  },
  facilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  facilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  facilityText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: Spacing.md,
    gap: 4,
  },
  viewDetailsText: {
    ...Typography.button,
    fontSize: 13,
    color: Colors.primary,
  },
});

