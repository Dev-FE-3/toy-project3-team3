import { useQuery } from "@tanstack/react-query";
import { fetchFollowList } from "@/shared/api/follow";
import { QUERY_KEYS } from "@/shared/constants/queryKey";

const useFollowList = (targetId: number, type: "follower" | "following") => {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.followListDetail, targetId, type],
    queryFn: () => fetchFollowList(targetId, type),
  });

  return {
    followList: data,
    isLoading,
    isError,
  };
};

export default useFollowList;
