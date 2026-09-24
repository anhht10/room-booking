import { useQuery } from '@tanstack/react-query';
import { roomsApi } from '../api/roomsApi';
import { RoomFilters } from '../types/room';

export const ROOMS_QUERY_KEY = 'rooms';

export function useRooms(filters?: RoomFilters) {
  return useQuery({
    queryKey: [ROOMS_QUERY_KEY, filters],
    queryFn: () => roomsApi.getRooms(filters),
  });
}

