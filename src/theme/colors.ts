export const Colors = {
  // Brand colors
  primary: '#1E40AF', // Deep campus navy blue
  primaryLight: '#DBEAFE',
  primaryDark: '#1E3A8A',
  secondary: '#0D9488', // Campus teal
  secondaryLight: '#CCFBF1',
  accent: '#F59E0B', // Amber badge

  // Neutrals & Backgrounds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceHover: '#F1F5F9',
  border: '#E2E8F0',
  borderDark: '#CBD5E1',
  divider: '#F1F5F9',

  // Typography
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Semantic Status
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  info: '#0284C7',
  infoLight: '#E0F2FE',

  // Booking slot states
  slotAvailable: '#FFFFFF',
  slotAvailableBorder: '#93C5FD',
  slotBooked: '#E2E8F0',
  slotBookedText: '#94A3B8',
  slotSelected: '#1E40AF',
  slotSelectedText: '#FFFFFF',

  // Shadows
  shadow: '#000000',
} as const;

export type ColorName = keyof typeof Colors;

