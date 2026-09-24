import { useQuery } from '@tanstack/react-query';
import { roomsApi } from '../api/roomsApi';

export const ROOM_DETAIL_QUERY_KEY = 'room';

export function useRoom(roomId: string) {
  return useQuery({
    queryKey: [ROOM_DETAIL_QUERY_KEY, roomId],
    queryFn: () => roomsApi.getRoomById(roomId),
    enabled: !!roomId,
  });
}

