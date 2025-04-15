import { useQuery } from "@tanstack/react-query";
import { getFollowerCount, getFollowingCount } from "@/api/follow";

const useFollowCount = (targetId?: number) => {
  const { data: followerCount = 0, isLoading: isFollowerLoading } = useQuery({
    queryKey: ["followerCount", targetId],
    queryFn: () => getFollowerCount(targetId!),
    enabled: !!targetId,
  });

  const { data: followingCount = 0, isLoading: isFollowingLoading } = useQuery({
    queryKey: ["followingCount", targetId],
    queryFn: () => getFollowingCount(targetId!),
    enabled: !!targetId,
  });

  return {
    followerCount,
    followingCount,
    isLoading: isFollowerLoading || isFollowingLoading,
  };
};

export default useFollowCount;
