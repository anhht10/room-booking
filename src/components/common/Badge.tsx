import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';

export type BadgeVariant =
  | 'available'
  | 'unavailable'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'primary'
  | 'secondary'
  | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = React.memo(({ label, variant = 'neutral' }) => {
  const currentVariant = variantStyles[variant];

  return (
    <View style={[styles.container, currentVariant.container]}>
      <View style={[styles.dot, currentVariant.dot]} />
      <Text style={[styles.text, currentVariant.text]}>{label}</Text>
    </View>
  );
});

Badge.displayName = 'Badge';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'none',
  },
});

const variantStyles = {
  available: StyleSheet.create({
    container: { backgroundColor: Colors.successLight },
    dot: { backgroundColor: Colors.success },
    text: { color: Colors.success },
  }),
  unavailable: StyleSheet.create({
    container: { backgroundColor: Colors.dangerLight },
    dot: { backgroundColor: Colors.danger },
    text: { color: Colors.danger },
  }),
  confirmed: StyleSheet.create({
    container: { backgroundColor: Colors.successLight },
    dot: { backgroundColor: Colors.success },
    text: { color: Colors.success },
  }),
  cancelled: StyleSheet.create({
    container: { backgroundColor: Colors.dangerLight },
    dot: { backgroundColor: Colors.danger },
    text: { color: Colors.danger },
  }),
  completed: StyleSheet.create({
    container: { backgroundColor: Colors.infoLight },
    dot: { backgroundColor: Colors.info },
    text: { color: Colors.info },
  }),
  primary: StyleSheet.create({
    container: { backgroundColor: Colors.primaryLight },
    dot: { backgroundColor: Colors.primary },
    text: { color: Colors.primary },
  }),
  secondary: StyleSheet.create({
    container: { backgroundColor: Colors.secondaryLight },
    dot: { backgroundColor: Colors.secondary },
    text: { color: Colors.secondary },
  }),
  neutral: StyleSheet.create({
    container: { backgroundColor: Colors.surfaceHover },
    dot: { backgroundColor: Colors.textMuted },
    text: { color: Colors.textSecondary },
  }),
};

