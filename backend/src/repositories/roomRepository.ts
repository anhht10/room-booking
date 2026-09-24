import { db } from '../database/db';
import { Room, RoomFacility, RoomQueryFilters } from '../types/room';

export const roomRepository = {
  async findAll(filters?: RoomQueryFilters): Promise<Room[]> {
    let rooms = [...db.getRooms()];

    if (!filters) return rooms;

    // 1. Search Query (name, building, roomNumber)
    if (filters.search && filters.search.trim().length > 0) {
      const q = filters.search.trim().toLowerCase();
      rooms = rooms.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.building.toLowerCase().includes(q) ||
          r.roomNumber.toLowerCase().includes(q)
      );
    }

    // 2. Room Type filter
    if (filters.type && filters.type !== 'ALL') {
      rooms = rooms.filter((r) => r.type === filters.type);
    }

    // 3. Minimum Capacity filter
    if (filters.minCapacity && filters.minCapacity > 0) {
      rooms = rooms.filter((r) => r.capacity >= Number(filters.minCapacity));
    }

    // 4. Floor filter
    if (filters.floor !== undefined && filters.floor !== 'ALL') {
      rooms = rooms.filter((r) => r.floor === Number(filters.floor));
    }

    // 5. Facilities multi-select filter (comma-separated string e.g. "WIFI,PROJECTOR")
    if (filters.facilities) {
      const requestedFacilities = filters.facilities
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean) as RoomFacility[];

      if (requestedFacilities.length > 0) {
        rooms = rooms.filter((r) =>
          requestedFacilities.every((facility) => r.facilities.includes(facility))
        );
      }
    }

    // 6. Availability filter
    if (filters.availableOnly) {
      rooms = rooms.filter((r) => r.available);
    }

    return rooms;
  },

  async findById(id: string): Promise<Room | null> {
    const rooms = db.getRooms();
    const found = rooms.find((r) => r.id === id);
    return found ? { ...found } : null;
  },
};

