import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookingsApi';
import { BOOKINGS_QUERY_KEY, ROOM_BOOKINGS_QUERY_KEY } from './useBookings';
import { ROOMS_QUERY_KEY } from './useRooms';

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => bookingsApi.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ROOM_BOOKINGS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ROOMS_QUERY_KEY] });
    },
  });
}

