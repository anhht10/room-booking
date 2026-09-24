import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookingsApi';

export const BOOKINGS_QUERY_KEY = 'bookings';
export const ROOM_BOOKINGS_QUERY_KEY = 'roomBookings';

export function useBookings(userId?: string) {
  return useQuery({
    queryKey: [BOOKINGS_QUERY_KEY, userId],
    queryFn: () => bookingsApi.getBookings(userId),
  });
}

export function useRoomBookings(roomId: string) {
  return useQuery({
    queryKey: [ROOM_BOOKINGS_QUERY_KEY, roomId],
    queryFn: () => bookingsApi.getBookingsByRoom(roomId),
    enabled: !!roomId,
  });
}

