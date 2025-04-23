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

//만들기
export async function createPlaylist(playlistData: {
  cover_img_path: string;
  playlist_title: string;
  video_count: number;
}): Promise<Playlist> {
  try {
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
  } catch (error) {
    console.error("createPlaylist 에러:", error);
    throw error;
  }
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
  try {
    const response = await axiosInstance.patch<Playlist[]>(
      `/playlist_table?p_id=eq.${p_id}`,
      [updateData], // Supabase는 배열로 전달해야 함
      {
        headers: {
          Prefer: "return=representation",
        },
      },
    );
    return response.data[0];
  } catch (error) {
    console.error("patchPlaylist 에러:", error);
    throw error;
  }
}

// 내가 만든 플레이리스트 soft delete (is_delete: true)
export async function softDeletePlaylist(p_id: number) {
  try {
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
  } catch (error) {
    console.error("softDeletePlaylist 에러:", error);
    throw error;
  }
}
