import { adminClient } from "./axios";

class AuthApi {
  login = (data: { email: string; password: string }) =>
    adminClient.post(`/admin/login`, data);

  logout = () => adminClient.post(`/admin/logout`);

  changePassword = (data: { oldPassword: string; newPassword: string }) =>
    adminClient.post(`/admin/change-password`, data);
}

const authApi = new AuthApi();
export default authApi;
