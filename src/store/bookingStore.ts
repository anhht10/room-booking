import { create } from 'zustand';
import { formatDateToISO } from '../utils/date';

interface BookingDraftState {
  selectedRoomId: string | null;
  selectedDate: string;
  selectedSlots: string[];
  purpose: string;

  setSelectedRoomId: (roomId: string | null) => void;
  setSelectedDate: (date: string) => void;
  toggleSlot: (slot: string) => void;
  setPurpose: (purpose: string) => void;
  clearBookingDraft: () => void;
}

export const useBookingStore = create<BookingDraftState>((set) => ({
  selectedRoomId: null,
  selectedDate: formatDateToISO(new Date()),
  selectedSlots: [],
  purpose: '',

  setSelectedRoomId: (roomId) => set({ selectedRoomId: roomId }),

  setSelectedDate: (date) =>
    set((state) => {
      // If date changes, clear selected slots because slots belong to specific dates
      if (state.selectedDate !== date) {
        return { selectedDate: date, selectedSlots: [] };
      }
      return { selectedDate: date };
    }),

  toggleSlot: (slot) =>
    set((state) => {
      const exists = state.selectedSlots.includes(slot);
      return {
        selectedSlots: exists
          ? state.selectedSlots.filter((s) => s !== slot)
          : [...state.selectedSlots, slot],
      };
    }),

  setPurpose: (purpose) => set({ purpose }),

  clearBookingDraft: () =>
    set({
      selectedRoomId: null,
      selectedDate: formatDateToISO(new Date()),
      selectedSlots: [],
      purpose: '',
    }),
}));

