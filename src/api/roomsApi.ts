import { httpClient } from './httpClient';
import { USE_REAL_BACKEND } from '../config/api';
import { INITIAL_ROOMS } from './mockData';
import { Room, RoomFilters } from '../types/room';
import { ApiError } from '../types/api';

let roomsDatabase: Room[] = [...INITIAL_ROOMS];

export const roomsApi = {
  /**
   * Fetches rooms filtered by search, type, capacity, floor, facilities, and availability
   */
  async getRooms(filters?: RoomFilters): Promise<Room[]> {
    if (USE_REAL_BACKEND) {
      try {
        const queryParams = new URLSearchParams();
        if (filters?.searchQuery) queryParams.append('search', filters.searchQuery);
        if (filters?.roomType && filters.roomType !== 'ALL') queryParams.append('type', filters.roomType);
        if (filters?.minCapacity) queryParams.append('minCapacity', String(filters.minCapacity));
        if (filters?.floor !== undefined && filters.floor !== 'ALL') queryParams.append('floor', String(filters.floor));
        if (filters?.facilities && filters.facilities.length > 0) queryParams.append('facilities', filters.facilities.join(','));
        if (filters?.availableOnly) queryParams.append('availableOnly', 'true');

        const qs = queryParams.toString();
        const endpoint = qs ? `/rooms?${qs}` : '/rooms';
        return await httpClient<Room[]>(endpoint);
      } catch (err) {
        console.warn('[roomsApi] Real backend request failed, falling back to mock:', err);
      }
    }

    // Fallback Mock Logic
    let result = [...roomsDatabase];
    if (!filters) return result;

    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.trim().toLowerCase();
      result = result.filter(
        (room) =>
          room.name.toLowerCase().includes(q) ||
          room.building.toLowerCase().includes(q) ||
          room.roomNumber.toLowerCase().includes(q)
      );
    }
    if (filters.roomType && filters.roomType !== 'ALL') {
      result = result.filter((room) => room.type === filters.roomType);
    }
    if (filters.minCapacity && filters.minCapacity > 0) {
      result = result.filter((room) => room.capacity >= filters.minCapacity!);
    }
    if (filters.floor !== undefined && filters.floor !== 'ALL') {
      result = result.filter((room) => room.floor === filters.floor);
    }
    if (filters.facilities && filters.facilities.length > 0) {
      result = result.filter((room) =>
        filters.facilities!.every((facility) => room.facilities.includes(facility))
      );
    }
    if (filters.availableOnly) {
      result = result.filter((room) => room.available);
    }
    return result;
  },

  /**
   * Fetches a single room by ID
   */
  async getRoomById(id: string): Promise<Room> {
    if (USE_REAL_BACKEND) {
      try {
        return await httpClient<Room>(`/rooms/${id}`);
      } catch (err) {
        console.warn(`[roomsApi] Real backend fetch failed for room ${id}, falling back:`, err);
      }
    }

    const found = roomsDatabase.find((r) => r.id === id);
    if (!found) {
      throw new ApiError(`Room with ID "${id}" was not found`, 404);
    }
    return { ...found };
  },
};
