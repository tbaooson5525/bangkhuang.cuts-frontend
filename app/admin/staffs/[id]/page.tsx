"use client";

import staffApi from "@/api/staffApi";
import ImageUploader from "@/components/image-uploader";
import PageTilte from "@/components/page-title";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Staff } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { CheckCircle, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import * as z from "zod";

const FALLBACK_IMAGE = "/images/logo.png";

const updateStaffSchema = z.object({
  name: z.string().min(1, "Tên nhân viên không được để trống"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type UpdateStaffForm = z.infer<typeof updateStaffSchema>;

export default function StaffDetailPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const staffId = Number(params.id);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploaderKey, setUploaderKey] = useState(0);

  const { data: staff, isLoading } = useQuery<Staff>({
    queryKey: ["staffDetail", staffId],
    queryFn: () => staffApi.getOne(staffId).then((res) => res.data),
    enabled: !!staffId,
  });

  const form = useForm<UpdateStaffForm>({
    resolver: zodResolver(updateStaffSchema),
    defaultValues: { name: "", description: "", isActive: true },
  });

  useEffect(() => {
    if (staff) {
      form.reset({
        name: staff.name,
        description: staff.description ?? "",
        isActive: staff.isActive,
      });
    }
  }, [staff, form]);

  const {
    mutate: updateStaff,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (data: UpdateStaffForm) =>
      staffApi.update(staffId, {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        avatar: avatarFile ?? undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffDetail", staffId] });
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
      setAvatarFile(null);
      setUploaderKey((k) => k + 1);
    },
  });

  const errorMessage = isAxiosError(error)
    ? (error.response?.data?.message ?? "Lỗi server, vui lòng thử lại")
    : null;

  const profileSrc = staff?.avatarUrl?.profile ?? FALLBACK_IMAGE;

  return (
    <div className='flex flex-col h-full'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-8 shrink-0'>
        <button
          onClick={() => router.back()}
          className='flex items-center justify-center w-9 h-9 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm'
        >
          <ChevronLeft className='w-5 h-5 text-neutral-600' />
        </button>
        <PageTilte text='Chi tiết nhân viên' />
      </div>

      {isLoading ? (
        <div className='flex-1 flex items-center justify-center'>
          <div className='w-8 h-8 rounded-full border-2 border-neutral-300 border-t-neutral-800 animate-spin' />
        </div>
      ) : !staff ? (
        <div className='flex-1 flex items-center justify-center text-neutral-500'>
          Không tìm thấy nhân viên
        </div>
      ) : (
        <div className='flex-1 overflow-y-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 max-w-4xl'>
            {/* Left — Avatar */}
            <div className='flex flex-col gap-4'>
              <div className='relative aspect-[3/4] rounded-3xl overflow-hidden bg-neutral-200 shadow-md'>
                <Image
                  src={profileSrc}
                  alt={staff.name}
                  fill
                  className='object-cover object-top'
                  sizes='320px'
                />
              </div>

              {/* Upload new avatar */}
              <div>
                <p className='text-sm font-medium text-neutral-600 mb-2'>
                  Đổi ảnh đại diện
                </p>
                <ImageUploader
                  key={uploaderKey}
                  multiple={false}
                  maxSizeMB={10}
                  onChange={(files) => setAvatarFile(files[0] ?? null)}
                />
              </div>
            </div>

            {/* Right — Form */}
            <div className='flex flex-col gap-6'>
              <div>
                <h2 className='text-2xl font-bold text-neutral-900'>
                  {staff.name}
                </h2>
                <p className='text-sm text-neutral-400 mt-0.5'>
                  ID #{staff.id}
                </p>
              </div>

              <FieldGroup>
                <FieldSet>
                  <Controller
                    name='name'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Tên nhân viên
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          type='text'
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name='description'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Giới thiệu</FieldLabel>
                        <Textarea
                          {...field}
                          id={field.name}
                          rows={4}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name='isActive'
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <div className='flex items-center justify-between'>
                          <FieldLabel htmlFor='isActive'>
                            Trạng thái hoạt động
                          </FieldLabel>
                          <Switch
                            id='isActive'
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      </Field>
                    )}
                  />
                </FieldSet>

                {errorMessage && (
                  <p className='text-red-500 text-sm'>{errorMessage}</p>
                )}

                {isSuccess && (
                  <div className='flex items-center gap-2 text-green-600 text-sm'>
                    <CheckCircle className='w-4 h-4' />
                    Cập nhật thành công
                  </div>
                )}
              </FieldGroup>

              <div className='flex gap-3 pt-2'>
                <button
                  type='button'
                  disabled={isPending}
                  onClick={form.handleSubmit((data) => updateStaff(data))}
                  className='px-6 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isPending ? "Đang lưu..." : "Lưu thay đổi"}
                </button>

                <button
                  type='button'
                  onClick={() => {
                    form.reset({
                      name: staff.name,
                      description: staff.description ?? "",
                    });
                    setAvatarFile(null);
                  }}
                  className='px-6 py-2.5 rounded-full border border-neutral-200 text-neutral-600 text-sm font-medium hover:bg-neutral-50 transition-colors'
                >
                  Huỷ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
