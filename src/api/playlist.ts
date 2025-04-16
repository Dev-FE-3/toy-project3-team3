import axiosInstance from "./axiosInstance";

export interface Playlist {
  p_id: number;
  random_id: number;
  video_count: number;
  cover_img_path: string;
  playlist_title: string;
  is_delete: boolean;
  created_at: string;
}

//가져오기
export async function getPlaylist(): Promise<Playlist[]> {
  const response = await axiosInstance.get<Playlist[]>("/playlist_table");
  return response.data;
}

//만들기
export async function createPlaylist(): Promise<Playlist[]> {
  const response = await axiosInstance.post<Playlist[]>("/playlist_table");
  return response.data;
}

//수정하기
export async function patchPlaylist(): Promise<Playlist[]> {
  const response = await axiosInstance.patch<Playlist[]>("/playlist_table");
  return response.data;
}

// 내가 만든 플레이리스트 soft delete (is_delete: true)
export async function softDeletePlaylist(p_id: number) {
  const { data } = await axiosInstance.patch(
    `/playlist_table`,
    { is_delete: true },
    {
      params: {
        p_id: `eq.${p_id}`,
      },
    },
  );

  return data;
}
