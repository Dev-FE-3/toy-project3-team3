import axiosInstance from "../axiosInstance";

export interface PlaylistFullView {
  p_id: number;
  video_count: number;
  cover_img_path: string;
  playlist_title: string;
  is_delete: boolean;
  created_at: string;

  user_id: number;
  nickname: string;
  user_img: string;

  like_count: number;
  comment_count: number;
}


export async function getPlaylistCard(): Promise<PlaylistFullView[]> {
  const res = await axiosInstance.get<PlaylistFullView[]>("/playlist_full_view");
  return res.data;
}