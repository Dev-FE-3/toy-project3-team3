import axiosInstance from "@/db/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useFollowMutation = () => {
  const queryClient = useQueryClient();

  const follow = useMutation({
    mutationFn: (data: { fromId: number; toId: number }) =>
      axiosInstance.post("/follow_table", {
        random_id: data.fromId,
        following_id: data.toId,
        is_following: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followCount"] });
    },
  });

  const unfollow = useMutation({
    mutationFn: (id: number) =>
      axiosInstance.patch(`/follow_table?id=eq.${id}`, {
        is_following: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followCount"] });
    },
  });

  return { follow, unfollow };
};

export default useFollowMutation;
