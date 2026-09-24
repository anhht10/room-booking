import { parseSlotInterval } from './date';

/**
 * Standard interval overlap algorithm:
 * Math.max(startA, startB) < Math.min(endA, endB)
 */
export function intervalsOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return Math.max(startA, startB) < Math.min(endA, endB);
}

export function sortTimeSlots(slots: string[]): string[] {
  return [...slots].sort((a, b) => {
    const aMin = parseSlotInterval(a).startMinutes;
    const bMin = parseSlotInterval(b).startMinutes;
    return aMin - bMin;
  });
}

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

  return {
    startTime: `${startHours}:${startMins}`,
    endTime: `${endHours}:${endMins}`,
    durationHours: sorted.length,
  };
}

