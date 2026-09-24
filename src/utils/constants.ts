import { RoomFacility, RoomType } from '../types/room';

export const STANDARD_TIME_SLOTS = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
] as const;

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  STUDY_ROOM: 'Study Room',
  COMPUTER_LAB: 'Computer Lab',
  SCIENCE_LAB: 'Science Lab',
  GROUP_ROOM: 'Group Discussion',
};

export const FACILITY_LABELS: Record<RoomFacility, string> = {
  WIFI: 'High-speed Wi-Fi',
  PROJECTOR: 'HD Projector',
  WHITEBOARD: 'Whiteboard & Markers',
  COMPUTER: 'Desktop Workstations',
  AIR_CONDITIONING: 'Climate Controlled A/C',
  POWER_OUTLET: 'Individual Power Outlets',
};

export const FACILITY_ICONS: Record<RoomFacility, string> = {
  WIFI: 'wifi',
  PROJECTOR: 'videocam-outline',
  WHITEBOARD: 'create-outline',
  COMPUTER: 'desktop-outline',
  AIR_CONDITIONING: 'snow-outline',
  POWER_OUTLET: 'flash-outline',
};

export const CAPACITY_OPTIONS = [
  { label: 'All Seats', value: null },
  { label: '2+ seats', value: 2 },
  { label: '4+ seats', value: 4 },
  { label: '8+ seats', value: 8 },
  { label: '15+ seats', value: 15 },
] as const;

export const FLOOR_OPTIONS = [
  { label: 'All Floors', value: 'ALL' as const },
  { label: 'Floor 1', value: 1 },
  { label: 'Floor 2', value: 2 },
  { label: 'Floor 3', value: 3 },
  { label: 'Floor 4', value: 4 },
] as const;

