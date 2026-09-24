export interface DayOption {
  dateString: string; // YYYY-MM-DD
  dayLabel: string;   // "Today", "Tomorrow", "Fri", "Sat", etc.
  dayNumber: string;  // "24", "25", etc.
  monthLabel: string; // "Sep", "Oct", etc.
  fullLabel: string;  // "Today, Sep 24"
}

/**
 * Format a Date object to YYYY-MM-DD
 */
export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generate upcoming 7 days starting from today for date picker tabs
 */
export function getUpcomingDays(count: number = 7): DayOption[] {
  const days: DayOption[] = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const dateString = formatDateToISO(d);
    const dayNumber = String(d.getDate());
    const monthLabel = monthNames[d.getMonth()];
    let dayLabel: string;

    if (i === 0) {
      dayLabel = 'Today';
    } else if (i === 1) {
      dayLabel = 'Tomorrow';
    } else {
      dayLabel = dayNames[d.getDay()];
    }

    days.push({
      dateString,
      dayLabel,
      dayNumber,
      monthLabel,
      fullLabel: i === 0 ? `Today (${monthLabel} ${dayNumber})` : `${dayLabel}, ${monthLabel} ${dayNumber}`,
    });
  }

  return days;
}

/**
 * Format YYYY-MM-DD to friendly human readable date, e.g. "September 24, 2026"
 */
export function formatFriendlyDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const fullMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return `${fullMonths[monthIndex]} ${day}, ${year}`;
}

/**
 * Converts "HH:mm" time string into total minutes from start of day
 * e.g., "08:30" => 510
 */
export function timeStringToMinutes(timeStr: string): number {
  const trimmed = timeStr.trim();
  const [hoursStr, minutesStr] = trimmed.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr || '0', 10);
  return hours * 60 + minutes;
}

/**
 * Parses a slot string like "09:00 - 10:00" into start and end minutes
 */
export function parseSlotInterval(slot: string): { startMinutes: number; endMinutes: number } {
  const [start, end] = slot.split('-').map((s) => s.trim());
  return {
    startMinutes: timeStringToMinutes(start),
    endMinutes: timeStringToMinutes(end),
  };
}

