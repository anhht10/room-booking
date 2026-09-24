import { Booking } from '../types/booking';
import { parseSlotInterval, timeStringToMinutes } from './date';

/**
 * Checks if two half-open time intervals [startA, endA) and [startB, endB) overlap.
 * 
 * Standard Interval Overlap Formula:
 * Math.max(startA, startB) < Math.min(endA, endB)
 * 
 * Example 1:
 * Existing: 10:00 - 12:00 (600 to 720)
 * Attempt:  11:00 - 13:00 (660 to 780)
 * max(600, 660) = 660, min(720, 780) = 720
 * 660 < 720 => TRUE -> CONFLICT!
 * 
 * Example 2:
 * Existing: 10:00 - 12:00 (600 to 720)
 * Attempt:  12:00 - 13:00 (720 to 780)
 * max(600, 720) = 720, min(720, 780) = 720
 * 720 < 720 => FALSE -> AVAILABLE (back-to-back booking is valid)
 */
export function intervalsOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return Math.max(startA, startB) < Math.min(endA, endB);
}

/**
 * Checks if a specific time slot string (e.g. "09:00 - 10:00") is available
 * for a given room and date among active bookings.
 */
export function isTimeSlotAvailable(
  roomId: string,
  date: string,
  slotString: string,
  existingBookings: Booking[]
): boolean {
  const target = parseSlotInterval(slotString);

  for (const booking of existingBookings) {
    // Only check bookings for the same room, same date, and active status
    if (booking.roomId !== roomId || booking.date !== date || booking.status !== 'CONFIRMED') {
      continue;
    }

    // Check each slot in the existing booking or overall booking range
    const bookingStart = timeStringToMinutes(booking.startTime);
    const bookingEnd = timeStringToMinutes(booking.endTime);

    if (intervalsOverlap(target.startMinutes, target.endMinutes, bookingStart, bookingEnd)) {
      return false; // Conflicting slot found
    }
  }

  return true;
}

/**
 * Validates a proposed booking payload against all existing bookings.
 * Returns true if a conflict exists, false if completely safe.
 */
export function hasBookingConflict(
  proposed: { roomId: string; date: string; slots: string[] },
  existingBookings: Booking[]
): boolean {
  if (!proposed.slots || proposed.slots.length === 0) {
    return false;
  }

  for (const slot of proposed.slots) {
    const isAvailable = isTimeSlotAvailable(
      proposed.roomId,
      proposed.date,
      slot,
      existingBookings
    );
    if (!isAvailable) {
      return true; // Conflict detected!
    }
  }

  return false;
}

/**
 * Sorts array of slot strings chronologically (e.g. "09:00 - 10:00" before "10:00 - 11:00")
 */
export function sortTimeSlots(slots: string[]): string[] {
  return [...slots].sort((a, b) => {
    const aMin = parseSlotInterval(a).startMinutes;
    const bMin = parseSlotInterval(b).startMinutes;
    return aMin - bMin;
  });
}

/**
 * Computes contiguous or grouped time range from selected slots
 * e.g., ["09:00 - 10:00", "10:00 - 11:00"] => { startTime: "09:00", endTime: "11:00", durationHours: 2 }
 */
export function getOverallTimeRange(slots: string[]): {
  startTime: string;
  endTime: string;
  durationHours: number;
} {
  if (slots.length === 0) {
    return { startTime: '', endTime: '', durationHours: 0 };
  }

  const sorted = sortTimeSlots(slots);
  const first = parseSlotInterval(sorted[0]);
  const last = parseSlotInterval(sorted[sorted.length - 1]);

  const startHours = String(Math.floor(first.startMinutes / 60)).padStart(2, '0');
  const startMins = String(first.startMinutes % 60).padStart(2, '0');
  const endHours = String(Math.floor(last.endMinutes / 60)).padStart(2, '0');
  const endMins = String(last.endMinutes % 60).padStart(2, '0');

  const durationHours = sorted.length; // Each standard slot is 1 hour

  return {
    startTime: `${startHours}:${startMins}`,
    endTime: `${endHours}:${endMins}`,
    durationHours,
  };
}

