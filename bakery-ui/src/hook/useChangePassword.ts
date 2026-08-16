import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ACCOUNT_MESSAGE_TIMEOUT_MS, ACCOUNT_TEXT } from "@/constant/account";
import { updateUserInfo, UpdateUserPayload } from "@/service/user";

export const useChangePassword = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mutation = useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUserInfo(payload),
    onError: () => {
      setSuccess("");
      setError(ACCOUNT_TEXT.ERROR_PASSWORD_UPDATE);
    },
  });

  const changePassword = (payload: UpdateUserPayload, onSuccess?: () => void) => {
    setError("");
    setSuccess("");
    mutation.mutate(payload, {
      onSuccess: () => {
        setSuccess(ACCOUNT_TEXT.SUCCESS_PASSWORD_UPDATE);
        setTimeout(() => setSuccess(""), ACCOUNT_MESSAGE_TIMEOUT_MS);
        onSuccess?.();
      },
    });
  };

  return { changePassword, isPending: mutation.isPending, error, success };
};
