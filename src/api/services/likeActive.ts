import axiosInstance from "../axiosInstance";

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
