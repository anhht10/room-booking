import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo(
  ({
    icon = 'search-outline',
    title,
    description,
    actionLabel,
    onAction,
  }) => {
    return (
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={36} color={Colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {actionLabel && onAction && (
          <Button
            title={actionLabel}
            onPress={onAction}
            variant="outline"
            size="sm"
            style={styles.button}
          />
        )}
      </View>
    );
  }
);

EmptyState.displayName = 'EmptyState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
    minHeight: 280,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  button: {
    marginTop: Spacing.lg,
  },
});

