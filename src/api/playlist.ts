import axiosInstance from "./axiosInstance";

export interface Playlist {
  p_id: number;
  video_count: number;
  cover_img_path: string;
  playlist_title: string;
  is_delete: boolean;
  created_at: string;
}

//가져오기
export async function getPlaylist(): Promise<Playlist[]> {
  const response = await axiosInstance.get<Playlist[]>("/playlist_table")
  return response.data;
}

//만들기
export async function createPlaylist(): Promise<Playlist[]> {
  const response = await axiosInstance.post<Playlist[]>("/playlist_table")
  return response.data;
}

//수정하기
export async function patchPlaylist(): Promise<Playlist[]> {
  const response = await axiosInstance.patch<Playlist[]>("/playlist_table")
  return response.data;
}

//삭제하기
export async function deletePlaylist(): Promise<Playlist[]> {
  const response = await axiosInstance.delete<Playlist[]>("/playlist_table")
  return response.data;
}
