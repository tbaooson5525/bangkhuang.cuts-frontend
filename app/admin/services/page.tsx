"use client";

import { useState, useCallback, memo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Check, X } from "lucide-react";

import PageTilte from "@/components/page-title";
import CreateServiceButton from "@/components/services/create-service";
import AppDrawer from "@/components/shared/AppDrawer";
import ServiceForm, {
  ServiceFormValues,
} from "@/components/services/ServiceForm";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Switch } from "@/components/ui/switch";
import { useDrawer } from "@/hooks/useDrawer";
import { useFormMutation } from "@/hooks/useFormMutation";
import serviceApi from "@/api/serviceApi";
import type { Service, UpdateServicePayload } from "@/lib/types";
import { cn } from "@/lib/utils";

type EditForm = { name: string; description: string; price: number };

// Memoized row to prevent full table re-render on single row edit
const ServiceRow = memo(function ServiceRow({
  service,
  isEditing,
  editForm,
  isUpdating,
  onStartEdit,
  onCancelEdit,
  onConfirmEdit,
  onEditFormChange,
  onToggleActive,
  onDelete,
}: {
  service: Service;
  isEditing: boolean;
  editForm: EditForm;
  isUpdating: boolean;
  onStartEdit: (s: Service) => void;
  onCancelEdit: () => void;
  onConfirmEdit: (id: number) => void;
  onEditFormChange: (field: keyof EditForm, value: string | number) => void;
  onToggleActive: (id: number, checked: boolean) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <tr
      className={cn(
        "transition-colors",
        isEditing ? "bg-neutral-50" : "hover:bg-neutral-50/50",
      )}
    >
      <td className='px-5 py-3'>
        {isEditing ? (
          <input
            className='w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900'
            value={editForm.name}
            onChange={(e) => onEditFormChange("name", e.target.value)}
          />
        ) : (
          <span className='font-medium text-neutral-900'>{service.name}</span>
        )}
      </td>

      <td className='px-5 py-3 text-neutral-500 max-w-xs'>
        {isEditing ? (
          <input
            className='w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900'
            value={editForm.description}
            placeholder='Mô tả (không bắt buộc)'
            onChange={(e) => onEditFormChange("description", e.target.value)}
          />
        ) : (
          <span className='truncate block'>{service.description ?? "—"}</span>
        )}
      </td>

      <td className='px-5 py-3 text-right'>
        {isEditing ? (
          <input
            type='number'
            className='w-28 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-neutral-900'
            value={editForm.price}
            onChange={(e) => onEditFormChange("price", Number(e.target.value))}
          />
        ) : (
          <span className='font-medium text-neutral-900'>
            {service.price.toLocaleString("vi-VN")}đ
          </span>
        )}
      </td>

      <td className='px-5 py-3 text-center'>
        <Switch
          checked={service.isActive}
          disabled={isEditing}
          onCheckedChange={(checked) => onToggleActive(service.id, checked)}
        />
      </td>

      <td className='px-5 py-3'>
        <div className='flex items-center justify-end gap-1'>
          {isEditing ? (
            <>
              <button
                onClick={() => onConfirmEdit(service.id)}
                disabled={isUpdating}
                className='p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50'
              >
                <Check className='w-4 h-4' />
              </button>
              <button
                onClick={onCancelEdit}
                className='p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors'
              >
                <X className='w-4 h-4' />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onStartEdit(service)}
                className='p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors'
              >
                <Pencil className='w-4 h-4' />
              </button>
              <button
                onClick={() => onDelete(service.id)}
                className='p-1.5 rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors'
              >
                <Trash2 className='w-4 h-4' />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
});

export default function ServicesPage() {
  const queryClient = useQueryClient();
  const editDrawer = useDrawer();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [inlineEditId, setInlineEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    name: "",
    description: "",
    price: 0,
  });

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: () => serviceApi.getAll().then((r) => r.data),
  });

  const { mutate: updateService, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateServicePayload }) =>
      serviceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setInlineEditId(null);
    },
  });

  const { mutate: deleteService } = useMutation({
    mutationFn: (id: number) => serviceApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
  });

  // Drawer edit mutation
  const {
    mutate: updateViaDrawer,
    isPending: isDrawerUpdating,
    errorMessage: drawerError,
  } = useFormMutation({
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
    },
  });

  const handleStartInlineEdit = useCallback((service: Service) => {
    setInlineEditId(service.id);
    setEditForm({
      name: service.name,
      description: service.description ?? "",
      price: service.price,
    });
  }, []);

  const handleEditFormChange = useCallback(
    (field: keyof EditForm, value: string | number) => {
      setEditForm((f) => ({ ...f, [field]: value }));
    },
    [],
  );

  const handleConfirmInlineEdit = useCallback(
    (id: number) => {
      if (!editForm.name.trim()) return;
      updateService({
        id,
        data: {
          name: editForm.name.trim(),
          description: editForm.description || undefined,
          price: editForm.price,
        },
      });
    },
    [editForm, updateService],
  );

  return (
    <div className='flex flex-col h-full'>
      <div className='flex justify-between items-center mb-6 shrink-0'>
        <PageTilte text='Dịch vụ' />
        <CreateServiceButton />
      </div>

      <div className='flex-1 overflow-y-auto'>
        {isLoading ? (
          <LoadingSpinner />
        ) : services.length === 0 ? (
          <div className='flex items-center justify-center py-20 text-neutral-400 text-sm'>
            Chưa có dịch vụ nào
          </div>
        ) : (
          <div className='rounded-2xl border border-neutral-200 overflow-hidden'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-neutral-50 border-b border-neutral-200'>
                  <th className='text-left px-5 py-3 font-medium text-neutral-500'>
                    Tên dịch vụ
                  </th>
                  <th className='text-left px-5 py-3 font-medium text-neutral-500'>
                    Mô tả
                  </th>
                  <th className='text-right px-5 py-3 font-medium text-neutral-500'>
                    Giá
                  </th>
                  <th className='text-center px-5 py-3 font-medium text-neutral-500'>
                    Kích hoạt
                  </th>
                  <th className='px-5 py-3' />
                </tr>
              </thead>
              <tbody className='divide-y divide-neutral-100'>
                {services.map((service) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    isEditing={inlineEditId === service.id}
                    editForm={editForm}
                    isUpdating={isUpdating}
                    onStartEdit={handleStartInlineEdit}
                    onCancelEdit={() => setInlineEditId(null)}
                    onConfirmEdit={handleConfirmInlineEdit}
                    onEditFormChange={handleEditFormChange}
                    onToggleActive={(id, checked) =>
                      updateService({ id, data: { isActive: checked } })
                    }
                    onDelete={deleteService}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit via Drawer (alternative to inline) */}
      <AppDrawer
        open={editDrawer.open}
        onClose={() => {
          editDrawer.onClose();
          setEditingService(null);
        }}
        title='Chỉnh sửa dịch vụ'
      >
        {editingService && (
          <ServiceForm
            defaultValues={{
              name: editingService.name,
              price: String(editingService.price),
              description: editingService.description ?? "",
            }}
            isPending={isDrawerUpdating}
            errorMessage={drawerError}
            onSubmit={updateViaDrawer}
            onCancel={() => {
              editDrawer.onClose();
              setEditingService(null);
            }}
          />
        )}
      </AppDrawer>
    </div>
  );
}
