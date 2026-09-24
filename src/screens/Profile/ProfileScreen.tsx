import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';
import { useBookings } from '../../hooks/useBookings';
import { Colors } from '../../theme/colors';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';

export const ProfileScreen: React.FC = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const { data: bookings = [] } = useBookings(currentUser.id);

  const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: currentUser.avatarUrl }} style={styles.avatar} />
          <View style={styles.profileText}>
            <Text style={styles.name}>{currentUser.name}</Text>
            <Text style={styles.studentId}>{currentUser.studentId}</Text>
            <Text style={styles.department}>{currentUser.department}</Text>
            <Text style={styles.email}>{currentUser.email}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{confirmedCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{bookings.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Campus Facilities Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Campus Directory & Hours</Text>

          <View style={styles.menuItem}>
            <Ionicons name="business-outline" size={20} color={Colors.primary} />
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Engineering Block A</Text>
              <Text style={styles.menuSubtitle}>Workstations & Hardware Labs (08:00 - 18:00)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.menuItem}>
            <Ionicons name="flask-outline" size={20} color={Colors.secondary} />
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Science Center B</Text>
              <Text style={styles.menuSubtitle}>Chemistry & Physics Research (08:00 - 17:00)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.menuItem}>
            <Ionicons name="book-outline" size={20} color={Colors.accent} />
            <View style={styles.menuTextCol}>
              <Text style={styles.menuTitle}>Main Library & Quiet Hub</Text>
              <Text style={styles.menuSubtitle}>Individual & Group Pods (08:00 - 20:00)</Text>
            </View>
          </View>
        </View>

        {/* Booking Guidelines & Honor Code */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Policies & Guidelines</Text>
          <View style={styles.policyRow}>
            <Ionicons name="shield-checkmark-outline" size={18} color={Colors.success} />
            <Text style={styles.policyText}>
              Maximum reservation duration is 4 hours per student per day to ensure equitable access.
            </Text>
          </View>
          <View style={styles.policyRow}>
            <Ionicons name="time-outline" size={18} color={Colors.info} />
            <Text style={styles.policyText}>
              Cancellations should be made at least 15 minutes in advance to release the slot.
            </Text>
          </View>
        </View>

        <Text style={styles.versionText}>Campus Booking v1.0.0 • Mini-Project 2</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  profileText: {
    flex: 1,
  },
  name: {
    ...Typography.h2,
    fontSize: 18,
  },
  studentId: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  department: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  email: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.primary,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.divider,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    ...Typography.body,
    fontWeight: '600',
  },
  menuSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.sm,
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  policyText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  versionText: {
    ...Typography.caption,
    textAlign: 'center',
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
});

