import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';

interface LoadingViewProps {
  message?: string;
}

export const LoadingView: React.FC<LoadingViewProps> = React.memo(
  ({ message = 'Loading campus rooms...' }) => {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.text}>{message}</Text>
      </View>
    );
  }
);

LoadingView.displayName = 'LoadingView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  text: {
    ...Typography.subtitle,
    marginTop: Spacing.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

