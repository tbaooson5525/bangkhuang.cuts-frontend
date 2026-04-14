"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { LiquidGlassCard } from "@/components/liquid-glass";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FALLBACK_IMAGE } from "@/lib/constants/images";
import { cn } from "@/lib/utils";
import type { Staff } from "@/lib/types";
import { useState } from "react";
import Autoplay from "embla-carousel-autoplay";

const SLIDE_INTERVAL = 7000;

type Props = {
  staffList: Staff[];
  todayCountByStaff: Record<number, number>;
  loading?: boolean;
};

export default function HeroStaffCard({
  staffList,
  todayCountByStaff,
  loading,
}: Props) {
  const activeStaffs = staffList.filter((s) => s.isActive);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Track current slide
  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  if (loading) {
    return <Skeleton className='w-full min-h-[320px] rounded-[40px]' />;
  }

  if (activeStaffs.length === 0) {
    return (
      <div className='w-full min-h-[320px] rounded-[40px] bg-secondary flex items-center justify-center'>
        <p className='text-foreground/30 text-sm'>Chưa có nhân viên</p>
      </div>
    );
  }

  const staff = activeStaffs[current];

  return (
    <div className='relative w-full min-h-[320px] rounded-[40px] overflow-hidden bg-neutral-900'>
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: SLIDE_INTERVAL, stopOnInteraction: true })]}
        className='w-full h-full'
      >
        <CarouselContent className='h-full ml-0'>
          {activeStaffs.map((s, i) => {
            const profileSrc = s.avatarUrl?.profile ?? FALLBACK_IMAGE;
            return (
              <CarouselItem key={s.id} className='relative min-h-[320px] pl-0'>
                {/* Prefetch all — eager loading */}
                <Image
                  src={profileSrc}
                  alt={s.name}
                  fill
                  className='object-cover object-top pointer-events-none'
                  sizes='(max-width: 768px) 100vw, 400px'
                  priority={i === 0}
                  loading='eager'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent' />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Top badges */}
      <div className='absolute top-4 left-4 z-10 pointer-events-none'>
        <Badge className='bg-white/20 backdrop-blur-sm text-white border-0 text-xs'>
          {todayCountByStaff[staff?.id] ?? 0} lịch hôm nay
        </Badge>
      </div>

      <Link
        href={`/admin/staffs/${staff?.id}`}
        className='absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors'
      >
        <ArrowUpRight className='w-4 h-4 text-white' />
      </Link>

      {/* Name tag */}
      <div className='absolute bottom-0 left-0 right-0 p-4 z-10 pointer-events-none'>
        <LiquidGlassCard
          glowIntensity='none'
          shadowIntensity='sm'
          borderRadius='20px'
          blurIntensity='md'
          draggable={false}
          className='p-4 pointer-events-auto'
          backgroundColor='rgba(255,255,255,0.2)'
          filterId='hero-glass'
          filterScale={6}
        >
          <h2 className='text-white font-bold text-2xl leading-tight'>
            {staff?.name}
          </h2>
          <p className='text-white/70 text-sm uppercase tracking-wider mt-0.5'>
            Barber
          </p>
        </LiquidGlassCard>
      </div>

      {/* Dot indicators */}
      {activeStaffs.length > 1 && (
        <div className='absolute bottom-4 right-4 z-20 flex items-center gap-1.5'>
          {activeStaffs.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "rounded-full transition-all duration-300",
                i === current
                  ? "w-5 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
