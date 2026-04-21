import { useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthPickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function MonthPicker({ selectedDate, onDateSelect }: MonthPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className='w-full max-w-[300px]'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-sm font-semibold text-neutral-900 dark:text-white'>
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className='flex space-x-1'>
          <button
            onClick={prevMonth}
            className='p-1 hover:bg-neutral-100 dark:hover:bg-white/[0.06] rounded-full text-neutral-600 dark:text-white/60 transition-colors'
          >
            <ChevronLeft className='w-4 h-4' />
          </button>
          <button
            onClick={nextMonth}
            className='p-1 hover:bg-neutral-100 dark:hover:bg-white/[0.06] rounded-full text-neutral-600 dark:text-white/60 transition-colors'
          >
            <ChevronRight className='w-4 h-4' />
          </button>
        </div>
      </div>
      <div className='grid grid-cols-7 gap-1 text-center text-xs mb-2'>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className='text-neutral-500 dark:text-white/30 font-medium'
          >
            {day}
          </div>
        ))}
      </div>
      <div className='grid grid-cols-7 gap-1 text-sm'>
        {days.map((day) => (
          <button
            key={day.toString()}
            onClick={() => onDateSelect(day)}
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
              !isSameMonth(day, currentMonth) &&
                "text-neutral-300 dark:text-white/20",
              isSameDay(day, selectedDate) &&
                "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold",
              !isSameDay(day, selectedDate) &&
                isSameMonth(day, currentMonth) &&
                "hover:bg-neutral-100 dark:hover:bg-white/[0.06] text-neutral-900 dark:text-white",
            )}
          >
            <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
          </button>
        ))}
      </div>
    </div>
  );
}
