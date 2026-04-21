import {
  AlertCircleIcon,
  ImageIcon,
  ImageUpIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useFileUpload, type FileMetadata } from "@/hooks/useFileUpload";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

type Props = {
  multiple?: boolean;
  maxSizeMB?: number;
  maxFiles?: number;
  initialFiles?: FileMetadata[];
  onChange?: (files: File[]) => void;
};

export default function ImageUploader({
  multiple = false,
  maxSizeMB = 5,
  maxFiles = 6,
  initialFiles = [],
  onChange,
}: Props) {
  const maxSize = maxSizeMB * 1024 * 1024;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
    maxSize,
    maxFiles: multiple ? maxFiles : 1,
    multiple,
    initialFiles,
  });

  // Dùng useEffect thay vì onFilesChange để tránh setState trong render
  useEffect(() => {
    const actualFiles = files
      .map((f) => (f.file instanceof File ? f.file : null))
      .filter(Boolean) as File[];
    onChangeRef.current?.(actualFiles);
  }, [files]);

  const previewUrl = files[0]?.preview || null;

  if (!multiple) {
    return (
      <div className='flex flex-col gap-2'>
        <div className='relative'>
          <div
            className='relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-input border-dashed p-4 transition-colors hover:bg-accent/50 has-disabled:pointer-events-none has-[input:focus]:border-ring has-[img]:border-none has-disabled:opacity-50 has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50'
            data-dragging={isDragging || undefined}
            onClick={openFileDialog}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            role='button'
            tabIndex={-1}
          >
            <input
              {...getInputProps()}
              aria-label='Upload file'
              className='sr-only'
            />
            {previewUrl ? (
              <div className='absolute inset-0'>
                <img
                  alt={files[0]?.file?.name || "Uploaded image"}
                  className='size-full object-cover'
                  src={previewUrl}
                />
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center px-4 py-3 text-center'>
                <div
                  aria-hidden='true'
                  className='mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background'
                >
                  <ImageUpIcon className='size-4 opacity-60' />
                </div>
                <p className='mb-1.5 font-medium text-sm'>
                  Drop your image here or click to browse
                </p>
                <p className='text-muted-foreground text-xs'>
                  Max size: {maxSizeMB}MB
                </p>
              </div>
            )}
          </div>
          {previewUrl && (
            <div className='absolute top-4 right-4'>
              <button
                aria-label='Remove image'
                className='z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-none transition-[color,box-shadow] hover:bg-black/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50'
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(files[0]?.id);
                }}
                type='button'
              >
                <XIcon aria-hidden='true' className='size-4' />
              </button>
            </div>
          )}
        </div>
        {errors.length > 0 && (
          <div
            className='flex items-center gap-1 text-destructive text-xs'
            role='alert'
          >
            <AlertCircleIcon className='size-3 shrink-0' />
            <span>{errors[0]}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      <div
        className='relative flex min-h-52 flex-col items-center not-data-[files]:justify-center overflow-hidden rounded-xl border border-input border-dashed p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50'
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          {...getInputProps()}
          aria-label='Upload image file'
          className='sr-only'
        />
        {files.length > 0 ? (
          <div className='flex w-full flex-col gap-3'>
            <div className='flex items-center justify-between gap-2'>
              <h3 className='truncate font-medium text-sm'>
                Uploaded Files ({files.length})
              </h3>
              <Button
                disabled={files.length >= maxFiles}
                onClick={openFileDialog}
                size='sm'
                variant='outline'
              >
                <UploadIcon
                  aria-hidden='true'
                  className='-ms-0.5 size-3.5 opacity-60'
                />
                Add more
              </Button>
            </div>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
              {files.map((file) => (
                <div
                  className='relative aspect-square rounded-md bg-accent'
                  key={file.id}
                >
                  <img
                    alt={file.file.name}
                    className='size-full rounded-[inherit] object-cover'
                    src={file.preview}
                  />
                  <Button
                    aria-label='Remove image'
                    className='-top-2 -right-2 absolute size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background'
                    onClick={() => removeFile(file.id)}
                    size='icon'
                  >
                    <XIcon className='size-3.5' />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center px-4 py-3 text-center'>
            <div
              aria-hidden='true'
              className='mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background'
            >
              <ImageIcon className='size-4 opacity-60' />
            </div>
            <p className='mb-1.5 font-medium text-sm'>Drop your images here</p>
            <p className='text-muted-foreground text-xs'>
              SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
            </p>
            <Button className='mt-4' onClick={openFileDialog} variant='outline'>
              <UploadIcon aria-hidden='true' className='-ms-1 opacity-60' />
              Select images
            </Button>
          </div>
        )}
      </div>
      {errors.length > 0 && (
        <div
          className='flex items-center gap-1 text-destructive text-xs'
          role='alert'
        >
          <AlertCircleIcon className='size-3 shrink-0' />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
