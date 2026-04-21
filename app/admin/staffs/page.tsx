"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import AppDrawer from "@/components/shared/AppDrawer";
import RowActions from "@/components/shared/RowActions";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import StaffForm, { StaffFormValues } from "@/components/staffs/StaffForm";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useDrawer } from "@/hooks/useDrawer";
import { useFormMutation } from "@/hooks/useFormMutation";
import staffApi from "@/api/staffApi";
import { FALLBACK_IMAGE } from "@/lib/constants/images";
import type { Staff } from "@/lib/types";
import PageTitle from "@/components/shared/PageTitle";

const MAX_DESC = 80;

function truncate(text: string | null | undefined): string {
  if (!text) return "—";
  return text.length > MAX_DESC ? text.slice(0, MAX_DESC) + "…" : text;
}

export default function StaffsPage() {
  const queryClient = useQueryClient();
  const createDrawer = useDrawer();
  const editDrawer = useDrawer();
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [confirmEdit, setConfirmEdit] = useState<{
    open: boolean;
    values: StaffFormValues | null;
    avatarFile: File | null;
  }>({ open: false, values: null, avatarFile: null });

  const { data: staffList = [], isLoading } = useQuery<Staff[]>({
    queryKey: ["staffs"],
    queryFn: () => staffApi.getAll().then((res) => res.data),
  });

  // Create
  const {
    mutate: createStaff,
    isPending: isCreating,
    errorMessage: createError,
  } = useFormMutation({
    mutationFn: ({
      values,
      avatarFile,
    }: {
      values: StaffFormValues;
      avatarFile: File | null;
    }) =>
      staffApi.create({
        name: values.name,
        description: values.description,
        avatar: avatarFile ?? undefined,
      }),
    invalidateKeys: [["staffs"]],
    onSuccess: () => {
      createDrawer.onClose();
      setUploaderKey((k) => k + 1);
      toast.success("Thêm nhân viên thành công!");
    },
    onError: (msg) => {
      toast.error(msg);
    },
  });

  // Update
  const {
    mutate: updateStaff,
    isPending: isUpdating,
    errorMessage: updateError,
  } = useFormMutation({
    mutationFn: ({
      values,
      avatarFile,
    }: {
      values: StaffFormValues;
      avatarFile: File | null;
    }) =>
      staffApi.update(editingStaff!.id, {
        name: values.name,
        description: values.description,
        isActive: values.isActive,
        avatar: avatarFile ?? undefined,
      }),
    invalidateKeys: [["staffs"]],
    onSuccess: () => {
      editDrawer.onClose();
      setEditingStaff(null);
      setUploaderKey((k) => k + 1);
      toast.success("Cập nhật nhân viên thành công!");
    },
    onError: (msg) => {
      toast.error(msg);
    },
  });

  // Toggle active
  const { mutate: toggleActive } = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      staffApi.update(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staffs"] }),
  });

  // Delete
  const { mutate: deleteStaff } = useMutation({
    mutationFn: (id: number) => staffApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
      toast.success("Đã xoá nhân viên.");
    },
    onError: () => {
      toast.error("Không thể xoá nhân viên. Vui lòng thử lại.");
    },
  });

  const openEdit = (staff: Staff) => {
    setEditingStaff(staff);
    editDrawer.onOpen();
  };

  const handleEditSubmit = (
    values: StaffFormValues,
    avatarFile: File | null,
  ) => {
    setConfirmEdit({ open: true, values, avatarFile });
  };

  const handleConfirmEdit = () => {
    if (confirmEdit.values) {
      updateStaff({
        values: confirmEdit.values,
        avatarFile: confirmEdit.avatarFile,
      });
    }
    setConfirmEdit({ open: false, values: null, avatarFile: null });
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <PageTitle text='Nhân viên' />
        <Button onClick={createDrawer.onOpen}>
          <Plus className='w-4 h-4 mr-1.5' />
          Thêm nhân viên
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner />
      ) : staffList.length === 0 ? (
        <div className='flex items-center justify-center py-20 text-neutral-400 dark:text-white/30 text-sm'>
          Chưa có nhân viên nào
        </div>
      ) : (
        <div className='rounded-2xl border border-neutral-200 dark:border-white/[0.08] overflow-hidden'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='bg-neutral-50 dark:bg-white/[0.03] border-b border-neutral-200 dark:border-white/[0.08]'>
                <th className='text-left px-5 py-3 font-medium text-neutral-500 dark:text-white/40'>
                  Nhân viên
                </th>
                <th className='text-left px-5 py-3 font-medium text-neutral-500 dark:text-white/40 hidden md:table-cell'>
                  Giới thiệu
                </th>
                <th className='text-center px-5 py-3 font-medium text-neutral-500 dark:text-white/40'>
                  Kích hoạt
                </th>
                <th className='px-5 py-3 w-20' />
              </tr>
            </thead>
            <tbody className='divide-y divide-neutral-100 dark:divide-white/[0.05]'>
              {staffList.map((staff) => {
                const avatarSrc = staff.avatarUrl?.avatar ?? FALLBACK_IMAGE;
                return (
                  <tr
                    key={staff.id}
                    className='hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors'
                  >
                    <td className='px-5 py-3'>
                      <div className='flex items-center gap-3'>
                        <div className='relative w-9 h-9 rounded-full overflow-hidden bg-neutral-200 dark:bg-white/[0.08] shrink-0'>
                          <Image
                            src={
                              typeof avatarSrc === "string"
                                ? avatarSrc
                                : avatarSrc.src
                            }
                            alt={staff.name}
                            fill
                            className='object-cover'
                            sizes='36px'
                          />
                        </div>
                        <span className='font-medium text-neutral-900 dark:text-white'>
                          {staff.name}
                        </span>
                      </div>
                    </td>
                    <td className='px-5 py-3 text-neutral-500 dark:text-white/50 hidden md:table-cell max-w-xs'>
                      <span className='block truncate'>
                        {truncate(staff.description)}
                      </span>
                    </td>
                    <td className='px-5 py-3 text-center'>
                      <Switch
                        checked={staff.isActive}
                        onCheckedChange={(checked) =>
                          toggleActive({ id: staff.id, isActive: checked })
                        }
                      />
                    </td>
                    <td className='px-5 py-3'>
                      <RowActions
                        onEdit={() => openEdit(staff)}
                        onDelete={() => deleteStaff(staff.id)}
                        deleteTitle='Xoá nhân viên?'
                        deleteDescription={`Nhân viên "${staff.name}" sẽ bị xoá. Hành động này không thể hoàn tác.`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Drawer */}
      <AppDrawer
        open={createDrawer.open}
        onClose={createDrawer.onClose}
        title='Thêm nhân viên'
        isLoading={isCreating}
      >
        <StaffForm
          key={`create-${uploaderKey}`}
          errorMessage={createError}
          isPending={isCreating}
          onSubmit={(values, avatarFile) => createStaff({ values, avatarFile })}
          onCancel={createDrawer.onClose}
        />
      </AppDrawer>

      {/* Edit Drawer */}
      <AppDrawer
        open={editDrawer.open}
        onClose={() => {
          editDrawer.onClose();
          setEditingStaff(null);
        }}
        title='Chỉnh sửa nhân viên'
        isLoading={isUpdating}
      >
        {editingStaff && (
          <StaffForm
            key={`edit-${editingStaff.id}-${uploaderKey}`}
            errorMessage={updateError}
            defaultValues={{
              name: editingStaff.name,
              description: editingStaff.description ?? "",
              isActive: editingStaff.isActive,
            }}
            showIsActive
            isPending={isUpdating}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              editDrawer.onClose();
              setEditingStaff(null);
            }}
          />
        )}
      </AppDrawer>

      {/* Edit confirmation */}
      <ConfirmDialog
        open={confirmEdit.open}
        onOpenChange={(o) => setConfirmEdit((s) => ({ ...s, open: o }))}
        title='Xác nhận chỉnh sửa?'
        description='Bạn có chắc muốn lưu thay đổi cho nhân viên này không?'
        confirmLabel='Lưu thay đổi'
        onConfirm={handleConfirmEdit}
      />
    </div>
  );
}
