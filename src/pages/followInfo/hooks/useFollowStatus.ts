import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFollowStatus,
  postFollow,
  deleteFollow,
} from "@/api/services/followService";
import { useUserStore } from "@/stores/userStore";

const useFollowStatus = (targetId?: number) => {
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const fromId = user?.random_id;
  const toId = targetId;

  const { data, isLoading } = useQuery({
    queryKey: ["followStatus", fromId, toId],
    queryFn: () => getFollowStatus(fromId, toId),
    enabled: !!fromId && !!toId,
  });

  const follow = useMutation({
    mutationFn: postFollow,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["followStatus", fromId, toId],
      });
      queryClient.invalidateQueries({ queryKey: ["followerCount", toId] });
      queryClient.invalidateQueries({ queryKey: ["followingCount", fromId] });
    },
  });

  const unfollow = useMutation({
    mutationFn: (f_id: number) => deleteFollow(f_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["followStatus", fromId, toId],
      });
      queryClient.invalidateQueries({ queryKey: ["followerCount", toId] });
      queryClient.invalidateQueries({ queryKey: ["followingCount", fromId] });
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
    handleFollow,
    handleUnfollow,
    isFollowPending: follow.isPending,
    isUnfollowPending: unfollow.isPending,
  };
};

export default useFollowStatus;
