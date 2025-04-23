import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFollowStatus, postFollow, deleteFollow } from "@/shared/api/follow";
import { useUserStore } from "@/stores/userStore";
import { QUERY_KEYS } from "@/shared/constants/queryKey";

const useFollowStatus = (targetId?: number) => {
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const fromId = user?.random_id;
  const toId = targetId;

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.followStatus, fromId, toId],
    queryFn: () => getFollowStatus(fromId, toId),
    enabled: !!fromId && !!toId,
  });

  const follow = useMutation({
    mutationFn: postFollow,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.followStatus, fromId, toId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.followerCount, toId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.followingCount, fromId],
      });
    },
  });

  const unfollow = useMutation({
    mutationFn: (f_id: number) => deleteFollow(f_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.followStatus, fromId, toId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.followerCount, toId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.followingCount, fromId],
      });
    },
  });

  const handleFollow = () => {
    if (!fromId || !toId) return;
    follow.mutate({ fromId, toId });
  };

  const handleUnfollow = () => {
    if (!data?.f_id) return;
    unfollow.mutate(data.f_id);
  };

  return {
    isFollowing: !!data,
    followRowId: data?.f_id,
    isLoading,
    isError,
    handleFollow,
    handleUnfollow,
    isFollowPending: follow.isPending,
    isUnfollowPending: unfollow.isPending,
    isFollowError: follow.isError,
    isUnfollowError: unfollow.isError,
  };
};

export default useFollowStatus;
