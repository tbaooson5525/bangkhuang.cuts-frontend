"use client";

import { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

// ── Dark mode hook (theo Tailwind class .dark trên <html>) ──────────
function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const el = document.documentElement;
    setIsDark(el.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(el.classList.contains("dark"));
    });
    observer.observe(el, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

// ── Data aggregation ────────────────────────────────────────────────
const TABS = ["Năm", "Tháng", "Ngày"] as const;
type Tab = (typeof TABS)[number];

const now = new Date();
const thisYear = now.getFullYear();
const lastYear = thisYear - 1;
const thisMonth = now.getMonth();

function aggregate(
  appointments: Appointment[],
  tab: Tab,
): { label: string; thisYear: number; lastYear: number }[] {
  const buckets = new Map<string, { thisYear: number; lastYear: number }>();
  const ensure = (key: string) => {
    if (!buckets.has(key)) buckets.set(key, { thisYear: 0, lastYear: 0 });
    return buckets.get(key)!;
  };

  if (tab === "Năm") {
    const MONTHS = [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ];
    MONTHS.forEach((m) => ensure(m));
    for (const appt of appointments) {
      const d = new Date(appt.appointmentStart);
      const y = d.getFullYear();
      const m = MONTHS[d.getMonth()];
      if (y === thisYear) ensure(m).thisYear++;
      if (y === lastYear) ensure(m).lastYear++;
    }
    return MONTHS.map((m) => ({ label: m, ...buckets.get(m)! }));
  }

  if (tab === "Tháng") {
    const daysInMonth = new Date(thisYear, thisMonth + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) ensure(String(d));
    const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const prevMonthYear = thisMonth === 0 ? lastYear : thisYear;
    for (const appt of appointments) {
      const d = new Date(appt.appointmentStart);
      const day = String(d.getDate());
      if (d.getFullYear() === thisYear && d.getMonth() === thisMonth)
        ensure(day).thisYear++;
      if (d.getFullYear() === prevMonthYear && d.getMonth() === prevMonth)
        ensure(day).lastYear++;
    }
    return Array.from(buckets.entries()).map(([label, v]) => ({ label, ...v }));
  }

  // Ngày
  const HOURS = Array.from({ length: 24 }, (_, i) => `${i}h`);
  HOURS.forEach((h) => ensure(h));
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const yesterday = today - 86_400_000;
  for (const appt of appointments) {
    const d = new Date(appt.appointmentStart);
    const hour = `${d.getHours()}h`;
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    if (day === today) ensure(hour).thisYear++;
    if (day === yesterday) ensure(hour).lastYear++;
  }
  return HOURS.map((h) => ({ label: h, ...buckets.get(h)! }));
}

// ── Component ───────────────────────────────────────────────────────
export function SalesChart({ data }: { data: Appointment[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("Tháng");
  const isDark = useDarkMode();

  const chartData = useMemo(
    () => aggregate(data, activeTab),
    [data, activeTab],
  );

  const legendLabels: Record<Tab, [string, string]> = {
    Năm: ["Năm nay", "Năm ngoái"],
    Tháng: ["Tháng này", "Tháng trước"],
    Ngày: ["Hôm nay", "Hôm qua"],
  };
  const [labelThis, labelLast] = legendLabels[activeTab];

  // ── Theme tokens dựa vào isDark ────────────────────────────────
  const textColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";
  const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const lineMain = isDark ? "#ffffff" : "#000000";
  const lineSub = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.20)";
  const tooltipBg = isDark ? "rgb(32,32,32)" : "#ffffff";
  const tooltipBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const tooltipLabel = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
  const tooltipValue = isDark ? "rgba(255,255,255,0.60)" : "rgba(0,0,0,0.55)";

  const xAxisInterval =
    activeTab === "Ngày" ? 3 : activeTab === "Tháng" ? 4 : 0;

  return (
    <div className='flex flex-col h-full'>
      {/* ── Top bar ── */}
      <div className='flex flex-wrap items-center justify-between gap-3 mb-5 shrink-0'>
        {/* Tabs */}
        <div className='flex items-center gap-1'>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[12.5px] transition-colors",
                activeTab === tab
                  ? "bg-black/[0.06] dark:bg-white/[0.08] text-black dark:text-white font-medium"
                  : "text-black/40 dark:text-white/40 hover:text-black/70 dark:hover:text-white/70",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className='flex items-center gap-3 text-[12px] text-black/50 dark:text-white/50'>
          <span className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-black dark:bg-white' />
            {labelThis}
          </span>
          <span className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-black/25 dark:bg-white/25' />
            {labelLast}
          </span>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className='flex-1 min-h-[200px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={chartData}
            margin={{ top: 4, right: 20, left: -20, bottom: 0 }}
          >
            <CartesianGrid stroke={gridColor} vertical={false} />

            <XAxis
              dataKey='label'
              tick={{ fill: textColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={6}
              interval={xAxisInterval}
            />

            <YAxis
              tick={{ fill: textColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
              }
            />

            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: 10,
                fontSize: 12,
                boxShadow: isDark
                  ? "0 4px 16px rgba(0,0,0,0.4)"
                  : "0 4px 16px rgba(0,0,0,0.08)",
              }}
              labelStyle={{
                fontWeight: 600,
                color: tooltipLabel,
                marginBottom: 4,
              }}
              itemStyle={{ color: tooltipValue }}
              formatter={(v: number, name: string) => [
                `${v} lịch`,
                name === "thisYear" ? labelThis : labelLast,
              ]}
              cursor={{
                stroke: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            <Line
              type='monotone'
              dataKey='thisYear'
              stroke={lineMain}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: lineMain, strokeWidth: 0 }}
              name='thisYear'
            />
            <Line
              type='monotone'
              dataKey='lastYear'
              stroke={lineSub}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: lineSub, strokeWidth: 0 }}
              name='lastYear'
              strokeDasharray='4 4'
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
