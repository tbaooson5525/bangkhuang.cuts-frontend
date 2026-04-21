"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

type DatePickerInputProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  "aria-invalid"?: boolean;
};

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

// export function DatePickerInput() {
//   const [open, setOpen] = React.useState(false);
//   const [date, setDate] = React.useState<Date | undefined>(
//     new Date,
//   );
//   const [month, setMonth] = React.useState<Date | undefined>(date);
//   const [value, setValue] = React.useState(formatDate(date));

//   return (
//     <Field className='mx-auto w-48'>
//       <FieldLabel htmlFor='date-required'>Subscription Date</FieldLabel>
//       <InputGroup>
//         <InputGroupInput
//           id='date-required'
//           value={value}
//           placeholder='June 01, 2025'
//           onChange={(e) => {
//             const date = new Date(e.target.value);
//             setValue(e.target.value);
//             if (isValidDate(date)) {
//               setDate(date);
//               setMonth(date);
//             }
//           }}
//           onKeyDown={(e) => {
//             if (e.key === "ArrowDown") {
//               e.preventDefault();
//               setOpen(true);
//             }
//           }}
//         />
//         <InputGroupAddon align='inline-end'>
//           <Popover open={open} onOpenChange={setOpen}>
//             <PopoverTrigger asChild>
//               <InputGroupButton
//                 id='date-picker'
//                 variant='ghost'
//                 size='icon-xs'
//                 aria-label='Select date'
//               >
//                 <CalendarIcon />
//                 <span className='sr-only'>Select date</span>
//               </InputGroupButton>
//             </PopoverTrigger>
//             <PopoverContent
//               className='w-auto overflow-hidden p-0'
//               align='end'
//               alignOffset={-8}
//               sideOffset={10}
//             >
//               <Calendar
//                 mode='single'
//                 selected={date}
//                 month={month}
//                 onMonthChange={setMonth}
//                 onSelect={(date) => {
//                   setDate(date);
//                   setValue(formatDate(date));
//                   setOpen(false);
//                 }}
//               />
//             </PopoverContent>
//           </Popover>
//         </InputGroupAddon>
//       </InputGroup>
//     </Field>
//   );
// }

export const DatePickerInput = React.forwardRef<
  HTMLInputElement,
  DatePickerInputProps
>(function DatePickerInput(
  { value, onChange, onBlur, name, id, ...rest },
  ref,
) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(value);

  const displayValue = formatDate(value);

  return (
    <Field className='mx-auto w-48'>
      <FieldLabel htmlFor={id ?? name}>Subscription Date</FieldLabel>

      <InputGroup>
        <InputGroupInput
          ref={ref}
          id={id ?? name}
          name={name}
          value={displayValue}
          placeholder='June 01, 2025'
          onBlur={onBlur}
          onChange={(e) => {
            const parsed = new Date(e.target.value);
            if (isValidDate(parsed)) {
              onChange?.(parsed);
              setMonth(parsed);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
          {...rest}
        />

        <InputGroupAddon align='inline-end'>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                variant='ghost'
                size='icon-xs'
                aria-label='Select date'
              >
                <CalendarIcon />
                <span className='sr-only'>Select date</span>
              </InputGroupButton>
            </PopoverTrigger>

            <PopoverContent
              className='w-auto overflow-hidden p-0'
              align='end'
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode='single'
                selected={value}
                month={month}
                onMonthChange={setMonth}
                onSelect={(date) => {
                  onChange?.(date);
                  setMonth(date);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
});
