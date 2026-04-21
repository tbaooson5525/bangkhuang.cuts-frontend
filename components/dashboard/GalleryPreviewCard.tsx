"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Images } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { GalleryTheme } from "@/lib/types";

type Props = {
  themes: GalleryTheme[];
  loading?: boolean;
};

export default function GalleryPreviewCard({ themes, loading }: Props) {
  const totalImages = themes.reduce((s, t) => s + t.images.length, 0);
  const totalThemes = themes.length;
  const previewImages = themes.flatMap((t) => t.images).slice(0, 4);

  if (loading) {
    return <Skeleton className='rounded-[28px] min-h-[160px] w-full' />;
  }

  return (
    <Link
      href='/admin/gallery'
      className='group relative rounded-[28px] overflow-hidden bg-muted dark:bg-white/[0.04] dark:border dark:border-white/[0.08] min-h-[160px] flex flex-col justify-between p-5 transition-all duration-300 hover:shadow-md'
    >
      {/* Background mosaic grid (4 ảnh) */}
      {previewImages.length > 0 && (
        <div className='absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-30 dark:opacity-20 group-hover:opacity-40 dark:group-hover:opacity-30 transition-opacity duration-500'>
          {Array.from({ length: 4 }).map((_, i) => {
            const img = previewImages[i];
            return img ? (
              <div key={i} className='relative overflow-hidden'>
                <Image
                  src={img.thumbnailUrl}
                  alt=''
                  fill
                  className='object-cover scale-105 group-hover:scale-110 transition-transform duration-700'
                  sizes='150px'
                />
              </div>
            ) : (
              <div key={i} className='bg-muted-foreground/10' />
            );
          })}
        </div>
      )}

      {/* Gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10 dark:from-black/70 dark:via-black/30' />

      {/* Top row */}
      <div className='relative flex items-center justify-between'>
        <div className='flex items-center gap-1.5'>
          <Images className='w-3.5 h-3.5 text-white/70' />
          <span className='text-[11px] font-medium uppercase tracking-wider text-white/70'>
            Gallery
          </span>
        </div>
        <div className='w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors'>
          <ArrowUpRight className='w-3.5 h-3.5 text-white' />
        </div>
      </div>

      {/* Bottom stats */}
      <div className='relative flex items-end justify-between'>
        <div>
          <p className='text-2xl font-bold text-white leading-none tabular-nums'>
            {totalImages}
            <span className='text-sm font-normal text-white/60 ml-1'>ảnh</span>
          </p>
          <p className='text-xs text-white/50 mt-1'>{totalThemes} bộ sưu tập</p>
        </div>

        {/* Theme pills (hiện tối đa 2) */}
        {totalThemes > 0 && (
          <div className='flex flex-col items-end gap-1'>
            {themes.slice(0, 2).map((t) => (
              <span
                key={t.id}
                className='text-[10px] px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-white/80 border border-white/10'
              >
                {t.name}
              </span>
            ))}
            {totalThemes > 2 && (
              <span className='text-[10px] text-white/40'>
                +{totalThemes - 2} khác
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
