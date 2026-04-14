import { adminClient, publicClient } from "./axios";
import type {
  CreateBookingPayload,
  UpdateBookingPayload,
  AppointmentStatus,
} from "@/lib/types";

class BookingApi {
  // ── Public ────────────────────────────────────────────────────────
  createBooking = (data: CreateBookingPayload) =>
    publicClient.post(`/bookings`, data);

  // ── Admin ─────────────────────────────────────────────────────────
  getAllBookings = (params?: { status?: AppointmentStatus }) =>
    adminClient.get(`/admin/bookings`, { params });

  adminCreateBooking = (data: CreateBookingPayload) =>
    adminClient.post(`/admin/bookings`, data);

  updateBooking = (id: number, data: UpdateBookingPayload) =>
    adminClient.patch(`/admin/bookings/${id}`, data);

  updateStatus = (id: number, status: AppointmentStatus) =>
    adminClient.patch(`/admin/bookings/${id}/status`, { status });

  deleteBooking = (id: number) => adminClient.delete(`/admin/bookings/${id}`);
}

const bookingApi = new BookingApi();
export default bookingApi;
