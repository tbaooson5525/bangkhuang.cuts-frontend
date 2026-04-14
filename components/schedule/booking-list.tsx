"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import bookingApi from "@/api/bookingApi";
import type { Appointment, AppointmentStatus } from "@/lib/types";

// ── Config ────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; color: string; bg: string }
> = {
  PENDING: {
    label: "Chờ xác nhận",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
  },
  CONFIRMED: { label: "Đã xác nhận", color: "text-blue-700", bg: "bg-blue-50" },
  DONE: { label: "Hoàn thành", color: "text-green-700", bg: "bg-green-50" },
  CANCELLED: { label: "Đã huỷ", color: "text-red-700", bg: "bg-red-50" },
};

const ALLOWED_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["DONE", "CANCELLED"],
  DONE: ["CANCELLED"],
  CANCELLED: [],
};

const STATUS_FILTERS: { label: string; value?: AppointmentStatus }[] = [
  { label: "Tất cả" },
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Hoàn thành", value: "DONE" },
  { label: "Đã huỷ", value: "CANCELLED" },
];

// ── Status Badge ──────────────────────────────────────────────────
function StatusBadge({ status }: { status: AppointmentStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium",
        cfg.bg,
        cfg.color,
      )}
    >
      {cfg.label}
    </span>
  );
}

// ── Status Dropdown ───────────────────────────────────────────────
function StatusDropdown({
  appointment,
  onUpdate,
  isPending,
}: {
  appointment: Appointment;
  onUpdate: (id: number, status: AppointmentStatus) => void;
  isPending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const transitions = ALLOWED_TRANSITIONS[appointment.status];

  if (transitions.length === 0) {
    return <StatusBadge status={appointment.status} />;
  }

  const handleOpen = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const dropdownHeight = transitions.length * 36 + 8; // approx height
    const spaceBelow = window.innerHeight - rect.bottom;
    const top =
      spaceBelow >= dropdownHeight
        ? rect.bottom + 4
        : rect.top - dropdownHeight - 4;

    setPos({ top, left: rect.left });
    setOpen(true);
  };

  return (
    <div className='relative'>
      <button
        ref={btnRef}
        onClick={handleOpen}
        disabled={isPending}
        className='flex items-center gap-1 focus:outline-none disabled:opacity-50'
      >
        <StatusBadge status={appointment.status} />
        <ChevronDown className='w-3 h-3 text-neutral-400' />
      </button>

      {open && (
        <>
          <div className='fixed inset-0 z-40' onClick={() => setOpen(false)} />
          <div
            className='fixed z-50 bg-white rounded-xl border border-neutral-200 shadow-lg py-1 min-w-36'
            style={{ top: pos.top, left: pos.left }}
          >
            {transitions.map((s) => {
              const cfg = STATUS_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => {
                    onUpdate(appointment.id, s);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs hover:bg-neutral-50 transition-colors",
                    cfg.color,
                  )}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export default function BookingList() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<
    AppointmentStatus | undefined
  >();

  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ["bookings", activeFilter],
    queryFn: () =>
      bookingApi
        .getAllBookings(activeFilter ? { status: activeFilter } : undefined)
        .then((r) => r.data),
  });

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: AppointmentStatus }) =>
      bookingApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const { mutate: deleteBooking } = useMutation({
    mutationFn: (id: number) => bookingApi.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  return (
    <div className='flex flex-col gap-4 mt-6'>
      {/* Header + Filter */}
      <div className='flex items-center justify-between shrink-0'>
        <h2 className='text-base font-semibold text-neutral-900'>
          Danh sách lịch hẹn
        </h2>
        <div className='flex items-center gap-1'>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                activeFilter === f.value
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className='flex justify-center py-10'>
          <div className='w-7 h-7 rounded-full border-2 border-neutral-300 border-t-neutral-800 animate-spin' />
        </div>
      ) : appointments.length === 0 ? (
        <div className='flex items-center justify-center py-16 text-neutral-400 text-sm rounded-2xl border border-neutral-200'>
          Không có lịch hẹn nào
        </div>
      ) : (
        <div className='rounded-2xl border border-neutral-200 overflow-hidden'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='bg-neutral-50 border-b border-neutral-200'>
                <th className='text-left px-5 py-3 font-medium text-neutral-500'>
                  Khách hàng
                </th>
                <th className='text-left px-5 py-3 font-medium text-neutral-500'>
                  Thời gian
                </th>
                <th className='text-left px-5 py-3 font-medium text-neutral-500'>
                  Nhân viên
                </th>
                <th className='text-left px-5 py-3 font-medium text-neutral-500'>
                  Dịch vụ
                </th>
                <th className='text-left px-5 py-3 font-medium text-neutral-500'>
                  Trạng thái
                </th>
                <th className='px-5 py-3' />
              </tr>
            </thead>
            <tbody className='divide-y divide-neutral-100'>
              {appointments.map((apt) => (
                <tr
                  key={apt.id}
                  className='hover:bg-neutral-50/50 transition-colors'
                >
                  {/* Khách hàng */}
                  <td className='px-5 py-3'>
                    <div className='font-medium text-neutral-900'>
                      {apt.customerName}
                    </div>
                    <div className='text-xs text-neutral-400'>{apt.phone}</div>
                  </td>

                  {/* Thời gian */}
                  <td className='px-5 py-3 text-neutral-600'>
                    {format(new Date(apt.appointmentStart), "dd/MM/yyyy HH:mm")}
                  </td>

                  {/* Nhân viên */}
                  <td className='px-5 py-3 text-neutral-600'>
                    {apt.staff.name}
                  </td>

                  {/* Dịch vụ */}
                  <td className='px-5 py-3'>
                    <div className='flex flex-col gap-0.5'>
                      {apt.appointmentServices.map((as) => (
                        <span
                          key={as.serviceId}
                          className='text-xs text-neutral-500'
                        >
                          {as.service.name} —{" "}
                          <span className='text-neutral-700 font-medium'>
                            {as.service.price.toLocaleString("vi-VN")}đ
                          </span>
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className='px-5 py-3'>
                    <StatusDropdown
                      appointment={apt}
                      onUpdate={(id, status) => updateStatus({ id, status })}
                      isPending={isUpdating}
                    />
                  </td>

                  {/* Actions */}
                  <td className='px-5 py-3'>
                    <button
                      onClick={() => deleteBooking(apt.id)}
                      className='p-1.5 rounded-lg text-neutral-300 hover:bg-red-50 hover:text-red-500 transition-colors'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
