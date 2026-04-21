// components/schedule/BookingList.tsx
"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import bookingApi from "@/api/bookingApi";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import {
  ALLOWED_TRANSITIONS,
  STATUS_CONFIG,
} from "@/lib/constants/appointment";

const STATUS_FILTERS: { label: string; value?: AppointmentStatus }[] = [
  { label: "Tất cả" },
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Hoàn thành", value: "DONE" },
  { label: "Đã huỷ", value: "CANCELLED" },
];

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium",
        cfg.bgColor,
        cfg.textColor,
      )}
    >
      {cfg.label}
    </span>
  );
}

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
    const dropdownHeight = transitions.length * 36 + 8;
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
        <ChevronDown className='w-3 h-3 text-neutral-400 dark:text-white/30' />
      </button>

      {open && (
        <>
          <div className='fixed inset-0 z-40' onClick={() => setOpen(false)} />
          <div
            className='fixed z-50 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-white/[0.08] shadow-lg py-1 min-w-36'
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
                    "w-full text-left px-3 py-2 text-xs hover:bg-neutral-50 dark:hover:bg-white/[0.06] transition-colors dark:text-white/80",
                    cfg.dotColor,
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
      toast.success("Đã cập nhật trạng thái lịch hẹn.");
    },
    onError: () => {
      toast.error("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    },
  });

  const { mutate: deleteBooking } = useMutation({
    mutationFn: (id: number) => bookingApi.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Đã xoá lịch hẹn.");
    },
    onError: () => {
      toast.error("Không thể xoá lịch hẹn. Vui lòng thử lại.");
    },
  });

  return (
    <div className='flex flex-col gap-4 mt-6'>
      {/* Header + Filter */}
      <div className='flex items-center justify-between shrink-0'>
        <h2 className='text-base font-semibold text-neutral-900 dark:text-white'>
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
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                  : "bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-white/50 hover:bg-neutral-200 dark:hover:bg-white/[0.10]",
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
          <div className='w-7 h-7 rounded-full border-2 border-neutral-300 dark:border-white/20 border-t-neutral-800 dark:border-t-white animate-spin' />
        </div>
      ) : appointments.length === 0 ? (
        <div className='flex items-center justify-center py-16 text-neutral-400 dark:text-white/30 text-sm rounded-2xl border border-neutral-200 dark:border-white/[0.08]'>
          Không có lịch hẹn nào
        </div>
      ) : (
        <div className='rounded-2xl border border-neutral-200 dark:border-white/[0.08] overflow-hidden'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='bg-neutral-50 dark:bg-white/[0.03] border-b border-neutral-200 dark:border-white/[0.08]'>
                <th className='text-left px-5 py-3 font-medium text-neutral-500 dark:text-white/40'>
                  Khách hàng
                </th>
                <th className='text-left px-5 py-3 font-medium text-neutral-500 dark:text-white/40'>
                  Thời gian
                </th>
                <th className='text-left px-5 py-3 font-medium text-neutral-500 dark:text-white/40'>
                  Nhân viên
                </th>
                <th className='text-left px-5 py-3 font-medium text-neutral-500 dark:text-white/40'>
                  Dịch vụ
                </th>
                <th className='text-left px-5 py-3 font-medium text-neutral-500 dark:text-white/40'>
                  Trạng thái
                </th>
                <th className='px-5 py-3' />
              </tr>
            </thead>
            <tbody className='divide-y divide-neutral-100 dark:divide-white/[0.05]'>
              {appointments.map((apt) => (
                <tr
                  key={apt.id}
                  className='hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors'
                >
                  <td className='px-5 py-3'>
                    <div className='font-medium text-neutral-900 dark:text-white'>
                      {apt.customerName}
                    </div>
                    <div className='text-xs text-neutral-400 dark:text-white/30'>
                      {apt.phone}
                    </div>
                  </td>
                  <td className='px-5 py-3 text-neutral-600 dark:text-white/60'>
                    {format(new Date(apt.appointmentStart), "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className='px-5 py-3 text-neutral-600 dark:text-white/60'>
                    {apt.staff.name}
                  </td>
                  <td className='px-5 py-3'>
                    <div className='flex flex-col gap-0.5'>
                      {apt.appointmentServices.map((as) => (
                        <span
                          key={as.serviceId}
                          className='text-xs text-neutral-500 dark:text-white/40'
                        >
                          {as.service.name} —{" "}
                          <span className='text-neutral-700 dark:text-white/70 font-medium'>
                            {as.service.price.toLocaleString("vi-VN")}đ
                          </span>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className='px-5 py-3'>
                    <StatusDropdown
                      appointment={apt}
                      onUpdate={(id, status) => updateStatus({ id, status })}
                      isPending={isUpdating}
                    />
                  </td>
                  <td className='px-5 py-3'>
                    <button
                      onClick={() => deleteBooking(apt.id)}
                      className='p-1.5 rounded-lg text-neutral-300 dark:text-white/20 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors'
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
