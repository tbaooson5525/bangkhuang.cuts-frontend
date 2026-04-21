"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { format, isToday } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, CheckCircle2, Clock, Users } from "lucide-react";
import bookingApi from "@/api/bookingApi";
import staffApi from "@/api/staffApi";
import serviceApi from "@/api/serviceApi";
import galleryApi from "@/api/galleryApi";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import Card from "@/components/shared/Card";
import TodaySchedule from "@/components/dashboard/TodaySchedule";
import RevenueCard from "@/components/dashboard/RevenueCard";
import GalleryPreviewCard from "@/components/dashboard/GalleryPreviewCard";
import ServiceCard from "@/components/dashboard/ServiceCard";
import type { Appointment, Staff } from "@/lib/types";

const DASHBOARD_STALE_MS = 2 * 60 * 1000;

function useDashboard() {
  const { data: bookings = [], isLoading: l1 } = useQuery<Appointment[]>({
    queryKey: ["bookings"],
    queryFn: () => bookingApi.getAllBookings().then((r) => r.data),
    staleTime: DASHBOARD_STALE_MS,
  });
  const { data: staffList = [], isLoading: l2 } = useQuery<Staff[]>({
    queryKey: ["staffs"],
    queryFn: () => staffApi.getAll().then((r) => r.data),
    staleTime: DASHBOARD_STALE_MS,
  });
  const { data: services = [], isLoading: l3 } = useQuery({
    queryKey: ["services"],
    queryFn: () => serviceApi.getAll().then((r) => r.data),
    staleTime: DASHBOARD_STALE_MS,
  });
  const { data: themes = [], isLoading: l4 } = useQuery({
    queryKey: ["gallery-themes"],
    queryFn: () => galleryApi.getThemes().then((r) => r.data),
    staleTime: DASHBOARD_STALE_MS,
  });

  return {
    bookings,
    staffList,
    services,
    themes,
    loading: l1 || l2 || l3 || l4,
  };
}

function useDashboardStats(bookings: Appointment[], staffList: Staff[]) {
  return useMemo(() => {
    const todayBookings = bookings.filter((b) =>
      isToday(new Date(b.appointmentStart)),
    );
    return {
      todayTotal: todayBookings.length,
      todayBookings,
      pending: bookings.filter((b) => b.status === "PENDING").length,
      done: bookings.filter((b) => b.status === "DONE").length,
      activeStaff: staffList.filter((s) => s.isActive).length,
    };
  }, [bookings, staffList]);
}

export default function DashboardPage() {
  const { bookings, staffList, services, themes, loading } = useDashboard();
  const greeting = format(new Date(), "EEEE, dd MMMM yyyy", { locale: vi });
  const stats = useDashboardStats(bookings, staffList);

  return (
    <div className='flex flex-col gap-4 pb-0'>
      {/* Greeting row — negative top margin to align with the pt-6 from layout */}
      <div className='flex items-center justify-between pb-2'>
        <h1 className='text-[20px] font-semibold tracking-tight text-foreground'>
          {greeting}
        </h1>
        <p className='text-sm text-foreground/40 mt-0.5 hidden sm:block'>
          Xem tổng quan hoạt động của tiệm
        </p>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='grid grid-cols-2 xl:grid-cols-4 gap-4'>
          <StatCard
            label='Lịch hẹn hôm nay'
            value={stats.todayTotal}
            sub='tổng trong ngày'
            icon={Calendar}
            bgColor='#edeefc'
            loading={loading}
          />
          <StatCard
            label='Chờ xác nhận'
            value={stats.pending}
            sub='cần xử lý ngay'
            icon={Clock}
            bgColor='#e6f1fd'
            loading={loading}
          />
          <StatCard
            label='Đã hoàn thành'
            value={stats.done}
            sub='tất cả thời gian'
            icon={CheckCircle2}
            bgColor='#edeefc'
            loading={loading}
          />
          <StatCard
            label='Nhân viên active'
            value={stats.activeStaff}
            sub='đang hoạt động'
            icon={Users}
            bgColor='#e6f1fd'
            loading={loading}
          />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          <Card className='lg:col-span-2 min-h-[300px]'>
            <SalesChart data={bookings} />
          </Card>
          <Card className='min-h-[260px]'>
            <TodaySchedule
              appointments={stats.todayBookings}
              loading={loading}
            />
          </Card>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <RevenueCard appointments={bookings} loading={loading} />
          <GalleryPreviewCard themes={themes} loading={loading} />
          <ServiceCard services={services} loading={loading} />
        </div>
      </div>
    </div>
  );
}
