import { useEffect, useRef, useState } from "react";
import { format, isSameDay, setHours, setMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import { Appointment } from "@/lib/types";

interface DayViewProps {
  selectedDate: Date;
  appointments: Appointment[];
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 60; // px

export function DayView({ selectedDate, appointments }: DayViewProps) {
  const [currentTime] = useState(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      // Scroll to 8 AM (8 * 60 = 480px)
      scrollRef.current.scrollTop = 8 * HOUR_HEIGHT;
    }
  }, []);

  const dayAppointments = appointments.filter((apt) =>
    isSameDay(new Date(apt.appointmentStart), selectedDate),
  );

  return (
    <div className='flex-1 flex flex-col h-full overflow-hidden rounded-lg'>
      <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-900'>
          {format(selectedDate, "EEEE, MMMM d, yyyy")}
        </h2>
        <div className='text-sm text-gray-500'>
          {dayAppointments.length} Appointment
          {dayAppointments.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div
        className='flex-1 overflow-y-auto relative no-scrollbar'
        ref={scrollRef}
      >
        <div className='relative'>
          {/* Grid Lines */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className='absolute w-full border-b border-gray-100 flex items-center'
              style={{ top: hour * HOUR_HEIGHT, height: HOUR_HEIGHT }}
            >
              <span className='absolute left-2 text-xs text-gray-400 w-10 text-right'>
                {format(setHours(new Date(), hour), "h a")}
              </span>
              <div className='ml-14 w-full border-b border-gray-100' />
            </div>
          ))}

          {/* Current Time Indicator */}
          {isSameDay(currentTime, selectedDate) && (
            <div
              className='absolute left-14 right-0 border-t-2 border-red-500 z-10 pointer-events-none'
              style={{
                top:
                  (currentTime.getHours() * 60 + currentTime.getMinutes()) *
                  (HOUR_HEIGHT / 60),
              }}
            >
              <div className='absolute -left-2 -top-1.5 w-3 h-3 bg-red-500 rounded-full' />
            </div>
          )}

          {/* Appointments */}
          {dayAppointments.map((apt) => {
            const startDate = new Date(apt.appointmentStart);
            const startMinutes =
              startDate.getHours() * 60 + startDate.getMinutes();
            const top = startMinutes * (HOUR_HEIGHT / 60);
            const height = 60 * (HOUR_HEIGHT / 60); // 1 hour duration

            return (
              <div
                key={apt.id}
                className={cn(
                  "absolute left-16 right-4 rounded-md p-2 text-xs border-l-4 shadow-sm transition-all hover:z-20 cursor-pointer",
                  apt.status === "CONFIRMED"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : apt.status === "PENDING"
                      ? "bg-yellow-50 border-yellow-500 text-yellow-700"
                      : "bg-red-50 border-red-500 text-red-700",
                )}
                style={{ top, height }}
              >
                <div className='font-semibold truncate'>
                  {format(startDate, "h:mm a")} - {apt.customerName}
                </div>
                <div className='truncate text-opacity-80'>{apt.comment}</div>
                <div className='mt-1 flex items-center gap-2 text-[10px] opacity-75'>
                  <span>📞 {apt.phone}</span>
                  <span>Staff: {apt.staff.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
