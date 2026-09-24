import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '../../theme/colors';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  count?: number;
  icon?: React.ReactNode;
}

export const FilterChip: React.FC<FilterChipProps> = React.memo(
  ({ label, selected, onPress, count, icon }) => {
    return (
      <Pressable
        onPress={onPress}
        accessible={true}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected }}
        accessibilityLabel={`${label} filter, ${selected ? 'selected' : 'not selected'}`}
        style={({ pressed }) => [
          styles.chip,
          selected ? styles.selectedChip : styles.unselectedChip,
          pressed && styles.pressedChip,
        ]}
      >
        {icon}
        <Text
          style={[
            styles.label,
            selected ? styles.selectedLabel : styles.unselectedLabel,
            icon ? styles.labelWithIcon : undefined,
          ]}
        >
          {label}
        </Text>
        {count !== undefined && (
          <Text
            style={[
              styles.count,
              selected ? styles.selectedCount : styles.unselectedCount,
            ]}
          >
            {count}
          </Text>
        )}
      </Pressable>
    );
  }
);

FilterChip.displayName = 'FilterChip';

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  unselectedChip: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pressedChip: {
    opacity: 0.8,
  },
  label: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },
  labelWithIcon: {
    marginLeft: 4,
  },
  unselectedLabel: {
    color: Colors.textSecondary,
  },
  selectedLabel: {
    color: Colors.textInverse,
  },
  count: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
  },
  unselectedCount: {
    backgroundColor: Colors.surfaceHover,
    color: Colors.textSecondary,
  },
  selectedCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    color: Colors.textInverse,
  },
});

