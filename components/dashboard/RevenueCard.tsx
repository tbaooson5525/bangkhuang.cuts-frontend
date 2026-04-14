"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";
import type { Appointment } from "@/lib/types";
import { useMemo } from "react";
import { isThisMonth } from "date-fns";

type Props = {
  appointments: Appointment[];
  loading?: boolean;
};

export default function RevenueCard({ appointments, loading }: Props) {
  const revenue = useMemo(() => {
    return appointments
      .filter(
        (a) => a.status === "DONE" && isThisMonth(new Date(a.appointmentStart)),
      )
      .reduce(
        (sum, apt) =>
          sum +
          apt.appointmentServices.reduce((s, as) => s + as.service.price, 0),
        0,
      );
  }, [appointments]);

  return (
    <div className='bg-brand-text rounded-[40px] p-5 text-brand-bg relative overflow-hidden'>
      {/* Decorative circle */}
      <div className='absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5' />
      <div className='absolute -right-4 -bottom-6 w-24 h-24 rounded-full bg-white/5' />

      <div className='flex items-center gap-2 mb-2 relative'>
        <div className='w-7 h-7 rounded-lg bg-green-400/20 flex items-center justify-center'>
          <TrendingUp className='w-4 h-4 text-green-400' />
        </div>
        <p className='text-xs text-brand-bg/50 uppercase tracking-wider'>
          Doanh thu tháng
        </p>
      </div>

      {loading ? (
        <Skeleton className='h-12 w-32 bg-white/10 mt-2' />
      ) : (
        <p className='text-3xl font-bold relative mt-2'>
          {revenue.toLocaleString("vi-VN")}
          <span className='text-lg ml-1'>đ</span>
        </p>
      )}

      <p className='text-xs text-brand-bg/40 mt-1 relative'>
        Từ lịch hẹn đã hoàn thành
      </p>
    </div>
  );
}
