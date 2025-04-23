import axiosInstance from "@/shared/api/axiosInstance";

export interface likeActive {
  p_id: number;
  l_id: number;
  user_id: number;
  is_active: boolean;
}

// 좋아요된 플레이리스트 p_id 전체 가져오는 API
export async function getLikedPlaylistIds(
  random_id: number,
): Promise<number[]> {
  try {
    const res = await axiosInstance.get<likeActive[]>("/like_active", {
      params: {
        random_id: `eq.${random_id}`,
        is_active: "eq.true",
        select: "p_id",
      },
    });
    return res.data.map((like) => like.p_id);
  } catch (error) {
    console.error("getLikedPlaylistIds 에러:", error);
    return [];
  }
}
