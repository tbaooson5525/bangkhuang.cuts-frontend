"use client";

import { format } from "date-fns";
import { CheckCircle2, Circle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { FALLBACK_IMAGE } from "@/lib/constants/images";
import type { Appointment } from "@/lib/types";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Props = {
  appointments: Appointment[];
  loading?: boolean;
};

export default function TodaySchedule({ appointments, loading }: Props) {
  const done = appointments.filter((a) => a.status === "DONE").length;
  const progress =
    appointments.length > 0
      ? Math.round((done / appointments.length) * 100)
      : 0;

  const actionBtn = (
    <Link
      href='/admin/schedule'
      className='w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors'
    >
      <ArrowUpRight className='w-4 h-4' />
    </Link>
  );

  return (
    <div className='flex flex-col gap-4'>
      <div className='pr-10'>
        <p className='font-bold text-foreground text-base'>Lịch hôm nay</p>
        <p className='text-xs text-foreground/40 mt-0.5'>
          {done}/{appointments.length} đã hoàn thành
        </p>
      </div>

      {/* Progress */}
      <div className='flex items-center gap-3'>
        <Progress value={progress} className='flex-1 h-2' />
        <span className='text-sm font-bold text-foreground shrink-0'>
          {progress}%
        </span>
      </div>

      {/* List */}
      {loading ? (
        <div className='flex flex-col gap-3'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-14 w-full rounded-2xl' />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <p className='text-sm text-foreground/30 text-center py-6'>
          Không có lịch hẹn hôm nay
        </p>
      ) : (
        <div className='flex flex-col gap-2'>
          {appointments.map((apt) => {
            const isDone = apt.status === "DONE";
            const isCancelled = apt.status === "CANCELLED";
            const staffSrc = apt.staff.avatarUrl?.avatar ?? FALLBACK_IMAGE.src;
            const initials = apt.staff.name
              .split(" ")
              .slice(-2)
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={apt.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-2xl transition-colors",
                  isDone
                    ? "bg-green-50"
                    : isCancelled
                      ? "opacity-50"
                      : "bg-secondary/60",
                )}
              >
                {/* Done icon */}
                {isDone ? (
                  <CheckCircle2 className='w-5 h-5 text-green-500 shrink-0' />
                ) : (
                  <Circle className='w-5 h-5 text-foreground/20 shrink-0' />
                )}

                {/* Info */}
                <div className='flex-1 min-w-0'>
                  <p
                    className={cn(
                      "text-sm font-semibold text-foreground truncate",
                      isDone && "line-through text-foreground/50",
                    )}
                  >
                    {apt.customerName}
                  </p>
                  <p className='text-xs text-foreground/40'>
                    {format(new Date(apt.appointmentStart), "HH:mm")}
                    {apt.appointmentServices.length > 0 &&
                      ` · ${apt.appointmentServices[0].service.name}`}
                  </p>
                </div>

                {/* Staff avatar */}
                <Avatar className='w-8 h-8 rounded-xl shrink-0'>
                  <AvatarImage src={staffSrc} className='object-cover' />
                  <AvatarFallback className='rounded-xl text-[10px] bg-muted'>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
