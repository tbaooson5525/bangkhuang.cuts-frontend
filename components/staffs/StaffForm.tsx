"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import ImageUploader from "@/components/shared/ImageUploader";
import FormActions from "@/components/shared/FormActions";
import ServerError from "@/components/shared/ServerError";

const staffSchema = z.object({
  name: z.string().min(1, "Tên nhân viên không được để trống"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export type StaffFormValues = z.infer<typeof staffSchema>;

type Props = {
  defaultValues?: Partial<StaffFormValues>;
  showIsActive?: boolean;
  isPending: boolean;
  errorMessage: string | null;
  onSubmit: (values: StaffFormValues, avatarFile: File | null) => void;
  onCancel: () => void;
  uploaderKey?: number;
};

export default function StaffForm({
  defaultValues,
  showIsActive = false,
  isPending,
  errorMessage,
  onSubmit,
  onCancel,
  uploaderKey = 0,
}: Props) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      ...defaultValues,
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => onSubmit(values, avatarFile))}
      className='flex flex-col gap-4'
    >
      <FieldGroup>
        <FieldSet>
          <Field>
            <FieldLabel>Ảnh đại diện</FieldLabel>
            <ImageUploader
              key={uploaderKey}
              multiple={false}
              maxSizeMB={10}
              onChange={(files) => setAvatarFile(files[0] ?? null)}
            />
          </Field>

          <Controller
            name='name'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='staff-name'>Tên nhân viên</FieldLabel>
                <Input
                  {...field}
                  id='staff-name'
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
                <FieldLabel htmlFor='staff-desc'>Giới thiệu</FieldLabel>
                <Textarea
                  {...field}
                  id='staff-desc'
                  rows={4}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {showIsActive && (
            <Controller
              name='isActive'
              control={form.control}
              render={({ field }) => (
                <Field>
                  <div className='flex items-center justify-between'>
                    <FieldLabel>Trạng thái hoạt động</FieldLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </Field>
              )}
            />
          )}
        </FieldSet>

        <ServerError message={errorMessage} />
      </FieldGroup>

      <FormActions isPending={isPending} onCancel={onCancel} />
    </form>
  );
}
