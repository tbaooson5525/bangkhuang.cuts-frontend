"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { GalleryTheme } from "@/lib/types";

type Props = {
  themes: GalleryTheme[];
  loading?: boolean;
};

export default function GalleryPreviewCard({ themes, loading }: Props) {
  const firstImage = themes.flatMap((t) => t.images)[0];

  return (
    <Link
      href='/admin/gallery'
      className='relative rounded-[40px] overflow-hidden bg-neutral-800 block group min-h-[160px]'
    >
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {firstImage ? (
            <Image
              src={firstImage.thumbnailUrl}
              alt='Gallery'
              fill
              className='object-cover group-hover:scale-105 transition-transform duration-500'
              sizes='300px'
            />
          ) : (
            <div className='absolute inset-0 bg-gradient-to-br from-brand-primary/60 to-brand-text/80' />
          )}

          {/* Overlay */}
          <div className='absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors' />

          {/* Content */}
          <div className='absolute inset-0 p-5 flex flex-col justify-between'>
            <div className='flex justify-between items-start'>
              <p className='text-white/60 text-xs uppercase tracking-wider'>
                Gallery
              </p>
              <div className='w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center'>
                <ArrowUpRight className='w-4 h-4 text-white' />
              </div>
            </div>
            <div>
              <p className='text-white font-bold text-xl'>
                {themes.reduce((s, t) => s + t.images.length, 0)} ảnh
              </p>
              <p className='text-white/60 text-xs mt-0.5'>
                {themes.length} bộ sưu tập
              </p>
            </div>
          </div>
        </>
      )}
    </Link>
  );
}
