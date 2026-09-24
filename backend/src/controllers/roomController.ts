import { Request, Response, NextFunction } from 'express';
import { roomService } from '../services/roomService';
import { RoomQueryFilters } from '../types/room';

export const roomController = {
  async getRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: RoomQueryFilters = {
        search: req.query.search as string | undefined,
        type: req.query.type as any,
        minCapacity: req.query.minCapacity ? Number(req.query.minCapacity) : undefined,
        floor: req.query.floor !== undefined ? (req.query.floor === 'ALL' ? 'ALL' : Number(req.query.floor)) : undefined,
        facilities: req.query.facilities as string | undefined,
        availableOnly: req.query.availableOnly === 'true',
      };

      const rooms = await roomService.getRooms(filters);
      res.json(rooms);
    } catch (err) {
      next(err);
    }
  },

  async getRoomById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const room = await roomService.getRoomById(id);
      res.json(room);
    } catch (err) {
      next(err);
    }
  },
};

