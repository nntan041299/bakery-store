import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { ACCOUNT_MESSAGE_TIMEOUT_MS, ACCOUNT_TEXT } from "@/constant/account";
import { AppDispatch } from "@/redux/store";
import { selectUser } from "@/redux/user/selectors";
import { setUserInfo } from "@/redux/user";
import { updateUserInfo, UpdateUserPayload } from "@/service/user";

export const useUpdateProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mutation = useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUserInfo(payload),
    onSuccess: (res) => {
      const data = res.data.data;
      const parts = (data.fullName ?? "").trim().split(/\s+/);
      dispatch(
        setUserInfo({
          id: String(data.id),
          username: data.username,
          email: data.email,
          firstName: parts[0] ?? "",
          lastName: parts.slice(1).join(" ") || undefined,
          avatarUrl: user.avatarUrl,
          role: user.role,
        }),
      );
      setError("");
      setSuccess(ACCOUNT_TEXT.SUCCESS_PROFILE_UPDATE);
      setTimeout(() => setSuccess(""), ACCOUNT_MESSAGE_TIMEOUT_MS);
    },
    onError: () => {
      setSuccess("");
      setError(ACCOUNT_TEXT.ERROR_PROFILE_UPDATE);
    },
  });

  const saveProfile = (payload: UpdateUserPayload) => {
    setError("");
    setSuccess("");
    mutation.mutate(payload);
  };

  return { saveProfile, isPending: mutation.isPending, error, success };
};
