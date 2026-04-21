"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AppDrawer from "@/components/shared/AppDrawer";
import ImageUploader from "@/components/shared/ImageUploader";
import ServerError from "@/components/shared/ServerError";
import FormActions from "@/components/shared/FormActions";
import { useDrawer } from "@/hooks/useDrawer";
import { useFormMutation } from "@/hooks/useFormMutation";
import galleryApi from "@/api/galleryApi";
import type { GalleryTheme } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AddImagesDrawer() {
  const drawer = useDrawer();
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { data: themes = [], isLoading: loadingThemes } = useQuery<
    GalleryTheme[]
  >({
    queryKey: ["gallery-themes"],
    queryFn: () => galleryApi.getThemes().then((r) => r.data),
    enabled: drawer.open,
  });

  const { mutate, isPending } = useFormMutation({
    mutationFn: async () => {
      if (!selectedThemeId) throw new Error("Chưa chọn tag");
      if (imageFiles.length === 0) throw new Error("Chưa chọn ảnh");

      const sigRes = await galleryApi.getUploadSignature("gallery");
      const sig = sigRes.data;

      const publicIds = await galleryApi.uploadManyToCloudinary(imageFiles, {
        signature: sig.signature,
        timestamp: sig.timestamp,
        apiKey: sig.apiKey,
        cloudName: sig.cloudName,
        folder: sig.folder,
      });

      return galleryApi.addImages({ themeId: selectedThemeId, publicIds });
    },
    invalidateKeys: [["gallery-themes"]],
    onSuccess: () => {
      handleClose();
      toast.success(`Đã tải lên ${imageFiles.length} ảnh thành công!`);
    },
    onError: (msg) => {
      toast.error(msg);
    },
  });

  function handleClose() {
    drawer.onClose();
    setSelectedThemeId(null);
    setImageFiles([]);
    setUploaderKey((k) => k + 1);
    setValidationError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedThemeId) {
      setValidationError("Vui lòng chọn tag");
      return;
    }
    if (imageFiles.length === 0) {
      setValidationError("Vui lòng chọn ít nhất 1 ảnh");
      return;
    }
    setValidationError(null);
    mutate(undefined as never);
  }

  return (
    <>
      <Button onClick={drawer.onOpen}>
        <Upload className='w-4 h-4 mr-2' />
        Thêm ảnh
      </Button>

      <AppDrawer
        open={drawer.open}
        onClose={handleClose}
        title='Thêm ảnh'
        isLoading={isPending}
      >
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          {/* Tag selection */}
          <div className='flex flex-col gap-2'>
            <p className='text-sm font-medium text-neutral-700 dark:text-white/70'>
              Chọn tag
            </p>
            {loadingThemes ? (
              <div className='w-5 h-5 rounded-full border-2 border-neutral-300 border-t-neutral-800 animate-spin' />
            ) : themes.length === 0 ? (
              <p className='text-sm text-neutral-400 dark:text-white/30'>
                Chưa có tag nào. Hãy tạo tag trước.
              </p>
            ) : (
              <div className='flex flex-wrap gap-2'>
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    type='button'
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm border transition-colors",
                      selectedThemeId === theme.id
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                        : "border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/30 text-neutral-600 dark:text-white/60",
                    )}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Image upload */}
          <div className='flex flex-col gap-2'>
            <p className='text-sm font-medium text-neutral-700 dark:text-white/70'>
              Chọn ảnh ({imageFiles.length} ảnh)
            </p>
            <ImageUploader
              key={uploaderKey}
              multiple
              maxSizeMB={10}
              maxFiles={20}
              onChange={setImageFiles}
            />
          </div>

          <ServerError message={validationError} />

          <FormActions
            isPending={isPending}
            onCancel={handleClose}
            submitLabel='Tải lên'
            pendingLabel='Đang tải lên...'
          />
        </form>
      </AppDrawer>
    </>
  );
}
