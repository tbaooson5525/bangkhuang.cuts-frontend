"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, isToday } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, CheckCircle2, Clock, Users } from "lucide-react";

import bookingApi from "@/api/bookingApi";
import staffApi from "@/api/staffApi";
import serviceApi from "@/api/serviceApi";
import galleryApi from "@/api/galleryApi";
import type { Appointment, Staff, Service, GalleryTheme } from "@/lib/types";

import HeroStaffCard from "@/components/dashboard/HeroStaffCard";
import StatCard from "@/components/dashboard/StatCard";
import WeeklyCalendar from "@/components/dashboard/WeeklyCalendar";
import TodaySchedule from "@/components/dashboard/TodaySchedule";
import RevenueCard from "@/components/dashboard/RevenueCard";
import GalleryPreviewCard from "@/components/dashboard/GalleryPreviewCard";

export default function DashboardPage() {
  const greeting = format(new Date(), "EEEE, dd MMMM yyyy", { locale: vi });

  const { data: bookings = [], isLoading: loadingBookings } = useQuery<
    Appointment[]
  >({
    queryKey: ["bookings"],
    queryFn: () => bookingApi.getAllBookings().then((r) => r.data),
  });

  const { data: staffList = [], isLoading: loadingStaffs } = useQuery<Staff[]>({
    queryKey: ["staffs"],
    queryFn: () => staffApi.getAll().then((r) => r.data),
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: () => serviceApi.getAll().then((r) => r.data),
  });

  const { data: themes = [] } = useQuery<GalleryTheme[]>({
    queryKey: ["gallery-themes"],
    queryFn: () => galleryApi.getThemes().then((r) => r.data),
  });

  const todayBookings = useMemo(
    () => bookings.filter((b) => isToday(new Date(b.appointmentStart))),
    [bookings],
  );

  const stats = useMemo(
    () => ({
      todayTotal: todayBookings.length,
      pending: bookings.filter((b) => b.status === "PENDING").length,
      done: bookings.filter((b) => b.status === "DONE").length,
      activeStaff: staffList.filter((s) => s.isActive).length,
    }),
    [bookings, todayBookings, staffList],
  );

  // Count today's bookings per staff for the hero slider
  const todayCountByStaff = useMemo(
    () =>
      todayBookings.reduce<Record<number, number>>((acc, b) => {
        acc[b.staffId] = (acc[b.staffId] ?? 0) + 1;
        return acc;
      }, {}),
    [todayBookings],
  );

  return (
    <div className='flex flex-col gap-4 pb-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-foreground capitalize'>
          {greeting}
        </h1>
        <p className='text-sm text-foreground/40 mt-0.5'>
          Xem tổng quan hoạt động của tiệm
        </p>
      </div>

      {/* Row 1: Hero slider + 2x2 Stats */}
      <div className='grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4'>
        <HeroStaffCard
          staffList={staffList}
          todayCountByStaff={todayCountByStaff}
          loading={loadingStaffs}
        />
        <div className='grid grid-cols-2 gap-4'>
          <StatCard
            label='Lịch hẹn hôm nay'
            value={stats.todayTotal}
            sub='tổng trong ngày'
            icon={Calendar}
            accent='bg-brand-primary'
            loading={loadingBookings}
          />
          <StatCard
            label='Chờ xác nhận'
            value={stats.pending}
            sub='cần xử lý ngay'
            icon={Clock}
            accent='bg-yellow-400'
            loading={loadingBookings}
          />
          <StatCard
            label='Đã hoàn thành'
            value={stats.done}
            sub='tất cả thời gian'
            icon={CheckCircle2}
            accent='bg-green-500'
            loading={loadingBookings}
          />
          <StatCard
            label='Nhân viên active'
            value={stats.activeStaff}
            sub='đang hoạt động'
            icon={Users}
            accent='bg-blue-400'
            loading={loadingStaffs}
          />
        </div>
      </div>

      {/* Row 2: Weekly calendar + Today schedule */}
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4'>
        <WeeklyCalendar appointments={bookings} loading={loadingBookings} />
        <TodaySchedule appointments={todayBookings} loading={loadingBookings} />
      </div>

      {/* Row 3: Bottom summary */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <StatCard
          label='Tổng lịch hẹn'
          value={bookings.length}
          sub={`+${todayBookings.length} hôm nay`}
          icon={Calendar}
          accent='bg-brand-primary'
          fill='white'
          loading={loadingBookings}
        />
        <RevenueCard appointments={bookings} loading={loadingBookings} />
        <GalleryPreviewCard themes={themes} />
      </div>
    </div>
  );
}
