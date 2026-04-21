import { lazy, Suspense } from "react";
import CreateBookingButton from "@/components/schedule/CreateBookingButton";
import { APPOINTMENT_STATUS } from "@/lib/types";
import { STATUS_CONFIG } from "@/lib/constants/appointment";
import PageTitle from "@/components/shared/PageTitle";

const Calendar = lazy(() => import("@/components/schedule/Calendar"));
const BookingList = lazy(() => import("@/components/schedule/BookingList"));

export default function SchedulePage() {
  return (
    <div className='flex flex-col gap-5'>
      {/* Header row */}
      <div className='flex justify-between items-center'>
        <PageTitle text='Lịch hẹn' />
        <div className='flex items-center gap-3'>
          {APPOINTMENT_STATUS.map((status) => {
            const config = STATUS_CONFIG[status];
            return (
              <div key={status} className='flex items-center gap-2'>
                <span className={`w-3 h-3 rounded-full ${config.dotColor}`} />
                <span className='text-xs text-neutral-600 dark:text-white/50'>
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
        <CreateBookingButton />
      </div>

      {/* Calendar */}
      <Suspense
        fallback={
          <div className='h-96 rounded-2xl bg-neutral-200 dark:bg-white/[0.06] animate-pulse' />
        }
      >
        <Calendar />
      </Suspense>

      {/* Booking list */}
      <Suspense
        fallback={
          <div className='h-48 rounded-2xl bg-neutral-200 dark:bg-white/[0.06] animate-pulse' />
        }
      >
        <BookingList />
      </Suspense>
    </div>
  );
}
