import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookingsApi';
import { CreateBookingPayload } from '../types/booking';
import { BOOKINGS_QUERY_KEY, ROOM_BOOKINGS_QUERY_KEY } from './useBookings';
import { ROOMS_QUERY_KEY } from './useRooms';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookingsApi.createBooking(payload),
    onSuccess: (_, variables) => {
      // Invalidate bookings lists so UI displays updated records
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ROOM_BOOKINGS_QUERY_KEY, variables.roomId] });
      queryClient.invalidateQueries({ queryKey: [ROOMS_QUERY_KEY] });
    },
  });
}

