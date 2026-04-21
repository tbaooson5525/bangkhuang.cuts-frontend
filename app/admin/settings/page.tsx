"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Clock,
  CalendarDays,
  CalendarOff,
  Trash2,
  Plus,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import businessHoursApi from "@/api/businessHoursApi";
import type { BusinessHours, WorkingDay, DayOff } from "@/lib/types";
import { cn } from "@/lib/utils";
import PageTitle from "@/components/shared/PageTitle";

const DAY_LABELS: Record<number, string> = {
  0: "CN",
  1: "T2",
  2: "T3",
  3: "T4",
  4: "T5",
  5: "T6",
  6: "T7",
};

const SLOT_OPTIONS = [30, 45, 60, 90, 120];

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='rounded-2xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] overflow-hidden'>
      <div className='flex items-center gap-2.5 px-5 py-4 border-b border-neutral-100 dark:border-white/[0.06]'>
        <Icon
          size={16}
          className='text-neutral-400 dark:text-white/40 shrink-0'
        />
        <h2 className='font-semibold text-sm text-neutral-900 dark:text-white'>
          {title}
        </h2>
      </div>
      <div className='p-5'>{children}</div>
    </div>
  );
}

function BusinessHoursSection() {
  const queryClient = useQueryClient();

  const { data: bh, isLoading } = useQuery<BusinessHours>({
    queryKey: ["business-hours"],
    queryFn: () => businessHoursApi.getBusinessHours().then((r) => r.data),
  });

  const [form, setForm] = useState<{
    openTime: string;
    closeTime: string;
    slotDuration: number;
  } | null>(null);

  const current =
    form ??
    (bh
      ? {
          openTime: bh.openTime,
          closeTime: bh.closeTime,
          slotDuration: bh.slotDuration,
        }
      : null);

  const { mutate: save, isPending } = useMutation({
    mutationFn: () => businessHoursApi.updateBusinessHours(current!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-hours"] });
      setForm(null);
      toast.success("Đã cập nhật giờ làm việc.");
    },
    onError: () => {
      toast.error("Không thể cập nhật. Vui lòng thử lại.");
    },
  });

  if (isLoading || !current) return <LoadingSpinner size='sm' />;

  const isDirty =
    bh &&
    (current.openTime !== bh.openTime ||
      current.closeTime !== bh.closeTime ||
      current.slotDuration !== bh.slotDuration);

  return (
    <Section icon={Clock} title='Giờ làm việc'>
      <div className='flex flex-col sm:flex-row gap-4'>
        <label className='flex-1 flex flex-col gap-1.5'>
          <span className='text-xs font-medium text-neutral-500 dark:text-white/40'>
            Giờ mở cửa
          </span>
          <input
            type='time'
            value={current.openTime}
            onChange={(e) =>
              setForm((f) => ({ ...(f ?? current), openTime: e.target.value }))
            }
            className='rounded-lg border border-neutral-200 dark:border-white/10 bg-transparent text-neutral-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/20'
          />
        </label>

        <label className='flex-1 flex flex-col gap-1.5'>
          <span className='text-xs font-medium text-neutral-500 dark:text-white/40'>
            Giờ đóng cửa
          </span>
          <input
            type='time'
            value={current.closeTime}
            onChange={(e) =>
              setForm((f) => ({ ...(f ?? current), closeTime: e.target.value }))
            }
            className='rounded-lg border border-neutral-200 dark:border-white/10 bg-transparent text-neutral-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/20'
          />
        </label>

        <label className='flex-1 flex flex-col gap-1.5'>
          <span className='text-xs font-medium text-neutral-500 dark:text-white/40'>
            Thời lượng slot
          </span>
          <select
            value={current.slotDuration}
            onChange={(e) =>
              setForm((f) => ({
                ...(f ?? current),
                slotDuration: Number(e.target.value),
              }))
            }
            className='rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-[rgb(32,32,32)] text-neutral-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/20'
          >
            {SLOT_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m} phút
              </option>
            ))}
          </select>
        </label>
      </div>

      {isDirty && (
        <div className='mt-4 flex justify-end'>
          <Button size='sm' onClick={() => save()} disabled={isPending}>
            <Save className='w-3.5 h-3.5 mr-1.5' />
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      )}
    </Section>
  );
}

function WorkingDaysSection() {
  const queryClient = useQueryClient();

  const { data: workingDays = [], isLoading } = useQuery<WorkingDay[]>({
    queryKey: ["working-days"],
    queryFn: () => businessHoursApi.getWorkingDays().then((r) => r.data),
  });

  const [localDays, setLocalDays] = useState<number[] | null>(null);
  const currentDays = localDays ?? workingDays.map((d) => d.dayOfWeek);

  const { mutate: save, isPending } = useMutation({
    mutationFn: () =>
      businessHoursApi.setWorkingDays({ dayOfWeek: currentDays }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["working-days"] });
      setLocalDays(null);
      toast.success("Đã cập nhật ngày làm việc.");
    },
    onError: () => {
      toast.error("Không thể cập nhật. Vui lòng thử lại.");
    },
  });

  const toggleDay = (day: number) => {
    setLocalDays((prev) => {
      const base = prev ?? workingDays.map((d) => d.dayOfWeek);
      return base.includes(day)
        ? base.filter((d) => d !== day)
        : [...base, day];
    });
  };

  const isDirty =
    localDays !== null &&
    JSON.stringify([...localDays].sort()) !==
      JSON.stringify([...workingDays.map((d) => d.dayOfWeek)].sort());

  if (isLoading) return <LoadingSpinner size='sm' />;

  return (
    <Section icon={CalendarDays} title='Ngày làm việc'>
      <div className='flex gap-2 flex-wrap'>
        {[1, 2, 3, 4, 5, 6, 0].map((day) => {
          const isActive = currentDays.includes(day);
          return (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={cn(
                "w-12 h-12 rounded-xl text-sm font-medium border transition-colors",
                isActive
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                  : "border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-white/40 hover:border-neutral-400 dark:hover:border-white/30",
              )}
            >
              {DAY_LABELS[day]}
            </button>
          );
        })}
      </div>

      {isDirty && (
        <div className='mt-4 flex justify-end'>
          <Button size='sm' onClick={() => save()} disabled={isPending}>
            <Save className='w-3.5 h-3.5 mr-1.5' />
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      )}
    </Section>
  );
}

function DaysOffSection() {
  const queryClient = useQueryClient();
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const [confirmDeleteDate, setConfirmDeleteDate] = useState<string | null>(
    null,
  );

  const { data: daysOff = [], isLoading } = useQuery<DayOff[]>({
    queryKey: ["days-off"],
    queryFn: () => businessHoursApi.getDaysOff().then((r) => r.data),
  });

  const { mutate: addDayOff, isPending: isAdding } = useMutation({
    mutationFn: () =>
      businessHoursApi.createDayOff({
        date: newDate,
        reason: newReason || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["days-off"] });
      setNewDate("");
      setNewReason("");
      toast.success("Đã thêm ngày nghỉ.");
    },
    onError: () => {
      toast.error("Không thể thêm ngày nghỉ. Vui lòng thử lại.");
    },
  });

  const { mutate: removeDayOff } = useMutation({
    mutationFn: (date: string) => businessHoursApi.deleteDayOff(date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["days-off"] });
      toast.success("Đã xoá ngày nghỉ.");
    },
    onError: () => {
      toast.error("Không thể xoá ngày nghỉ. Vui lòng thử lại.");
    },
  });

  const inputCls =
    "rounded-lg border border-neutral-200 dark:border-white/10 bg-transparent text-neutral-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/20 placeholder:text-neutral-400 dark:placeholder:text-white/20";

  return (
    <Section icon={CalendarOff} title='Ngày nghỉ'>
      <div className='flex flex-col sm:flex-row gap-2 mb-4'>
        <input
          type='date'
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className={cn(inputCls, "flex-shrink-0")}
        />
        <input
          type='text'
          placeholder='Lý do (không bắt buộc)'
          value={newReason}
          onChange={(e) => setNewReason(e.target.value)}
          className={cn(inputCls, "flex-1")}
        />
        <Button
          size='sm'
          onClick={() => addDayOff()}
          disabled={!newDate || isAdding}
          className='shrink-0'
        >
          <Plus className='w-3.5 h-3.5 mr-1' />
          Thêm
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner size='sm' />
      ) : daysOff.length === 0 ? (
        <p className='text-sm text-neutral-400 dark:text-white/30 text-center py-4'>
          Chưa có ngày nghỉ nào
        </p>
      ) : (
        <ul className='space-y-2'>
          {[...daysOff]
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((d) => (
              <li
                key={d.date}
                className='flex items-center justify-between rounded-lg px-3 py-2.5 bg-neutral-50 dark:bg-white/[0.03] border border-neutral-100 dark:border-white/[0.06]'
              >
                <div>
                  <span className='text-sm font-medium text-neutral-900 dark:text-white'>
                    {new Date(d.date + "T00:00:00").toLocaleDateString(
                      "vi-VN",
                      {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </span>
                  {d.reason && (
                    <span className='ml-2 text-xs text-neutral-400 dark:text-white/30'>
                      — {d.reason}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setConfirmDeleteDate(d.date)}
                  className='p-1.5 rounded-lg text-neutral-400 dark:text-white/30 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors'
                >
                  <Trash2 className='w-4 h-4' />
                </button>
              </li>
            ))}
        </ul>
      )}

      <ConfirmDialog
        open={confirmDeleteDate !== null}
        onOpenChange={(o) => !o && setConfirmDeleteDate(null)}
        title='Xoá ngày nghỉ?'
        description='Ngày nghỉ này sẽ bị xoá. Hành động này không thể hoàn tác.'
        confirmLabel='Xoá'
        onConfirm={() => {
          if (confirmDeleteDate) removeDayOff(confirmDeleteDate);
          setConfirmDeleteDate(null);
        }}
      />
    </Section>
  );
}

export default function SettingsPage() {
  return (
    <div className='flex flex-col gap-6'>
      <PageTitle text='Settings' />
      <BusinessHoursSection />
      <WorkingDaysSection />
      <DaysOffSection />
    </div>
  );
}
