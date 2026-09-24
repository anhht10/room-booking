import { roomRepository } from '../repositories/roomRepository';
import { Room, RoomQueryFilters } from '../types/room';
import { NotFoundError } from '../types/api';

export const roomService = {
  async getRooms(filters?: RoomQueryFilters): Promise<Room[]> {
    return roomRepository.findAll(filters);
  },

  async getRoomById(id: string): Promise<Room> {
    const room = await roomRepository.findById(id);
    if (!room) {
      throw new NotFoundError(`Room with ID "${id}" was not found`);
    }
    return room;
  },
};

