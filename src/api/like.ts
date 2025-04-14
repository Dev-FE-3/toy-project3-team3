import axiosInstance from "./axiosInstance";

export interface Like {
  l_id: number;
  playlist_id: number;
  random_id: number;
  is_active: boolean;
  created_at: string;
}

//가져오기
export async function getLike(): Promise<Like[]> {
  const response = await axiosInstance.get<Like[]>("/likes_table");
  return response.data;
}

//만들기
export async function createLike(): Promise<Like[]> {
  const response = await axiosInstance.post<Like[]>("/likes_table");
  return response.data;
}

//수정하기
export async function updateLike(
  p_id: number,
  randomId: number,
  is_active: boolean,
) {
  const patch = await axiosInstance.patch(
    "/likes_table",
    {
      is_active,
    },
    {
      params: {
        playlist_id: `eq.${p_id}`,
        random_id: `eq.${randomId}`,
      },
    },
  );

  return patch.data;
}

//현재로서 사용하지 않음
export async function deleteLike(): Promise<Like[]> {
  const response = await axiosInstance.delete<Like[]>("/likes_table");
  return response.data;
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
