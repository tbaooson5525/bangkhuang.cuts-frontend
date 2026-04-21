"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import authApi from "@/api/authApi";
import Image from "next/image";

const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: (data: LoginForm) => authApi.login(data),
    onSuccess: () => router.push("/admin/dashboard"),
  });

  const errorMessage = isAxiosError(error)
    ? (error.response?.data?.message ?? "Lỗi server, vui lòng thử lại")
    : null;

  return (
    <div className='p-8 flex-1 flex justify-center items-center'>
      <Card className='w-full max-w-sm shadow-lg'>
        <CardHeader className='text-center'>
          <Image width={300} height={300} src='/images/logo.png' alt='' />
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                {/* Email */}
                <Controller
                  name='email'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Tên tài khoản
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder='Nhập tài khoản'
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Password */}
                <Controller
                  name='password'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Mật khẩu</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type='password'
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Server error */}
                {errorMessage && (
                  <p className='text-red-500 text-sm'>{errorMessage}</p>
                )}
              </FieldGroup>
            </FieldSet>

            <CardFooter className='px-0'>
              <Button
                onClick={form.handleSubmit((data) => login(data))}
                type='button'
                disabled={isPending}
                className='w-full'
              >
                {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </CardFooter>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
