import type { AppointmentStatus } from "@/lib/types";

export const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; dotColor: string; textColor: string; bgColor: string }
> = {
  PENDING: {
    label: "Chờ xác nhận",
    dotColor: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    dotColor: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  DONE: {
    label: "Hoàn thành",
    dotColor: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
  },
  CANCELLED: {
    label: "Đã huỷ",
    dotColor: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
  },
};

export const ALLOWED_TRANSITIONS: Record<
  AppointmentStatus,
  AppointmentStatus[]
> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["DONE", "CANCELLED"],
  DONE: ["CANCELLED"],
  CANCELLED: [],
};
