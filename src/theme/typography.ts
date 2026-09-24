import { TextStyle } from 'react-native';
import { Colors } from './colors';

export const Typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    color: Colors.textPrimary,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    color: Colors.textPrimary,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  button: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
};

