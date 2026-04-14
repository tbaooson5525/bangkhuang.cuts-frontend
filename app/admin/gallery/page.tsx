"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Pencil, Plus } from "lucide-react";
import Image from "next/image";

import PageTilte from "@/components/page-title";
import AppDrawer from "@/components/shared/AppDrawer";
import AddImagesDrawer from "@/components/gallery/AddImagesDrawer";
import GalleryThemeForm, {
  ThemeFormValues,
} from "@/components/gallery/GalleryThemeForm";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useDrawer } from "@/hooks/useDrawer";
import { useFormMutation } from "@/hooks/useFormMutation";
import galleryApi from "@/api/galleryApi";
import type { GalleryTheme } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
  const queryClient = useQueryClient();
  const createThemeDrawer = useDrawer();
  const [editingTheme, setEditingTheme] = useState<GalleryTheme | null>(null);
  const [activeThemeId, setActiveThemeId] = useState<number | null>(null);

  const { data: themes = [], isLoading } = useQuery<GalleryTheme[]>({
    queryKey: ["gallery-themes"],
    queryFn: () => galleryApi.getThemes().then((r) => r.data),
  });

  // Set first theme as active when loaded
  const displayedThemeId = activeThemeId ?? themes[0]?.id ?? null;
  const activeTheme = themes.find((t) => t.id === displayedThemeId);

  // ── Create theme ──────────────────────────────────────────────
  const {
    mutate: createTheme,
    isPending: isCreating,
    errorMessage: createError,
  } = useFormMutation({
    mutationFn: (values: ThemeFormValues) =>
      galleryApi.createTheme({ name: values.name, slug: values.slug }),
    invalidateKeys: [["gallery-themes"]],
    onSuccess: createThemeDrawer.onClose,
  });

  // ── Update theme ──────────────────────────────────────────────
  const {
    mutate: updateTheme,
    isPending: isUpdating,
    errorMessage: updateError,
  } = useFormMutation({
    mutationFn: ({ id, values }: { id: number; values: ThemeFormValues }) =>
      galleryApi.updateTheme(id, { name: values.name, slug: values.slug }),
    invalidateKeys: [["gallery-themes"]],
    onSuccess: () => setEditingTheme(null),
  });

  // ── Delete theme ──────────────────────────────────────────────
  const { mutate: deleteTheme } = useMutation({
    mutationFn: (id: number) => galleryApi.deleteTheme(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["gallery-themes"] }),
  });

  // ── Delete image ──────────────────────────────────────────────
  const { mutate: deleteImage } = useMutation({
    mutationFn: (id: number) => galleryApi.deleteImage(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["gallery-themes"] }),
  });

  return (
    <div className='flex flex-col h-full'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6 shrink-0'>
        <PageTilte text='Gallery' />
        <div className='flex gap-2'>
          <Button variant='outline' onClick={createThemeDrawer.onOpen}>
            <Plus className='w-4 h-4 mr-1' />
            Thêm tag
          </Button>
          <AddImagesDrawer />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : themes.length === 0 ? (
        <div className='flex-1 flex flex-col items-center justify-center gap-3 text-neutral-400'>
          <p className='text-sm'>Chưa có tag nào</p>
          <Button variant='outline' onClick={createThemeDrawer.onOpen}>
            Tạo tag đầu tiên
          </Button>
        </div>
      ) : (
        <div className='flex-1 overflow-y-auto flex flex-col gap-6'>
          {/* Theme tabs */}
          <div className='flex items-center gap-2 flex-wrap shrink-0'>
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setActiveThemeId(theme.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                  displayedThemeId === theme.id
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "border-neutral-200 hover:border-neutral-400 text-neutral-600",
                )}
              >
                {theme.name}
                <span className='ml-1.5 text-xs opacity-60'>
                  ({theme.images.length})
                </span>
              </button>
            ))}
          </div>

          {/* Active theme header */}
          {activeTheme && (
            <div className='flex items-center justify-between shrink-0'>
              <div>
                <h2 className='font-semibold text-neutral-900'>
                  {activeTheme.name}
                </h2>
                <p className='text-xs text-neutral-400'>
                  /{activeTheme.slug} · {activeTheme.images.length} ảnh
                </p>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => setEditingTheme(activeTheme)}
                  className='p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors'
                >
                  <Pencil className='w-4 h-4' />
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Xoá tag "${activeTheme.name}"? Tất cả ảnh trong tag này sẽ bị xoá.`,
                      )
                    ) {
                      deleteTheme(activeTheme.id);
                    }
                  }}
                  className='p-1.5 rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors'
                >
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>
            </div>
          )}

          {/* Images grid */}
          {activeTheme &&
            (activeTheme.images.length === 0 ? (
              <div className='flex items-center justify-center py-20 text-neutral-400 text-sm border-2 border-dashed border-neutral-200 rounded-2xl'>
                Tag này chưa có ảnh nào
              </div>
            ) : (
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                {activeTheme.images.map((image) => (
                  <div
                    key={image.id}
                    className='group relative aspect-square rounded-xl overflow-hidden bg-neutral-200'
                  >
                    <Image
                      src={image.thumbnailUrl}
                      alt=''
                      fill
                      className='object-cover'
                      sizes='(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw'
                    />
                    {/* Delete overlay */}
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center'>
                      <button
                        onClick={() => deleteImage(image.id)}
                        className='opacity-0 group-hover:opacity-100 p-2 rounded-full bg-red-500 text-white transition-opacity'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}

      {/* Create theme drawer */}
      <AppDrawer
        open={createThemeDrawer.open}
        onClose={createThemeDrawer.onClose}
        title='Thêm tag'
      >
        <GalleryThemeForm
          isPending={isCreating}
          errorMessage={createError}
          onSubmit={(values) => createTheme(values)}
          onCancel={createThemeDrawer.onClose}
        />
      </AppDrawer>

      {/* Edit theme drawer */}
      <AppDrawer
        open={!!editingTheme}
        onClose={() => setEditingTheme(null)}
        title='Chỉnh sửa tag'
      >
        {editingTheme && (
          <GalleryThemeForm
            defaultValues={{ name: editingTheme.name, slug: editingTheme.slug }}
            isPending={isUpdating}
            errorMessage={updateError}
            onSubmit={(values) => updateTheme({ id: editingTheme.id, values })}
            onCancel={() => setEditingTheme(null)}
          />
        )}
      </AppDrawer>
    </div>
  );
}
