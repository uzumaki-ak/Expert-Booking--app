import { api, unwrap } from "./client";
import type { ApiResponse, Booking, BookingStatus, CreateBookingPayload } from "@/types";

export const createBooking = async (payload: CreateBookingPayload): Promise<Booking> => {
  const res = await api.post<ApiResponse<Booking>>("/bookings", payload);
  return unwrap(res.data);
};

export const updateBookingStatus = async (id: string, status: BookingStatus): Promise<Booking> => {
  const res = await api.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, { status });
  return unwrap(res.data);
};

export const listBookingsByEmail = async (email: string): Promise<Booking[]> => {
  const res = await api.get<ApiResponse<Booking[]>>("/bookings", { params: { email } });
  return res.data.data ?? [];
};
