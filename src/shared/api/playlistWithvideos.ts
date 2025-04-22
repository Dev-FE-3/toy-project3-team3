import axiosInstance from "./axiosInstance";
import { Video } from "@/types/video";

export interface PlaylistWithVideos {
  p_id: number;
  random_id: number;
  cover_img_path: string | null;
  playlist_title: string;
  video_count: number;
  is_delete: boolean;
  created_at: string;
  videos: Video[];
}

export async function getPlaylistWithVideos(
  p_id: number,
): Promise<PlaylistWithVideos | null> {
  const response = await axiosInstance.get<PlaylistWithVideos[]>(
    `/playlist_with_videos?p_id=eq.${p_id}&is_delete=eq.false`,
  );

  return response.data[0] ?? null;
}
