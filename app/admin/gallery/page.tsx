"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import AppDrawer from "@/components/shared/AppDrawer";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
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
import PageTitle from "@/components/shared/PageTitle";

export default function GalleryPage() {
  const queryClient = useQueryClient();
  const createThemeDrawer = useDrawer();
  const [editingTheme, setEditingTheme] = useState<GalleryTheme | null>(null);
  const [activeThemeId, setActiveThemeId] = useState<number | null>(null);

  const [confirmDeleteTheme, setConfirmDeleteTheme] =
    useState<GalleryTheme | null>(null);
  const [confirmDeleteImage, setConfirmDeleteImage] = useState<number | null>(
    null,
  );
  const [confirmEditTheme, setConfirmEditTheme] = useState<{
    open: boolean;
    values: ThemeFormValues | null;
  }>({ open: false, values: null });

  const { data: themes = [], isLoading } = useQuery<GalleryTheme[]>({
    queryKey: ["gallery-themes"],
    queryFn: () => galleryApi.getThemes().then((r) => r.data),
  });

  const displayedThemeId = activeThemeId ?? themes[0]?.id ?? null;
  const activeTheme = themes.find((t) => t.id === displayedThemeId);

  const {
    mutate: createTheme,
    isPending: isCreating,
    errorMessage: createError,
  } = useFormMutation({
    mutationFn: (values: ThemeFormValues) =>
      galleryApi.createTheme({ name: values.name, slug: values.slug }),
    invalidateKeys: [["gallery-themes"]],
    onSuccess: () => {
      createThemeDrawer.onClose();
      toast.success("Tạo tag thành công!");
    },
    onError: (msg) => {
      toast.error(msg);
    },
  });

  const {
    mutate: updateTheme,
    isPending: isUpdating,
    errorMessage: updateError,
  } = useFormMutation({
    mutationFn: ({ id, values }: { id: number; values: ThemeFormValues }) =>
      galleryApi.updateTheme(id, { name: values.name, slug: values.slug }),
    invalidateKeys: [["gallery-themes"]],
    onSuccess: () => {
      setEditingTheme(null);
      toast.success("Cập nhật tag thành công!");
    },
    onError: (msg) => {
      toast.error(msg);
    },
  });

  const { mutate: deleteTheme } = useMutation({
    mutationFn: (id: number) => galleryApi.deleteTheme(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-themes"] });
      toast.success("Đã xoá tag.");
    },
    onError: () => {
      toast.error("Không thể xoá tag. Vui lòng thử lại.");
    },
  });

  const { mutate: deleteImage } = useMutation({
    mutationFn: (id: number) => galleryApi.deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-themes"] });
      toast.success("Đã xoá ảnh.");
    },
    onError: () => {
      toast.error("Không thể xoá ảnh. Vui lòng thử lại.");
    },
  });

  const handleEditSubmit = (values: ThemeFormValues) => {
    setConfirmEditTheme({ open: true, values });
  };

  const handleConfirmEditTheme = () => {
    if (confirmEditTheme.values && editingTheme) {
      updateTheme({ id: editingTheme.id, values: confirmEditTheme.values });
    }
    setConfirmEditTheme({ open: false, values: null });
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <PageTitle text='Gallery' />
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
        <div className='flex flex-col items-center justify-center gap-3 py-20 text-neutral-400 dark:text-white/30'>
          <p className='text-sm'>Chưa có tag nào</p>
          <Button variant='outline' onClick={createThemeDrawer.onOpen}>
            Tạo tag đầu tiên
          </Button>
        </div>
      ) : (
        <div className='flex flex-col gap-6'>
          {/* Theme tabs */}
          <div className='flex items-center gap-2 flex-wrap'>
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setActiveThemeId(theme.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                  displayedThemeId === theme.id
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                    : "border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/30 text-neutral-600 dark:text-white/60",
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
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='font-semibold text-neutral-900 dark:text-white'>
                  {activeTheme.name}
                </h2>
                <p className='text-xs text-neutral-400 dark:text-white/30'>
                  /{activeTheme.slug} · {activeTheme.images.length} ảnh
                </p>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => setEditingTheme(activeTheme)}
                  className='p-1.5 rounded-lg text-neutral-400 dark:text-white/30 hover:bg-neutral-100 dark:hover:bg-white/[0.06] hover:text-neutral-700 dark:hover:text-white transition-colors'
                >
                  <Pencil className='w-4 h-4' />
                </button>
                <button
                  onClick={() => setConfirmDeleteTheme(activeTheme)}
                  className='p-1.5 rounded-lg text-neutral-400 dark:text-white/30 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors'
                >
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>
            </div>
          )}

          {/* Images grid */}
          {activeTheme &&
            (activeTheme.images.length === 0 ? (
              <div className='flex items-center justify-center py-20 text-neutral-400 dark:text-white/30 text-sm border-2 border-dashed border-neutral-200 dark:border-white/[0.08] rounded-2xl'>
                Tag này chưa có ảnh nào
              </div>
            ) : (
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                {activeTheme.images.map((image) => (
                  <div
                    key={image.id}
                    className='group relative aspect-square rounded-xl overflow-hidden bg-neutral-200 dark:bg-white/[0.06]'
                  >
                    <Image
                      src={image.thumbnailUrl}
                      alt=''
                      fill
                      className='object-cover'
                      sizes='(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw'
                    />
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center'>
                      <button
                        onClick={() => setConfirmDeleteImage(image.id)}
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
        isLoading={isCreating}
      >
        <GalleryThemeForm
          isPending={isCreating}
          onSubmit={(values) => createTheme(values)}
          onCancel={createThemeDrawer.onClose}
          errorMessage={updateError}
        />
      </AppDrawer>

      {/* Edit theme drawer */}
      <AppDrawer
        open={!!editingTheme}
        onClose={() => setEditingTheme(null)}
        title='Chỉnh sửa tag'
        isLoading={isUpdating}
      >
        {editingTheme && (
          <GalleryThemeForm
            errorMessage={createError}
            defaultValues={{ name: editingTheme.name, slug: editingTheme.slug }}
            isPending={isUpdating}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingTheme(null)}
          />
        )}
      </AppDrawer>

      {/* Confirm: delete theme */}
      <ConfirmDialog
        open={!!confirmDeleteTheme}
        onOpenChange={(o) => !o && setConfirmDeleteTheme(null)}
        title='Xoá tag?'
        description={`Tag "${confirmDeleteTheme?.name}" và toàn bộ ảnh trong tag sẽ bị xoá. Hành động này không thể hoàn tác.`}
        confirmLabel='Xoá tag'
        onConfirm={() => {
          if (confirmDeleteTheme) deleteTheme(confirmDeleteTheme.id);
          setConfirmDeleteTheme(null);
        }}
      />

      {/* Confirm: delete image */}
      <ConfirmDialog
        open={confirmDeleteImage !== null}
        onOpenChange={(o) => !o && setConfirmDeleteImage(null)}
        title='Xoá ảnh?'
        description='Ảnh này sẽ bị xoá khỏi gallery. Hành động này không thể hoàn tác.'
        confirmLabel='Xoá ảnh'
        onConfirm={() => {
          if (confirmDeleteImage !== null) deleteImage(confirmDeleteImage);
          setConfirmDeleteImage(null);
        }}
      />

      {/* Confirm: edit theme */}
      <ConfirmDialog
        open={confirmEditTheme.open}
        onOpenChange={(o) => setConfirmEditTheme((s) => ({ ...s, open: o }))}
        title='Xác nhận chỉnh sửa?'
        description='Bạn có chắc muốn lưu thay đổi cho tag này không?'
        confirmLabel='Lưu thay đổi'
        onConfirm={handleConfirmEditTheme}
      />
    </div>
  );
}
