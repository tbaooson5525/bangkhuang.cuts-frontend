"use client";

import Card from "@/components/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

type Props = {
  label: string;
  value: number | string;
  sub?: string;
  trend?: number; // positive = up, negative = down
  icon: React.ElementType;
  accent: string;
  loading?: boolean;
  fill?: "white" | "red" | "image";
};

export default function StatCard({
  label,
  value,
  sub,
  trend,
  icon: Icon,
  accent,
  loading,
  fill,
}: Props) {
  return (
    <Card fill={fill} actionBtn={<></>}>
      <div className='flex items-center justify-between mb-3'>
        <div
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
            accent,
          )}
        >
          <Icon className='w-4 h-4 text-white' />
        </div>
        {trend !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend >= 0 ? "text-green-600" : "text-red-500",
            )}
          >
            {trend >= 0 ? (
              <TrendingUp className='w-3 h-3' />
            ) : (
              <TrendingDown className='w-3 h-3' />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      {loading ? (
        <Skeleton className='h-10 w-20 mb-1' />
      ) : (
        <p className='text-[40px] font-bold text-foreground leading-none'>
          {value}
        </p>
      )}

      <p className='text-xs text-foreground/40 mt-1.5'>{label}</p>
      {sub && <p className='text-xs text-foreground/30'>{sub}</p>}
    </Card>
  );
}
