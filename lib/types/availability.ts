export type AvailabilitySlot = {
  time: string; // "HH:MM"
  availableStaffIds: number[];
};

export type AvailabilityResponse = {
  date: string;
  isWorkingDay: boolean;
  staffs: Pick<import("./staff").Staff, "id" | "name" | "avatarUrl">[];
  slots: AvailabilitySlot[];
};
