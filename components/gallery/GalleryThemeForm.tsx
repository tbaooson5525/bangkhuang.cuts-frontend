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
import FormActions from "@/components/shared/FormActions";
import ServerError from "@/components/shared/ServerError";

const themeSchema = z.object({
  name: z.string().min(1, "Tên tag không được để trống"),
  slug: z
    .string()
    .min(1, "Slug không được để trống")
    .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
});

export type ThemeFormValues = z.infer<typeof themeSchema>;

type Props = {
  defaultValues?: Partial<ThemeFormValues>;
  isPending: boolean;
  errorMessage: string | null;
  onSubmit: (values: ThemeFormValues) => void;
  onCancel: () => void;
};

export default function GalleryThemeForm({
  defaultValues,
  isPending,
  errorMessage,
  onSubmit,
  onCancel,
}: Props) {
  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeSchema),
    defaultValues: { name: "", slug: "", ...defaultValues },
  });

  useEffect(() => {
    if (defaultValues) form.reset({ name: "", slug: "", ...defaultValues });
  }, [defaultValues, form]);

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    if (
      !form.getValues("slug") ||
      form.getValues("slug") === slugify(form.getValues("name"))
    ) {
      form.setValue("slug", slugify(name));
    }
  };

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
                <FieldLabel htmlFor='theme-name'>Tên tag</FieldLabel>
                <Input
                  {...field}
                  id='theme-name'
                  placeholder='VD: Kiểu Hàn Quốc'
                  onChange={handleNameChange}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name='slug'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='theme-slug'>Slug</FieldLabel>
                <Input
                  {...field}
                  id='theme-slug'
                  placeholder='vd: kieu-han-quoc'
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldSet>

        <ServerError message={errorMessage} />
      </FieldGroup>

      <FormActions isPending={isPending} onCancel={onCancel} />
    </form>
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
