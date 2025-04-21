import axiosInstance from "./axiosInstance";

interface Video {
  v_id: number;
  playlist_id: number;
  title: string;
  channel_name: string;
  thumbnail_url: string;
  video_id: string;
  created_at: string;
}

export interface PlaylistWithVideos {
  p_id: number;
  random_id: number;
  playlist_title: string;
  cover_img_path: string;
  video_count: number;
  created_at: string;
  videos: Video[];
}

/** 단일 플레이리스트 + 영상 목록 불러오기 */
export async function getPlaylistDetail(
  playlistId: number,
): Promise<PlaylistWithVideos> {
  const response = await axiosInstance.get(
    `/playlist_with_videos?p_id=eq.${playlistId}`,
  );
  return response.data[0];
}
