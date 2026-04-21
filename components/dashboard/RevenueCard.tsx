"use client";

import { useMemo } from "react";
import { isThisMonth } from "date-fns";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import type { Appointment } from "@/lib/types";

type Props = {
  appointments: Appointment[];
  loading?: boolean;
};

export default function RevenueCard({ appointments, loading }: Props) {
  const { revenue, count, avgPerAppointment } = useMemo(() => {
    const done = appointments.filter(
      (a) => a.status === "DONE" && isThisMonth(new Date(a.appointmentStart)),
    );
    const rev = done.reduce(
      (sum, apt) =>
        sum +
        apt.appointmentServices.reduce((s, as) => s + as.service.price, 0),
      0,
    );
    return {
      revenue: rev,
      count: done.length,
      avgPerAppointment: done.length > 0 ? Math.round(rev / done.length) : 0,
    };
  }, [appointments]);

  return (
    <div className='rounded-[28px] bg-foreground dark:bg-white/[0.06] dark:border dark:border-white/[0.08] p-5 flex flex-col gap-4 overflow-hidden relative'>
      {/* Decorative blobs */}
      <div className='pointer-events-none absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/[0.04]' />
      <div className='pointer-events-none absolute -right-3 bottom-4 w-20 h-20 rounded-full bg-white/[0.03]' />

      {/* Header */}
      <div className='flex items-center justify-between relative'>
        <div className='flex items-center gap-2'>
          <div className='w-7 h-7 rounded-lg bg-green-400/20 flex items-center justify-center shrink-0'>
            <TrendingUp className='w-4 h-4 text-green-400' />
          </div>
          <p className='text-xs font-medium uppercase tracking-wider text-white/50 dark:text-white/40'>
            Doanh thu tháng
          </p>
        </div>
      </div>

      {/* Main value */}
      {loading ? (
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-9 w-36 bg-white/10' />
          <Skeleton className='h-3 w-24 bg-white/10' />
        </div>
      ) : (
        <div className='relative'>
          <p className='text-[32px] font-bold leading-none text-white dark:text-white tabular-nums'>
            {revenue.toLocaleString("vi-VN")}
            <span className='text-lg font-semibold ml-1 text-white/60'>đ</span>
          </p>
          <p className='text-xs text-white/40 mt-1.5'>
            từ {count} lịch hẹn đã hoàn thành
          </p>
        </div>
      )}

      <Separator className='bg-white/10' />

      {/* Footer stat */}
      {loading ? (
        <Skeleton className='h-4 w-32 bg-white/10' />
      ) : (
        <div className='flex items-center justify-between text-xs text-white/50 relative'>
          <span>Trung bình / lịch</span>
          <span className='font-semibold text-white/80 tabular-nums'>
            {avgPerAppointment.toLocaleString("vi-VN")}đ
          </span>
        </div>
      )}
    </div>
  );
}
