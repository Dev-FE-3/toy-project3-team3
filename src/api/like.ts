import axiosInstance from "./axiosInstance";

export interface Like {
  l_id: number;
  random_id: number;
  playlist_id: number;
  is_active: boolean;
  created_at: string;
}

//가져오기
export async function getLike(): Promise<Like[]> {
  const response = await axiosInstance.get<Like[]>("/likes_table");
  return response.data;
}

// 좋아요 여부 확인
export async function getLikeStatus(
  userId: number,
  playlistId: number,
): Promise<Like | null> {
  const res = await axiosInstance.get(
    `/likes_table?random_id=eq.${userId}&playlist_id=eq.${playlistId}`,
  );

  console.log("좋아요 여부 확인:::", res.data);
  return res.data[0] ?? null;
}

//만들기
export async function addLike(data: {
  random_id: number;
  playlist_id: number;
}) {
  return axiosInstance.post("/likes_table", { ...data, is_active: true });
}

//수정하기 (좋아요 취소)
export async function updateLikeActive(l_id: number, is_active: boolean) {
  const res = await axiosInstance.patch(
    `/likes_table?l_id=eq.${l_id}`,
    { is_active },
    { headers: { Prefer: "return=representation" } },
  );
  return res.data;
}

//현재로서 사용하지 않음
export async function deleteLike(): Promise<Like[]> {
  const response = await axiosInstance.delete<Like[]>("/likes_table");
  return response.data;
}

// 좋아요 수 가져오기
export async function getLikeCountByPlaylist(
  playlistId: number,
): Promise<number> {
  const res = await axiosInstance.get(`/likes_table`, {
    params: {
      playlist_id: `eq.${playlistId}`,
      is_active: "eq.true",
      select: "l_id",
    },
  });

  return res.data.length;
}

export async function getMyLikedPlaylistIds(
  randomId: number,
): Promise<number[]> {
  const { data } = await axiosInstance.get("/likes_table", {
    params: {
      random_id: `eq.${randomId}`,
      is_active: "eq.true",
      select: "playlist_id",
    },
  });

  // 결과: [1, 3, 7] 이런 식으로 반환
  return data.map((item: { playlist_id: number }) => item.playlist_id);
}