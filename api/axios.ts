import { HOST_API } from "@/lib/constants/host";
import axios from "axios";

export const publicClient = axios.create({
  baseURL: HOST_API,
});

export const adminClient = axios.create({
  baseURL: HOST_API,
  withCredentials: true,
});

// Interceptor: nếu BE trả 401 → redirect về login
adminClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    const isAuthEndpoint =
      url.includes("/login") || url.includes("/admin/change-password");

    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      typeof window !== "undefined"
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
