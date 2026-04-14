"use client";

import { useMemo } from "react";
import { format, startOfWeek, addDays, isSameDay, isToday } from "date-fns";
import { vi } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Card from "@/components/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

const HOURS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

const STATUS_BG: Record<string, string> = {
  PENDING: "bg-yellow-400/90 text-yellow-900",
  CONFIRMED: "bg-brand-primary/90 text-white",
  DONE: "bg-green-500/90 text-white",
  CANCELLED: "bg-neutral-400/60 text-neutral-700 line-through",
};

type Props = {
  appointments: Appointment[];
  loading?: boolean;
};

export default function WeeklyCalendar({ appointments, loading }: Props) {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const prevWeek = () => setWeekStart((d) => addDays(d, -7));
  const nextWeek = () => setWeekStart((d) => addDays(d, 7));

  const actionBtn = (
    <div className='flex items-center gap-1'>
      <button
        onClick={prevWeek}
        className='w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-foreground/10 transition-colors'
      >
        <ChevronLeft className='w-4 h-4' />
      </button>
      <button
        onClick={nextWeek}
        className='w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-foreground/10 transition-colors'
      >
        <ChevronRight className='w-4 h-4' />
      </button>
    </div>
  );

  return (
    <Card
      actionBtn={actionBtn}
      actionFn={undefined}
      className='flex flex-col gap-3'
    >
      {/* Month label */}
      <p className='font-bold text-foreground text-lg pr-20'>
        {format(weekStart, "MMMM yyyy", { locale: vi })}
      </p>

      {loading ? (
        <Skeleton className='h-48 w-full rounded-2xl' />
      ) : (
        <div className='overflow-x-auto'>
          <div className='min-w-[600px]'>
            {/* Day headers */}
            <div className='grid grid-cols-[60px_repeat(7,1fr)] gap-1 mb-2'>
              <div />
              {days.map((day) => (
                <div key={day.toISOString()} className='text-center'>
                  <p className='text-xs text-foreground/40 uppercase'>
                    {format(day, "EEE", { locale: vi })}
                  </p>
                  <div
                    className={cn(
                      "mx-auto w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5",
                      isToday(day)
                        ? "bg-brand-primary text-white"
                        : "text-foreground",
                    )}
                  >
                    {format(day, "d")}
                  </div>
                </div>
              ))}
            </div>

            {/* Time rows */}
            <div className='flex flex-col gap-px'>
              {HOURS.map((hour) => {
                const [h] = hour.split(":").map(Number);
                return (
                  <div
                    key={hour}
                    className='grid grid-cols-[60px_repeat(7,1fr)] gap-1 min-h-[36px]'
                  >
                    <div className='text-xs text-foreground/30 pt-1 text-right pr-2'>
                      {hour}
                    </div>
                    {days.map((day) => {
                      const slot = appointments.filter((apt) => {
                        const start = new Date(apt.appointmentStart);
                        return isSameDay(start, day) && start.getHours() === h;
                      });
                      return (
                        <div
                          key={day.toISOString()}
                          className='relative min-h-[36px]'
                        >
                          {slot.map((apt) => (
                            <div
                              key={apt.id}
                              className={cn(
                                "rounded-lg px-2 py-1 text-[10px] font-medium truncate leading-tight",
                                STATUS_BG[apt.status],
                              )}
                            >
                              {apt.customerName}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
