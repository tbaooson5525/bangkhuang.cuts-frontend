"use client";

import { useEffect } from "react";
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
import FormActions from "@/components/shared/FormActions";

const serviceSchema = z.object({
  name: z.string().min(1, "Tên dịch vụ không được để trống"),
  price: z
    .string()
    .min(1, "Vui lòng nhập giá")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Giá phải lớn hơn 0"),
  description: z.string().optional(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

type Props = {
  defaultValues?: Partial<ServiceFormValues>;
  isPending: boolean;
  errorMessage?: string | null;
  onSubmit: (values: ServiceFormValues) => void;
  onCancel: () => void;
};

export default function ServiceForm({
  defaultValues,
  isPending,
  onSubmit,
  onCancel,
}: Props) {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { name: "", price: "", description: "", ...defaultValues },
  });

  useEffect(() => {
    if (defaultValues)
      form.reset({ name: "", price: "", description: "", ...defaultValues });
  }, [defaultValues, form]);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='flex flex-col gap-4'
    >
      <FieldGroup>
        <FieldSet>
          <Controller
            name='name'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='service-name'>Tên dịch vụ</FieldLabel>
                <Input
                  {...field}
                  id='service-name'
                  placeholder='VD: Cắt tóc, Gội đầu...'
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name='price'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='service-price'>Giá (VNĐ)</FieldLabel>
                <Input
                  {...field}
                  id='service-price'
                  type='text'
                  inputMode='numeric'
                  placeholder='VD: 80000'
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
                <FieldLabel htmlFor='service-desc'>
                  Mô tả{" "}
                  <span className='text-neutral-400 font-normal'>
                    (không bắt buộc)
                  </span>
                </FieldLabel>
                <Textarea
                  {...field}
                  id='service-desc'
                  placeholder='Mô tả ngắn về dịch vụ'
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldSet>
      </FieldGroup>

      <FormActions isPending={isPending} onCancel={onCancel} />
    </form>
  );
}
