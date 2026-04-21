"use client";
import authApi from "@/api/authApi";
import PageTitle from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useSignOut } from "@/hooks/useSignOut";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { LockKeyhole } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const resetPasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu cũ"),
    newPassword: z.string().min(6, "Mật khẩu mới tối thiểu 6 ký tự"),
    confirmNewPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmNewPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ChangePasswordPage() {
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const { mutate: signOut } = useSignOut();

  const {
    mutate: changePassword,
    isPending,
    error,
  } = useMutation({
    mutationFn: (data: ResetPasswordForm) =>
      authApi.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => signOut(),
  });

  const errorMessage = isAxiosError(error)
    ? (error.response?.data?.message ?? "Lỗi server, vui lòng thử lại")
    : null;

  const fields: {
    name: keyof ResetPasswordForm;
    label: string;
    placeholder: string;
  }[] = [
    {
      name: "oldPassword",
      label: "Mật khẩu cũ",
      placeholder: "Nhập mật khẩu cũ",
    },
    {
      name: "newPassword",
      label: "Mật khẩu mới",
      placeholder: "Nhập mật khẩu mới",
    },
    {
      name: "confirmNewPassword",
      label: "Xác nhận mật khẩu mới",
      placeholder: "Nhập lại mật khẩu mới",
    },
  ];

  return (
    <>
      <PageTitle text='Change Password' />
      <FieldGroup>
        <FieldSet>
          {fields.map(({ name, label, placeholder }) => (
            <Controller
              key={name}
              name={name}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={name}>{label}</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id={field.name}
                      type='password'
                      aria-invalid={fieldState.invalid}
                      placeholder={placeholder}
                    />
                    <InputGroupAddon>
                      <LockKeyhole />
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          ))}

          {/* Server error */}
          {errorMessage && (
            <p className='text-red-500 text-sm'>{errorMessage}</p>
          )}
        </FieldSet>

        <Button
          type='button'
          disabled={isPending}
          onClick={form.handleSubmit((data) => changePassword(data))}
        >
          {isPending ? "Đang lưu..." : "Xác nhận"}
        </Button>
      </FieldGroup>
    </>
  );
}
