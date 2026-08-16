import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "@/service/user";
import { setUserInfo } from "@/redux/user";
import { selectUser } from "@/redux/user/selectors";
import { AppDispatch } from "@/redux/store";

export const useCurrentUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useSelector(selectUser);

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await getUserInfo();
      const data = res.data.data;
      const parts = (data.fullName ?? "").trim().split(/\s+/);
      const userInfo = {
        id: String(data.id),
        username: data.username,
        email: data.email,
        firstName: parts[0] ?? "",
        lastName: parts.slice(1).join(" ") || undefined,
        avatarUrl: data.avatarUrl,
        role: data.role,
      };
      dispatch(setUserInfo(userInfo));
      return userInfo;
    },
    enabled: !id,
    staleTime: Infinity,
  });
};
