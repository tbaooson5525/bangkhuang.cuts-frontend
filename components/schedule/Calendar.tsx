"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { MonthPicker } from "./MonthPicker";
import { DayView } from "./DayView";
import Card from "../shared/Card";
import bookingApi from "@/api/bookingApi";
import { Appointment } from "@/lib/types";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ["bookings"],
    queryFn: () => bookingApi.getAllBookings().then((r) => r.data),
  });

  const upcomingAppointments = appointments
    .filter((apt) => new Date(apt.appointmentStart) > new Date())
    .sort(
      (a, b) =>
        new Date(a.appointmentStart).getTime() -
        new Date(b.appointmentStart).getTime(),
    )
    .slice(0, 5);

  return (
    <div className='flex gap-5 mt-5'>
      {/* Sidebar */}
      <aside className='w-80 flex flex-col gap-6 overflow-y-auto hidden md:flex shrink-0'>
        <Card>
          <MonthPicker
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </Card>

        <Card className='flex-1 p-4'>
          <div className='flex justify-between items-center mb-3'>
            <h3 className='text-sm font-semibold text-neutral-900 dark:text-white'>
              Sắp tới
            </h3>
            <button
              onClick={() => setSelectedDate(new Date())}
              className='px-3 py-1.5 rounded-md text-xs text-neutral-500 dark:text-white/40 hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors'
            >
              Hôm nay
            </button>
          </div>

          {isLoading ? (
            <div className='flex justify-center py-4'>
              <div className='w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-white/20 border-t-neutral-800 dark:border-t-white animate-spin' />
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <p className='text-xs text-neutral-400 dark:text-white/30 text-center py-4'>
              Không có lịch hẹn sắp tới
            </p>
          ) : (
            <div className='space-y-2'>
              {upcomingAppointments.map((apt) => {
                const startDate = new Date(apt.appointmentStart);
                return (
                  <div
                    key={apt.id}
                    className='p-3 rounded-lg border border-neutral-100 dark:border-white/[0.06] hover:bg-neutral-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer'
                    onClick={() => setSelectedDate(startDate)}
                  >
                    <div className='flex justify-between items-start mb-1'>
                      <span className='text-xs font-medium text-neutral-900 dark:text-white'>
                        {format(startDate, "MMM d, h:mm a")}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${
                          apt.status === "CONFIRMED"
                            ? "bg-blue-500"
                            : apt.status === "PENDING"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                    </div>
                    <p className='text-xs text-neutral-500 dark:text-white/40 truncate'>
                      {apt.customerName}
                    </p>
                    <p className='text-xs text-neutral-400 dark:text-white/30 truncate'>
                      {apt.staff.name}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </aside>

      {/* Day View */}
      <Card className='flex-1 overflow-hidden p-0'>
        <DayView selectedDate={selectedDate} appointments={appointments} />
      </Card>
    </div>
  );
}
