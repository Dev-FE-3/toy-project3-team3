import { useQuery } from "@tanstack/react-query";
import { getFollowerCount, getFollowingCount } from "@/shared/api/follow";
import { QUERY_KEYS } from "@/shared/constants/queryKey";

const useFollowCount = (targetId?: number) => {
  const {
    data: followerCount = 0,
    isLoading: isFollowerLoading,
    isError: isFollowerError,
  } = useQuery({
    queryKey: [QUERY_KEYS.followerCount, targetId],
    queryFn: () => getFollowerCount(targetId!),
    enabled: !!targetId,
  });

  const {
    data: followingCount = 0,
    isLoading: isFollowingLoading,
    isError: isFollowingError,
  } = useQuery({
    queryKey: [QUERY_KEYS.followingCount, targetId],
    queryFn: () => getFollowingCount(targetId!),
    enabled: !!targetId,
  });

  return {
    followerCount,
    followingCount,
    isLoading: isFollowerLoading || isFollowingLoading,
    isError: isFollowerError || isFollowingError,
  };
};

export default useFollowCount;
