"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { isValidPhoneNumber } from "react-phone-number-input";
import { format } from "date-fns";
import { User, Clock, Scissors, ChevronLeft, ChevronRight } from "lucide-react";
import * as z from "zod";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { PhoneInput } from "../booking/phone-input";
import availabilityApi from "@/api/availabilityApi";
import serviceApi from "@/api/serviceApi";
import bookingApi from "@/api/bookingApi";
import { AvailabilityResponse, Service } from "@/lib/types";
import { cn } from "@/lib/utils";

// ── Schema ─────────────────────────────────────────────────────────
const createBookingSchema = z.object({
  customerName: z.string().min(1, "Vui lòng nhập họ tên"),
  phone: z.string().refine(isValidPhoneNumber, {
    message: "Vui lòng nhập đúng số điện thoại",
  }),
  date: z.string().min(1, "Vui lòng chọn ngày"),
  slot: z.string().min(1, "Vui lòng chọn giờ"),
  staffId: z.number({ error: "Vui lòng chọn nhân viên" }),
  serviceIds: z.array(z.number()).min(1, "Vui lòng chọn ít nhất 1 dịch vụ"),
});

type CreateBookingForm = z.infer<typeof createBookingSchema>;

const STEPS = ["Khách hàng", "Ngày & Giờ", "Dịch vụ"] as const;

// ── Component ──────────────────────────────────────────────────────
export default function CreateBookingButton() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const form = useForm<CreateBookingForm>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      date: "",
      slot: "",
      serviceIds: [],
    },
  });

  const selectedDate = form.watch("date");
  const selectedSlot = form.watch("slot");
  const selectedStaffId = form.watch("staffId");
  const selectedServiceIds = form.watch("serviceIds");

  // ── Queries ───────────────────────────────────────────────────────
  const { data: availability } = useQuery<AvailabilityResponse>({
    queryKey: ["availability", selectedDate],
    queryFn: () =>
      availabilityApi.getAvailability(selectedDate).then((r) => r.data),
    enabled: !!selectedDate,
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: () => serviceApi.getAll().then((r) => r.data),
  });

  // ── Mutation ──────────────────────────────────────────────────────
  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: CreateBookingForm) =>
      bookingApi.adminCreateBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      handleClose();
    },
  });

  const errorMessage = isAxiosError(error)
    ? (error.response?.data?.message ?? "Lỗi server, vui lòng thử lại")
    : null;

  // ── Helpers ───────────────────────────────────────────────────────
  const handleClose = () => {
    setOpen(false);
    setStep(0);
    form.reset();
  };

  const handleNext = async () => {
    const fieldsPerStep: (keyof CreateBookingForm)[][] = [
      ["customerName", "phone"],
      ["date", "slot", "staffId"],
      ["serviceIds"],
    ];
    const valid = await form.trigger(fieldsPerStep[step]);
    if (valid) setStep((s) => s + 1);
  };

  const toggleService = (id: number) => {
    const current = form.getValues("serviceIds");
    form.setValue(
      "serviceIds",
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
      { shouldValidate: true },
    );
  };

  // Slots filtered by selected staff
  const availableSlots =
    availability?.slots.filter((s) =>
      selectedStaffId ? s.availableStaffIds.includes(selectedStaffId) : true,
    ) ?? [];

  // ── Render ────────────────────────────────────────────────────────
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) handleClose();
        else setOpen(true);
      }}
    >
      <DialogTrigger asChild>
        <Button>Thêm lịch hẹn</Button>
      </DialogTrigger>

      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Thêm lịch hẹn</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className='flex items-center gap-2 mb-2'>
          {STEPS.map((label, i) => (
            <div key={label} className='flex items-center gap-2'>
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                  i < step
                    ? "bg-neutral-900 text-white"
                    : i === step
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-200 text-neutral-500",
                )}
              >
                {i + 1}
              </div>
              <span
                className={cn(
                  "text-xs",
                  i === step
                    ? "text-neutral-900 font-medium"
                    : "text-neutral-400",
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px w-6 bg-neutral-200",
                    i < step && "bg-neutral-900",
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 0: Thông tin khách ── */}
        {step === 0 && (
          <FieldGroup>
            <FieldSet>
              <Controller
                name='customerName'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Họ tên khách hàng</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type='text'
                        placeholder='Nhập họ tên'
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon>
                        <User className='w-4 h-4' />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name='phone'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Số điện thoại</FieldLabel>
                    <PhoneInput
                      {...field}
                      placeholder='Nhập số điện thoại'
                      defaultCountry='VN'
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldSet>
          </FieldGroup>
        )}

        {/* ── Step 1: Ngày, Giờ, Nhân viên ── */}
        {step === 1 && (
          <div className='flex flex-col gap-4'>
            {/* Date picker */}
            <Field>
              <FieldLabel>Ngày</FieldLabel>
              <input
                type='date'
                className='w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900'
                min={format(new Date(), "yyyy-MM-dd")}
                value={selectedDate}
                onChange={(e) => {
                  form.setValue("date", e.target.value, {
                    shouldValidate: true,
                  });
                  form.setValue("slot", "");
                  form.setValue("staffId", undefined as any);
                }}
              />
              {form.formState.errors.date && (
                <p className='text-xs text-red-500 mt-1'>
                  {form.formState.errors.date.message}
                </p>
              )}
            </Field>

            {/* Staff picker */}
            {availability && availability.staffs.length > 0 && (
              <Field>
                <FieldLabel>Nhân viên</FieldLabel>
                <div className='flex flex-wrap gap-2'>
                  {availability.staffs.map((staff) => (
                    <button
                      key={staff.id}
                      type='button'
                      onClick={() => {
                        form.setValue("staffId", staff.id, {
                          shouldValidate: true,
                        });
                        form.setValue("slot", "");
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm border transition-colors",
                        selectedStaffId === staff.id
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "border-neutral-200 hover:border-neutral-400",
                      )}
                    >
                      {staff.name}
                    </button>
                  ))}
                </div>
                {form.formState.errors.staffId && (
                  <p className='text-xs text-red-500 mt-1'>
                    {form.formState.errors.staffId.message}
                  </p>
                )}
              </Field>
            )}

            {/* Slot picker */}
            {selectedDate && (
              <Field>
                <FieldLabel>
                  Giờ{" "}
                  {selectedStaffId
                    ? `(${availableSlots.length} slot trống)`
                    : ""}
                </FieldLabel>
                {!availability ? (
                  <p className='text-sm text-neutral-400'>Đang tải...</p>
                ) : !availability.isWorkingDay ? (
                  <p className='text-sm text-red-500'>
                    Ngày này không làm việc
                  </p>
                ) : availableSlots.length === 0 ? (
                  <p className='text-sm text-neutral-400'>
                    Không còn slot trống
                  </p>
                ) : (
                  <div className='grid grid-cols-4 gap-2 max-h-40 overflow-y-auto'>
                    {availableSlots.map((s) => (
                      <button
                        key={s.time}
                        type='button'
                        onClick={() =>
                          form.setValue("slot", s.time, {
                            shouldValidate: true,
                          })
                        }
                        className={cn(
                          "py-1.5 rounded-lg text-sm border transition-colors",
                          selectedSlot === s.time
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "border-neutral-200 hover:border-neutral-400",
                        )}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                )}
                {form.formState.errors.slot && (
                  <p className='text-xs text-red-500 mt-1'>
                    {form.formState.errors.slot.message}
                  </p>
                )}
              </Field>
            )}
          </div>
        )}

        {/* ── Step 2: Dịch vụ ── */}
        {step === 2 && (
          <div className='flex flex-col gap-3'>
            <p className='text-sm text-neutral-500'>Chọn ít nhất 1 dịch vụ</p>
            <div className='flex flex-col gap-2 max-h-60 overflow-y-auto'>
              {services.map((service) => {
                const selected = selectedServiceIds.includes(service.id);
                return (
                  <button
                    key={service.id}
                    type='button'
                    onClick={() => toggleService(service.id)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-colors",
                      selected
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "border-neutral-200 hover:border-neutral-400",
                    )}
                  >
                    <span className='font-medium text-sm'>{service.name}</span>
                    <span
                      className={cn(
                        "text-sm",
                        selected ? "text-neutral-300" : "text-neutral-500",
                      )}
                    >
                      {service.price.toLocaleString("vi-VN")}đ
                    </span>
                  </button>
                );
              })}
            </div>
            {form.formState.errors.serviceIds && (
              <p className='text-xs text-red-500'>
                {form.formState.errors.serviceIds.message}
              </p>
            )}

            {errorMessage && (
              <p className='text-sm text-red-500'>{errorMessage}</p>
            )}
          </div>
        )}

        {/* ── Summary (step 2) ── */}
        {step === 2 && selectedDate && selectedSlot && (
          <div className='rounded-xl bg-neutral-50 p-3 text-sm text-neutral-600 space-y-1'>
            <div className='flex gap-2'>
              <Clock className='w-4 h-4 mt-0.5 shrink-0' />
              <span>
                {selectedDate} lúc {selectedSlot}
              </span>
            </div>
            <div className='flex gap-2'>
              <User className='w-4 h-4 mt-0.5 shrink-0' />
              <span>
                {availability?.staffs.find((s) => s.id === selectedStaffId)
                  ?.name ?? "—"}
              </span>
            </div>
            <div className='flex gap-2'>
              <Scissors className='w-4 h-4 mt-0.5 shrink-0' />
              <span>{selectedServiceIds.length} dịch vụ</span>
            </div>
          </div>
        )}

        {/* ── Actions ── */}
        <div className='flex gap-2 pt-1'>
          {step > 0 && (
            <Button
              variant='outline'
              onClick={() => setStep((s) => s - 1)}
              className='flex-1'
            >
              <ChevronLeft className='w-4 h-4 mr-1' /> Quay lại
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button onClick={handleNext} className='flex-1'>
              Tiếp theo <ChevronRight className='w-4 h-4 ml-1' />
            </Button>
          ) : (
            <Button
              disabled={isPending}
              onClick={form.handleSubmit((data) => mutate(data))}
              className='flex-1'
            >
              {isPending ? "Đang lưu..." : "Xác nhận"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
