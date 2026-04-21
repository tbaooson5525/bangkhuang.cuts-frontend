import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import authApi from "@/api/authApi";

export function useSignOut() {
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => router.push("/login"),
    onError: () => alert("Đăng xuất thất bại, vui lòng thử lại"),
    retry: 3,
  });
}
