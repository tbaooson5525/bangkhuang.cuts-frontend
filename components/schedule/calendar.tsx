"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { MonthPicker } from "./month.picker";
import { DayView } from "./day-view";
import Card from "../card";
import CustomButton from "../custom-button";
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
      <aside className='w-80 flex flex-col gap-6 overflow-y-auto hiddenn md:flex shrink-0'>
        <Card actionBtn={<></>}>
          <MonthPicker
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </Card>

        <Card actionBtn={<></>} className='flex-1 p-4'>
          <div className='flex justify-between items-center mb-3'>
            <h3 className='text-sm font-semibold'>Sắp tới</h3>
            <CustomButton
              onClick={() => setSelectedDate(new Date())}
              className='px-3 py-1.5 rounded-md text-xs'
            >
              Hôm nay
            </CustomButton>
          </div>

          {isLoading ? (
            <div className='flex justify-center py-4'>
              <div className='w-5 h-5 rounded-full border-2 border-neutral-300 border-t-neutral-800 animate-spin' />
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <p className='text-xs text-neutral-400 text-center py-4'>
              Không có lịch hẹn sắp tới
            </p>
          ) : (
            <div className='space-y-2'>
              {upcomingAppointments.map((apt) => {
                const startDate = new Date(apt.appointmentStart);
                return (
                  <div
                    key={apt.id}
                    className='p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer'
                    onClick={() => setSelectedDate(startDate)}
                  >
                    <div className='flex justify-between items-start mb-1'>
                      <span className='text-xs font-medium text-gray-900'>
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
                    <div className='text-sm font-medium text-gray-700 truncate'>
                      {apt.customerName}
                    </div>
                    <div className='text-xs text-gray-400 truncate'>
                      {apt.staff.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </aside>

      {/* Day View */}
      <Card actionBtn={<></>} className='flex-1 overflow-hidden p-6'>
        <DayView selectedDate={selectedDate} appointments={appointments} />
      </Card>
    </div>
  );
}
