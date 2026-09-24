import { RoomType } from './room';

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface TimeSlot {
  id: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:00"
  label: string;     // e.g. "09:00 - 10:00"
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  roomType: RoomType;
  building: string;
  floor: number;
  roomNumber: string;
  userId: string;
  date: string;       // YYYY-MM-DD format
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
  slots: string[];    // Array of slot labels e.g. ["09:00 - 10:00"]
  status: BookingStatus;
  purpose?: string;
  createdAt: string;  // ISO timestamp
}

export interface CreateBookingPayload {
  roomId: string;
  userId: string;
  date: string;
  slots: string[];
  purpose?: string;
}

