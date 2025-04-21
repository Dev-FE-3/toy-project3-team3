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
interface PatchPlaylistData {
  p_id: number;
  playlist_title?: string;
  cover_img_path?: string;
  video_count?: number;
}

export async function patchPlaylist({
  p_id,
  ...updateData
}: PatchPlaylistData): Promise<Playlist> {
  const response = await axiosInstance.patch<Playlist[]>(
    `/playlist_table?p_id=eq.${p_id}`,
    [updateData], // Supabase는 배열로 전달해야 함
    {
      headers: {
        Prefer: "return=representation", // 응답으로 수정된 row 받아오기
      },
    },
  );
  return response.data[0];
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
