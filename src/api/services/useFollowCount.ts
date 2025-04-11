import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getFollow } from "@/api/follow";

const useFollowCount = (targetId?: number) => {
  const {
    data: followList = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["followList"],
    queryFn: getFollow,
    enabled: !!targetId, // ✅ targetId 있을 때만 요청
  });

  const followerCount = useMemo(() => {
    if (!targetId) return 0;
    return followList.filter(
      (f) => f.following_id === targetId && f.is_following,
    ).length;
  }, [followList, targetId]);

  const followingCount = useMemo(() => {
    if (!targetId) return 0;
    return followList.filter((f) => f.randeom_id === targetId && f.is_following)
      .length;
  }, [followList, targetId]);

  return {
    followerCount,
    followingCount,
    isLoading,
    isError,
  };
};

export default useFollowCount;
