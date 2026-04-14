import { adminClient } from "./axios";
import type {
  CreateServicePayload,
  Service,
  UpdateServicePayload,
} from "@/lib/types";

class ServiceApi {
  getAll = () => adminClient.get<Service[]>(`/admin/services`);

  create = (data: CreateServicePayload) =>
    adminClient.post(`/admin/services`, data);

  update = (id: number, data: UpdateServicePayload) =>
    adminClient.patch(`/admin/services/${id}`, data);

  delete = (id: number) => adminClient.delete(`/admin/services/${id}`);
}

const serviceApi = new ServiceApi();
export default serviceApi;
