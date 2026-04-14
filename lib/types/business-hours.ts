export type BusinessHours = {
  singleton: string;
  openTime: string; // "HH:MM"
  closeTime: string; // "HH:MM"
  slotDuration: number; // minutes
};

export type WorkingDay = {
  dayOfWeek: number; // 0=CN, 1=T2, ..., 6=T7
};

export type DayOff = {
  date: string; // "YYYY-MM-DD"
  reason: string | null;
};

export type UpdateBusinessHoursPayload = {
  openTime?: string;
  closeTime?: string;
  slotDuration?: number;
};

export type SetWorkingDaysPayload = {
  days: number[];
};

export type CreateDayOffPayload = {
  date: string;
  reason?: string;
};
