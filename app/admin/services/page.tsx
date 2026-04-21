"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import AppDrawer from "@/components/shared/AppDrawer";
import RowActions from "@/components/shared/RowActions";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import ServiceForm, {
  ServiceFormValues,
} from "@/components/services/ServiceForm";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useDrawer } from "@/hooks/useDrawer";
import { useFormMutation } from "@/hooks/useFormMutation";
import serviceApi from "@/api/serviceApi";
import type { Service } from "@/lib/types";
import PageTitle from "@/components/shared/PageTitle";

export default function ServicesPage() {
  const queryClient = useQueryClient();
  const createDrawer = useDrawer();
  const editDrawer = useDrawer();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [confirmEdit, setConfirmEdit] = useState<{
    open: boolean;
    values: ServiceFormValues | null;
  }>({ open: false, values: null });

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: () => serviceApi.getAll().then((r) => r.data),
  });

  // Create
  const { mutate: createService, isPending: isCreating } = useFormMutation({
    mutationFn: (values: ServiceFormValues) =>
      serviceApi.create({
        name: values.name,
        price: Number(values.price),
        description: values.description,
      }),
    invalidateKeys: [["services"]],
    onSuccess: () => {
      createDrawer.onClose();
      toast.success("Tạo dịch vụ thành công!");
    },
    onError: (msg) => {
      toast.error(msg);
    },
  });

  // Update
  const { mutate: updateService, isPending: isUpdating } = useFormMutation({
    mutationFn: (values: ServiceFormValues) =>
      serviceApi.update(editingService!.id, {
        name: values.name,
        price: Number(values.price),
        description: values.description,
      }),
    invalidateKeys: [["services"]],
    onSuccess: () => {
      editDrawer.onClose();
      setEditingService(null);
      toast.success("Cập nhật dịch vụ thành công!");
    },
    onError: (msg) => {
      toast.error(msg);
    },
  });

  // Toggle active
  const { mutate: toggleActive } = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      serviceApi.update(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
  });

  // Delete
  const { mutate: deleteService } = useMutation({
    mutationFn: (id: number) => serviceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Đã xoá dịch vụ.");
    },
    onError: () => {
      toast.error("Không thể xoá dịch vụ. Vui lòng thử lại.");
    },
  });

  const openEdit = (service: Service) => {
    setEditingService(service);
    editDrawer.onOpen();
  };

  const handleEditSubmit = (values: ServiceFormValues) => {
    setConfirmEdit({ open: true, values });
  };

  const handleConfirmEdit = () => {
    if (confirmEdit.values) {
      updateService(confirmEdit.values);
    }
    setConfirmEdit({ open: false, values: null });
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <PageTitle text='Dịch vụ' />
        <Button onClick={createDrawer.onOpen}>
          <Plus className='w-4 h-4 mr-1.5' />
          Thêm dịch vụ
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner />
      ) : services.length === 0 ? (
        <div className='flex items-center justify-center py-20 text-neutral-400 dark:text-white/30 text-sm'>
          Chưa có dịch vụ nào
        </div>
      ) : (
        <div className='rounded-2xl border border-neutral-200 dark:border-white/[0.08] overflow-hidden'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='bg-neutral-50 dark:bg-white/[0.03] border-b border-neutral-200 dark:border-white/[0.08]'>
                <th className='text-left px-5 py-3 font-medium text-neutral-500 dark:text-white/40'>
                  Tên dịch vụ
                </th>
                <th className='text-left px-5 py-3 font-medium text-neutral-500 dark:text-white/40'>
                  Mô tả
                </th>
                <th className='text-right px-5 py-3 font-medium text-neutral-500 dark:text-white/40'>
                  Giá
                </th>
                <th className='text-center px-5 py-3 font-medium text-neutral-500 dark:text-white/40'>
                  Kích hoạt
                </th>
                <th className='px-5 py-3 w-20' />
              </tr>
            </thead>
            <tbody className='divide-y divide-neutral-100 dark:divide-white/[0.05]'>
              {services.map((service) => (
                <tr
                  key={service.id}
                  className='hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors'
                >
                  <td className='px-5 py-3 font-medium text-neutral-900 dark:text-white'>
                    {service.name}
                  </td>
                  <td className='px-5 py-3 text-neutral-500 dark:text-white/50 max-w-xs'>
                    <span className='truncate block'>
                      {service.description ?? "—"}
                    </span>
                  </td>
                  <td className='px-5 py-3 text-right font-medium text-neutral-900 dark:text-white'>
                    {service.price.toLocaleString("vi-VN")}đ
                  </td>
                  <td className='px-5 py-3 text-center'>
                    <Switch
                      checked={service.isActive}
                      onCheckedChange={(checked) =>
                        toggleActive({ id: service.id, isActive: checked })
                      }
                    />
                  </td>
                  <td className='px-5 py-3'>
                    <RowActions
                      onEdit={() => openEdit(service)}
                      onDelete={() => deleteService(service.id)}
                      deleteTitle='Xoá dịch vụ?'
                      deleteDescription={`Dịch vụ "${service.name}" sẽ bị xoá. Hành động này không thể hoàn tác.`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Drawer */}
      <AppDrawer
        open={createDrawer.open}
        onClose={createDrawer.onClose}
        title='Thêm dịch vụ'
        isLoading={isCreating}
      >
        <ServiceForm
          isPending={isCreating}
          onSubmit={createService}
          onCancel={createDrawer.onClose}
        />
      </AppDrawer>

      {/* Edit Drawer */}
      <AppDrawer
        open={editDrawer.open}
        onClose={() => {
          editDrawer.onClose();
          setEditingService(null);
        }}
        title='Chỉnh sửa dịch vụ'
        isLoading={isUpdating}
      >
        {editingService && (
          <ServiceForm
            defaultValues={{
              name: editingService.name,
              price: String(editingService.price),
              description: editingService.description ?? "",
            }}
            isPending={isUpdating}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              editDrawer.onClose();
              setEditingService(null);
            }}
          />
        )}
      </AppDrawer>

      {/* Edit confirmation */}
      <ConfirmDialog
        open={confirmEdit.open}
        onOpenChange={(o) => setConfirmEdit((s) => ({ ...s, open: o }))}
        title='Xác nhận chỉnh sửa?'
        description='Bạn có chắc muốn lưu thay đổi cho dịch vụ này không?'
        confirmLabel='Lưu thay đổi'
        onConfirm={handleConfirmEdit}
      />
    </div>
  );
}
