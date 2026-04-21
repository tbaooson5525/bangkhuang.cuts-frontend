"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  deleteTitle?: string;
  deleteDescription?: string;
};

export default function RowActions({
  onEdit,
  onDelete,
  deleteTitle = "Xác nhận xoá",
  deleteDescription = "Hành động này không thể hoàn tác.",
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <div className='flex items-center justify-end gap-1'>
        <button
          onClick={onEdit}
          className='p-1.5 rounded-lg text-neutral-400 dark:text-white/30 hover:bg-neutral-100 dark:hover:bg-white/[0.06] hover:text-neutral-700 dark:hover:text-white transition-colors'
        >
          <Pencil className='w-4 h-4' />
        </button>
        <button
          onClick={() => setConfirmOpen(true)}
          className='p-1.5 rounded-lg text-neutral-400 dark:text-white/30 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors'
        >
          <Trash2 className='w-4 h-4' />
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={deleteTitle}
        description={deleteDescription}
        confirmLabel='Xoá'
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete();
        }}
      />
    </>
  );
}
