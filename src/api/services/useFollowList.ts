import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";

const useFollowList = (targetId: number, type: "follower" | "following") => {
  const isFollower = type === "follower";
  const queryKey = isFollower ? "following_id" : "random_id";

  return useQuery({
    queryKey: ["followListDetail", targetId, type],
    queryFn: async () => {
      const res = await axiosInstance.get("/follow_table", {
        params: {
          [`${queryKey}`]: `eq.${targetId}`,
          is_following: "eq.true",
          select: "random_id, following_id",
        },
      });
      return res.data;
    },
  });
};

export default useFollowList;
