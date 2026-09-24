import { Platform } from 'react-native';

/**
 * Flag to enable/disable real backend integration.
 * When true: App fetches from the Node.js Express Backend.
 * When false: App uses in-memory mock services.
 */
export const USE_REAL_BACKEND = true;

/**
 * Automatically determine the appropriate Backend URL depending on the platform:
 * - Android Emulator: 10.0.2.2 points to host machine
 * - iOS Simulator / Web: localhost
 * - Physical device (Expo Go): LAN IP 192.168.1.4
 */
const PORT = 5000;
const LAN_IP = '192.168.1.4';

export function getApiBaseUrl(): string {
  if (Platform.OS === 'web') {
    return `http://localhost:${PORT}/api`;
  }

  if (Platform.OS === 'android') {
    // Expo Go on a physical Android device reaches the host through the LAN IP.
    return `http://${LAN_IP}:${PORT}/api`;
  }

  // iOS Simulator / Fallback
  return `http://localhost:${PORT}/api`;
}

export const API_BASE_URL = getApiBaseUrl();

