"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import AppDrawer from "@/components/shared/AppDrawer";
import ImageUploader from "@/components/image-uploader";
import ServerError from "@/components/shared/ServerError";
import FormActions from "@/components/shared/FormActions";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
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

  const { mutate, isPending, errorMessage } = useFormMutation({
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
      drawer.onClose();
      setSelectedThemeId(null);
      setImageFiles([]);
      setUploaderKey((k) => k + 1);
      setValidationError(null);
    },
  });

  const handleSubmit = () => {
    if (!selectedThemeId) {
      setValidationError("Vui lòng chọn tag");
      return;
    }
    if (imageFiles.length === 0) {
      setValidationError("Vui lòng chọn ít nhất 1 ảnh");
      return;
    }
    setValidationError(null);
    mutate(undefined as any);
  };

  const handleClose = () => {
    drawer.onClose();
    setSelectedThemeId(null);
    setImageFiles([]);
    setUploaderKey((k) => k + 1);
    setValidationError(null);
  };

  return (
    <>
      <Button onClick={drawer.onOpen}>
        <Upload className='w-4 h-4 mr-2' />
        Thêm ảnh
      </Button>

      <AppDrawer open={drawer.open} onClose={handleClose} title='Thêm ảnh'>
        <div className='flex flex-col gap-5'>
          {/* Tag selection */}
          <div className='flex flex-col gap-2'>
            <p className='text-sm font-medium text-neutral-700'>Chọn tag</p>
            {loadingThemes ? (
              <LoadingSpinner size='sm' />
            ) : themes.length === 0 ? (
              <p className='text-sm text-neutral-400'>
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
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "border-neutral-200 hover:border-neutral-400",
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
            <p className='text-sm font-medium text-neutral-700'>
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

          <ServerError message={validationError ?? errorMessage} />

          <FormActions
            isPending={isPending}
            onCancel={handleClose}
            submitLabel={isPending ? "Đang tải lên..." : "Tải lên"}
            pendingLabel='Đang tải lên...'
          />
        </div>
      </AppDrawer>
    </>
  );
}
