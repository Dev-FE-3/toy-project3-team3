import { useQuery } from "@tanstack/react-query";
import { fetchFollowList } from "@/db/follow";

const useFollowList = (targetId: number, type: "follower" | "following") => {
  return useQuery({
    queryKey: ["followListDetail", targetId, type],
    queryFn: () => fetchFollowList(targetId, type),
  });
};

export default useFollowList;
