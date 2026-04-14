"use client";

import { memo, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import staffApi from "@/api/staffApi";
import PageTilte from "@/components/page-title";
import CreateStaffButton from "@/components/staffs/create-staff";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import type { Staff } from "@/lib/types";

// Lazy load StaffCard — it pulls in LiquidGlass + framer-motion
const StaffCard = lazy(() => import("@/components/staffs/staff-card"));

// Memoize the grid to avoid re-render when parent state changes
const StaffGrid = memo(function StaffGrid({
  staffList,
}: {
  staffList: Staff[];
}) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5'>
      {staffList.map((staff) => (
        <Suspense
          key={staff.id}
          fallback={
            <div className='aspect-square rounded-3xl bg-neutral-200 animate-pulse' />
          }
        >
          <StaffCard staff={staff} />
        </Suspense>
      ))}
    </div>
  );
});

export default function StaffsPage() {
  const { data: staffList = [], isLoading } = useQuery<Staff[]>({
    queryKey: ["staffs"],
    queryFn: () => staffApi.getAll().then((res) => res.data),
  });

  return (
    <div className='flex flex-col h-full'>
      <div className='flex justify-between items-center mb-5 shrink-0'>
        <PageTilte text='Nhân viên' />
        <CreateStaffButton />
      </div>

      <div className='flex-1 overflow-y-auto'>
        {isLoading ? <LoadingSpinner /> : <StaffGrid staffList={staffList} />}
      </div>
    </div>
  );
}
