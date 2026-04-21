"use client";

import { Button } from "@/components/ui/button";

type Props = {
  isPending: boolean;
  onCancel: () => void;
  submitLabel?: string;
  pendingLabel?: string;
};

export default function FormActions({
  isPending,
  onCancel,
  submitLabel = "Xác nhận",
  pendingLabel = "Đang lưu...",
}: Props) {
  return (
    <div className='flex gap-3 pt-4'>
      <Button type='submit' disabled={isPending} className='flex-1'>
        {isPending ? pendingLabel : submitLabel}
      </Button>
      <Button
        type='button'
        variant='outline'
        onClick={onCancel}
        disabled={isPending}
        className='flex-1'
      >
        Huỷ
      </Button>
    </div>
  );
}
