"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

type Options<TData, TVariables> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  invalidateKeys?: string[][];
  onSuccess?: (data: TData) => void;
  onError?: (errorMessage: string) => void;
};

export function useFormMutation<TData = unknown, TVariables = unknown>({
  mutationFn,
  invalidateKeys = [],
  onSuccess,
  onError,
}: Options<TData, TVariables>) {
  const queryClient = useQueryClient();

  const mutation = useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: (data) => {
      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key }),
      );
      onSuccess?.(data);
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? (error.response?.data?.message ?? "Lỗi server, vui lòng thử lại")
        : "Lỗi server, vui lòng thử lại";
      onError?.(message);
    },
  });

  const errorMessage = isAxiosError(mutation.error)
    ? (mutation.error.response?.data?.message ?? "Lỗi server, vui lòng thử lại")
    : null;

  return { ...mutation, errorMessage };
}
