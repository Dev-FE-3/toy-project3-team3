import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFollow, deleteFollow } from "@/db/follow";

const useFollowMutation = () => {
  const queryClient = useQueryClient();

  const follow = useMutation({
    mutationFn: ({ fromId, toId }: { fromId: number; toId: number }) =>
      postFollow({ fromId, toId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followCount"] });
    },
  });

  const unfollow = useMutation({
    mutationFn: (f_id: number) => deleteFollow(f_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followCount"] });
    },
  });

  return {
    follow: follow.mutate,
    unfollow: unfollow.mutate,
    isFollowPending: follow.isPending,
    isUnfollowPending: unfollow.isPending,
    isFollowError: follow.isError,
    isUnfollowError: unfollow.isError,
  };
};

export default useFollowMutation;
