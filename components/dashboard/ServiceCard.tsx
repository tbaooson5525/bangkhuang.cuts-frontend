"use client";

import { Scissors, Circle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Service } from "@/lib/types";

type Props = {
  services: Service[];
  loading?: boolean;
};

export default function ServiceCard({ services, loading }: Props) {
  const activeServices = services.filter((s) => s.isActive);
  const inactiveServices = services.filter((s) => !s.isActive);

  return (
    <div className='rounded-[28px] bg-white dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08] p-5 flex flex-col gap-4 min-h-[160px]'>
      {/* Header */}
      <div className='flex items-center justify-between shrink-0'>
        <div className='flex items-center gap-2'>
          <div className='w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0'>
            <Scissors className='w-3.5 h-3.5 text-foreground/60' />
          </div>
          <p className='text-sm font-semibold text-foreground'>Dịch vụ</p>
        </div>
        <Badge variant='secondary' className='text-[11px] font-medium'>
          {activeServices.length} đang hoạt động
        </Badge>
      </div>

      {/* Service list — scrollable */}
      {loading ? (
        <div className='flex flex-col gap-2'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-10 w-full rounded-xl' />
          ))}
        </div>
      ) : services.length === 0 ? (
        <p className='text-sm text-muted-foreground text-center py-4'>
          Chưa có dịch vụ nào
        </p>
      ) : (
        <ScrollArea className='flex-1 max-h-[220px] -mr-1 pr-1'>
          <ul className='flex flex-col gap-1'>
            {activeServices.map((service, i) => (
              <li key={service.id}>
                <div className='flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-muted/60 dark:hover:bg-white/[0.04] transition-colors group'>
                  <div className='flex items-center gap-2.5 min-w-0'>
                    <Circle className='w-1.5 h-1.5 fill-foreground/30 text-foreground/30 shrink-0' />
                    <span className='text-sm text-foreground truncate'>
                      {service.name}
                    </span>
                  </div>
                  <span className='text-sm font-semibold text-foreground/70 dark:text-foreground/60 tabular-nums shrink-0 ml-3'>
                    {service.price.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                {i < activeServices.length - 1 && (
                  <Separator className='mx-3 bg-border/50' />
                )}
              </li>
            ))}

            {/* Inactive services */}
            {inactiveServices.length > 0 && (
              <>
                <li className='px-3 pt-3 pb-1'>
                  <p className='text-[11px] font-medium uppercase tracking-wider text-muted-foreground'>
                    Tạm dừng
                  </p>
                </li>
                {inactiveServices.map((service) => (
                  <li key={service.id}>
                    <div className='flex items-center justify-between px-3 py-2 rounded-xl opacity-45'>
                      <div className='flex items-center gap-2.5 min-w-0'>
                        <Circle className='w-1.5 h-1.5 text-muted-foreground shrink-0' />
                        <span className='text-sm text-muted-foreground line-through truncate'>
                          {service.name}
                        </span>
                      </div>
                      <span className='text-sm tabular-nums text-muted-foreground shrink-0 ml-3'>
                        {service.price.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </li>
                ))}
              </>
            )}
          </ul>
        </ScrollArea>
      )}
    </div>
  );
}
