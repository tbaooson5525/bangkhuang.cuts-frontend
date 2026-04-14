import { adminClient } from "./axios";

class BusinessHoursApi {
  getBusinessHours = () => adminClient.get(`/admin/business-hours`);

  updateBusinessHours = (data: {
    openTime?: string;
    closeTime?: string;
    slotDuration?: number;
  }) => adminClient.patch(`/admin/business-hours`, data);

  getWorkingDays = () => adminClient.get(`/admin/working-days`);

  setWorkingDays = (data: { dayOfWeek: number[] }) =>
    adminClient.put(`/admin/working-days`, data);

  getDaysOff = () => adminClient.get(`/admin/days-off`);

  createDayOff = (data: { date: string; reason?: string }) =>
    adminClient.post(`/admin/days-off`, data);

  deleteDayOff = (date: string) =>
    adminClient.delete(`/admin/days-off/${date}`);
}

const businessHoursApi = new BusinessHoursApi();
export default businessHoursApi;
