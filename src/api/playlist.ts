import axiosInstance from "./axiosInstance";

export interface Playlist {
  p_id: number;
  user_id: number;
  playlist_id: number;
  comment: string;
  created_at: string;
}

//가져오기
export async function getPlaylist(): Promise<Playlist[]> {
  const response = await axiosInstance.get<Playlist[]>("/playlist_table");
  return response.data;
}

//만들기
export async function createPlaylist(playlistData: {
  cover_img_path: string;
  playlist_title: string;
  video_count: number;
}): Promise<Playlist> {
  const response = await axiosInstance.post<Playlist[]>(
    "/playlist_table",
    [playlistData], // Supabase는 배열 형태로 받아야 insert 됨
    {
      headers: {
        Prefer: "return=representation", // p_id받으려면 필요
      },
    },
  );
  return response.data[0];
}

//수정하기
export async function patchPlaylist(): Promise<Playlist[]> {
  const response = await axiosInstance.patch<Playlist[]>("/playlist_table");
  return response.data;
}

//삭제하기
export async function deletePlaylist(): Promise<Playlist[]> {
  const response = await axiosInstance.delete<Playlist[]>("/playlist_table");
  return response.data;
}
