import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = React.memo(
  ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    style,
    textStyle,
    accessibilityLabel,
    accessibilityHint,
    icon,
  }) => {
    const isInteractive = !disabled && !loading;

    return (
      <Pressable
        onPress={onPress}
        disabled={!isInteractive}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: !isInteractive, busy: loading }}
        style={({ pressed }) => [
          styles.base,
          sizeStyles[size],
          variantStyles[variant].container,
          pressed && isInteractive && styles.pressed,
          disabled && styles.disabledContainer,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variantStyles[variant].text.color || Colors.textInverse}
          />
        ) : (
          <>
            {icon}
            <Text
              style={[
                styles.text,
                sizeTextStyles[size],
                variantStyles[variant].text,
                disabled && styles.disabledText,
                icon ? styles.textWithIcon : undefined,
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  disabledContainer: {
    backgroundColor: Colors.border,
    borderColor: Colors.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledText: {
    color: Colors.textMuted,
  },
  text: {
    ...Typography.button,
    textAlign: 'center',
  },
  textWithIcon: {
    marginLeft: Spacing.sm,
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    minHeight: 34,
  },
  md: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    minHeight: 46,
  },
  lg: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    minHeight: 52,
  },
});

const sizeTextStyles = StyleSheet.create({
  sm: {
    fontSize: 13,
  },
  md: {
    fontSize: 15,
  },
  lg: {
    fontSize: 16,
    fontWeight: '700',
  },
});

const variantStyles = {
  primary: StyleSheet.create({
    container: {
      backgroundColor: Colors.primary,
    },
    text: {
      color: Colors.textInverse,
    },
  }),
  secondary: StyleSheet.create({
    container: {
      backgroundColor: Colors.secondary,
    },
    text: {
      color: Colors.textInverse,
    },
  }),
  outline: StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: Colors.primary,
    },
    text: {
      color: Colors.primary,
    },
  }),
  danger: StyleSheet.create({
    container: {
      backgroundColor: Colors.danger,
    },
    text: {
      color: Colors.textInverse,
    },
  }),
  ghost: StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
    },
    text: {
      color: Colors.primary,
    },
  }),
};

