export const APPOINTMENT_STATUS = [
  "PENDING",
  "CONFIRMED",
  "DONE",
  "CANCELLED",
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUS)[number];

export type Appointment = {
  id: number;
  customerName: string;
  phone: string;
  staffId: number;
  appointmentStart: string;
  status: AppointmentStatus;
  comment: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  staff: import("./staff").Staff;
  appointmentServices: AppointmentService[];
};

export type AppointmentService = {
  appointmentId: number;
  serviceId: number;
  service: import("./service").Service;
};

export type CreateBookingPayload = {
  date: string;
  slot: string;
  staffId: number;
  serviceIds: number[];
  customerName: string;
  phone: string;
};

export type UpdateBookingPayload = {
  date?: string;
  slot?: string;
  staffId?: number;
  serviceIds?: number[];
  customerName?: string;
  phone?: string;
};
