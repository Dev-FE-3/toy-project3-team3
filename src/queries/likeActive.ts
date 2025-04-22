import axiosInstance from "@/shared/api/axiosInstance";

export interface likeActive {
  p_id: number;
  l_id: number;
  user_id: number;
  is_active: boolean;
}

export async function getLikeActive(
  p_id: number,
  random_id: number,
): Promise<likeActive | null> {
  const res = await axiosInstance.get<likeActive[]>("/like_active", {
    params: {
      p_id: `eq.${p_id}`,
      random_id: `eq.${random_id}`,
    },
  });
  return res.data[0] ?? null;
}

// 좋아요된 플레이리스트 p_id 전체 가져오는 API
export async function getLikedPlaylistIds(
  random_id: number,
): Promise<number[]> {
  const res = await axiosInstance.get<likeActive[]>("/like_active", {
    params: {
      random_id: `eq.${random_id}`,
      is_active: "eq.true",
      select: "p_id",
    },
  });
  return res.data.map((like) => like.p_id);
}
