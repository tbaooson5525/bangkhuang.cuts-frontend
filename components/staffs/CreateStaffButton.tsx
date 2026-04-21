"use client";

import { Button } from "@/components/ui/button";
import AppDrawer from "@/components/shared/AppDrawer";
import StaffForm, { StaffFormValues } from "@/components/staffs/StaffForm";
import { useDrawer } from "@/hooks/useDrawer";
import { useFormMutation } from "@/hooks/useFormMutation";
import staffApi from "@/api/staffApi";

export default function CreateStaffButton() {
  const drawer = useDrawer();

  const { mutate, isPending, errorMessage } = useFormMutation({
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
    onSuccess: drawer.onClose,
  });

  return (
    <>
      <Button onClick={drawer.onOpen}>Thêm nhân viên</Button>
      <AppDrawer
        open={drawer.open}
        onClose={drawer.onClose}
        title='Thêm nhân viên'
      >
        <StaffForm
          isPending={isPending}
          errorMessage={errorMessage}
          onSubmit={(values, avatarFile) => mutate({ values, avatarFile })}
          onCancel={drawer.onClose}
        />
      </AppDrawer>
    </>
  );
}
