import { RoomType } from './room';

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  roomType: RoomType;
  building: string;
  floor: number;
  roomNumber: string;
  userId: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
  slots: string[];    // Array of slot labels e.g. ["09:00 - 10:00"]
  status: BookingStatus;
  purpose?: string;
  createdAt: string;  // ISO timestamp
}

export interface CreateBookingDTO {
  roomId: string;
  userId: string;
  date: string;
  slots: string[];
  purpose?: string;
}

