import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import useFollowMutation from "@/api/services/useFollowMutation";

const useFollowStatus = (fromId?: number, toId?: number) => {
  const queryClient = useQueryClient(); // ✅ 캐시 조작 또는 refetch를 위한 객체
  const { follow, unfollow } = useFollowMutation();

  const enabled = !!fromId && !!toId;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["followStatus", fromId, toId],
    queryFn: async () => {
      const res = await axiosInstance.get("/follow_table", {
        params: {
          random_id: `eq.${fromId}`,
          following_id: `eq.${toId}`,
          is_following: "eq.true",
        },
      });
      return res.data[0] ?? null;
    },
    enabled,
  });

  // ✅ 버튼 클릭 시 내부에서 refetch까지 처리
  const handleFollow = () => {
    if (!fromId || !toId) return;
    return follow.mutate(
      { fromId, toId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["followStatus", fromId, toId],
          });
          queryClient.invalidateQueries({ queryKey: ["followCount", toId] }); // ✅
        },
      },
    );
  };

  const handleUnfollow = (fId: number) => {
    return unfollow.mutate(fId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["followStatus", fromId, toId],
        });
        queryClient.invalidateQueries({ queryKey: ["followCount", toId] }); // ✅
      },
    });
  };

  return {
    isFollowing: !!data,
    followRowId: data?.f_id,
    isLoading,
    handleFollow,
    handleUnfollow,
    isFollowPending: follow.isPending,
    isUnfollowPending: unfollow.isPending,
    refetch,
  };
};

export default useFollowStatus;
