import { adminClient } from "./axios";

class StaffApi {
  getAll = () => adminClient.get(`/admin/staffs`);

  create = (data: { name: string; description?: string; avatar?: File }) => {
    const form = new FormData();
    form.append("name", data.name);
    if (data.description) form.append("description", data.description);
    if (data.avatar) form.append("avatar", data.avatar);
    return adminClient.post(`/admin/staffs`, form);
  };
  getOne = (id: number) => adminClient.get(`/admin/staffs/${id}`);

  update = (
    id: number,
    data: {
      name?: string;
      description?: string;
      isActive?: boolean;
      avatar?: File;
    },
  ) => {
    const form = new FormData();
    if (data.name) form.append("name", data.name);
    if (data.description !== undefined)
      form.append("description", data.description);
    if (data.isActive !== undefined)
      form.append("isActive", String(data.isActive));
    if (data.avatar) form.append("avatar", data.avatar);
    return adminClient.patch(`/admin/staffs/${id}`, form);
  };

  deactivate = (id: number) => adminClient.delete(`/admin/staffs/${id}`);
}

const staffApi = new StaffApi();
export default staffApi;
