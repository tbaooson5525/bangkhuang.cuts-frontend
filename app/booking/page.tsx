"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneInput } from "@/components/booking/phone-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { DatePickerInput } from "@/components/booking/date-picker";

const formSchema = z.object({
  name: z.string(),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Vui lòng nhập đúng số điện thoại" })
    .or(z.literal("")),
  date: z.date(),
});

export default function BookingPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      date: new Date(),
    },
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }
  return (
    <div className='w-screen h-screen flex justify-center items-center p-16'>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full'
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Booking information </FieldLegend>
            <FieldDescription>Input your booking information</FieldDescription>
            <FieldGroup>
              {/* Name */}
              <Controller
                name='name'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder='Enter your name'
                      autoComplete='off'
                    />
                    <FieldDescription>
                      Provide a concise title for your bug report.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <FieldSeparator />

              {/* Phone Number */}
              <Controller
                name='phone'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                    <PhoneInput
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder='Enter a phone number'
                      defaultCountry='VN'
                      {...field}
                    />
                    <FieldDescription>Enter your phone number</FieldDescription>
                  </Field>
                )}
              />

              <FieldSeparator />

              {/* Date time  */}
              <Controller
                name='date'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Select Date</FieldLabel>
                    <DatePickerInput
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    <FieldDescription>Enter your phone number</FieldDescription>
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
          <Field orientation='horizontal'>
            <Button type='submit'>Submit</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
