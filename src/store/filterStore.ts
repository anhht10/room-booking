import { create } from 'zustand';
import { RoomFacility, RoomType } from '../types/room';

export interface FilterState {
  searchQuery: string;
  roomType: RoomType | 'ALL';
  minCapacity: number | null;
  floor: number | 'ALL';
  facilities: RoomFacility[];
  availableOnly: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setRoomType: (type: RoomType | 'ALL') => void;
  setMinCapacity: (capacity: number | null) => void;
  setFloor: (floor: number | 'ALL') => void;
  toggleFacility: (facility: RoomFacility) => void;
  toggleAvailableOnly: () => void;
  clearFilters: () => void;
}

const initialFilters = {
  searchQuery: '',
  roomType: 'ALL' as const,
  minCapacity: null,
  floor: 'ALL' as const,
  facilities: [] as RoomFacility[],
  availableOnly: false,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialFilters,

  setSearchQuery: (query) => set({ searchQuery: query }),

  setRoomType: (type) => set({ roomType: type }),

  setMinCapacity: (capacity) => set({ minCapacity: capacity }),

  setFloor: (floor) => set({ floor: floor }),

  toggleFacility: (facility) =>
    set((state) => {
      const exists = state.facilities.includes(facility);
      return {
        facilities: exists
          ? state.facilities.filter((f) => f !== facility)
          : [...state.facilities, facility],
      };
    }),

  toggleAvailableOnly: () =>
    set((state) => ({ availableOnly: !state.availableOnly })),

  clearFilters: () => set(initialFilters),
}));

