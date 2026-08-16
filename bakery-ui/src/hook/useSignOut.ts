import { useMutation } from "@tanstack/react-query";
import { signOut } from "@/service/auth";
import { useAuth } from "@/context/AuthProvider";

export const useSignOut = () => {
  const { removeToken } = useAuth();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => removeToken(),
    onError: () => removeToken(),
  });
};
