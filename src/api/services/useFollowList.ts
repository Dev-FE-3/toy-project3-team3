import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";

const useFollowList = (targetId: number, type: "follower" | "following") => {
  const queryKey = type === "follower" ? "following_id" : "random_id"; // ✅ 필드명 매칭
  return useQuery({
    queryKey: ["followListDetail", targetId, type],
    queryFn: async () => {
      const res = await axiosInstance.get("/follow_table", {
        params: {
          [`${queryKey}`]: `eq.${targetId}`, // ✅ Supabase REST 쿼리 형식
          select: "random_id", // 필요한 필드만 (옵션)
        },
      });
      return res.data;
    },
  });
};

export default useFollowList;
