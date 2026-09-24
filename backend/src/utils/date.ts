export function timeStringToMinutes(timeStr: string): number {
  const trimmed = timeStr.trim();
  const [hoursStr, minutesStr] = trimmed.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr || '0', 10);
  return hours * 60 + minutes;
}

export function parseSlotInterval(slot: string): { startMinutes: number; endMinutes: number } {
  const [start, end] = slot.split('-').map((s) => s.trim());
  return {
    startMinutes: timeStringToMinutes(start),
    endMinutes: timeStringToMinutes(end),
  };
}

