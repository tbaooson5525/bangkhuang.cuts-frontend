"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { LiquidGlassCard } from "@/components/liquid-glass";
import { FALLBACK_IMAGE } from "@/lib/constants/images";
import type { Staff } from "@/lib/types";

// Memoized — only re-renders when staff data changes
const StaffCard = memo(function StaffCard({ staff }: { staff: Staff }) {
  const thumbnail = staff.avatarUrl?.thumbnail ?? FALLBACK_IMAGE;
  const blurSrc = staff.avatarUrl?.avatar
    ? staff.avatarUrl.avatar
    : FALLBACK_IMAGE.src;

  return (
    <Link
      href={`/admin/staffs/${staff.id}`}
      className='group relative aspect-square overflow-hidden rounded-3xl bg-neutral-200'
    >
      <Image
        src={thumbnail}
        alt={staff.name}
        fill
        sizes='(max-width:640px) 200px, (max-width:1024px) 400px, 400px'
        className='object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform'
        placeholder='blur'
        blurDataURL={blurSrc}
      />

      <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent' />

      <div className='absolute bottom-0 left-0 right-0 p-4'>
        <LiquidGlassCard
          glowIntensity='none'
          shadowIntensity='sm'
          borderRadius='26px'
          blurIntensity='md'
          draggable={false}
          className='p-4'
          backgroundColor='rgba(255,255,255,0.25)'
          filterId='staff-name-tag'
          filterScale={6}
        >
          <div className='text-black'>
            <h2 className='font-semibold text-3xl'>{staff.name}</h2>
            <p className='uppercase text-base'>barber</p>
          </div>
        </LiquidGlassCard>
      </div>
    </Link>
  );
});

export default StaffCard;
