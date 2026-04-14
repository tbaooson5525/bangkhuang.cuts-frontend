"use client";

import { Button } from "@/components/ui/button";
import AppDrawer from "@/components/shared/AppDrawer";
import ServiceForm, {
  ServiceFormValues,
} from "@/components/services/ServiceForm";
import { useDrawer } from "@/hooks/useDrawer";
import { useFormMutation } from "@/hooks/useFormMutation";
import serviceApi from "@/api/serviceApi";

export default function CreateServiceButton() {
  const drawer = useDrawer();

  const { mutate, isPending, errorMessage } = useFormMutation({
    mutationFn: (values: ServiceFormValues) =>
      serviceApi.create({
        name: values.name,
        price: Number(values.price),
        description: values.description,
      }),
    invalidateKeys: [["services"]],
    onSuccess: drawer.onClose,
  });

  return (
    <>
      <Button onClick={drawer.onOpen}>Thêm dịch vụ</Button>
      <AppDrawer
        open={drawer.open}
        onClose={drawer.onClose}
        title='Thêm dịch vụ'
      >
        <ServiceForm
          isPending={isPending}
          errorMessage={errorMessage}
          onSubmit={(values) => mutate(values)}
          onCancel={drawer.onClose}
        />
      </AppDrawer>
    </>
  );
}
