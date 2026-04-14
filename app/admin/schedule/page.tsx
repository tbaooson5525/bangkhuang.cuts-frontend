import { lazy, Suspense } from "react";
import PageTilte from "@/components/page-title";
import CreateBookingButton from "@/components/schedule/create-button";
import { APPOINTMENT_STATUS, type AppointmentStatus } from "@/lib/types";

// Lazy load heavy calendar + booking list (date-fns, recharts etc.)
const Calendar = lazy(() => import("@/components/schedule/calendar"));
const BookingList = lazy(() => import("@/components/schedule/booking-list"));

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; color: string }
> = {
  PENDING: { label: "Chờ xác nhận", color: "bg-yellow-500" },
  CONFIRMED: { label: "Đã xác nhận", color: "bg-blue-500" },
  DONE: { label: "Hoàn thành", color: "bg-green-500" },
  CANCELLED: { label: "Đã huỷ", color: "bg-red-500" },
};

export default function SchedulePage() {
  return (
    <div className='flex flex-col h-full overflow-y-auto'>
      <div className='flex justify-between items-center shrink-0'>
        <PageTilte text='Lịch hẹn' />
        <div className='flex items-center gap-3'>
          {APPOINTMENT_STATUS.map((status) => {
            const config = STATUS_CONFIG[status];
            return (
              <div key={status} className='flex items-center gap-2'>
                <span className={`w-3 h-3 rounded-full ${config.color}`} />
                <span className='text-xs text-gray-600'>{config.label}</span>
              </div>
            );
          })}
        </div>
        <CreateBookingButton />
      </div>

      <div className='flex-1 overflow-y-auto no-scrollbar'>
        <Suspense
          fallback={
            <div className='h-96 rounded-2xl bg-neutral-200 animate-pulse mt-5' />
          }
        >
          <Calendar />
        </Suspense>

        <Suspense
          fallback={
            <div className='h-48 rounded-2xl bg-neutral-200 animate-pulse mt-6' />
          }
        >
          <BookingList />
        </Suspense>
      </div>
    </div>
  );
}
