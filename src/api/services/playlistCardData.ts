import axiosInstance from "../axiosInstance";

export interface playlistCardData {
  p_id: number;
  video_count: number;
  cover_img_path: string;
  playlist_title: string;
  is_delete: boolean;
  created_at: string;

  random_id: number;
  nickname: string;
  user_img: string;

  is_active: boolean;
  like_count: number;
  comment_count: number;
}


export async function getPlaylistCardData(): Promise<playlistCardData[]> {
  const res = await axiosInstance.get<playlistCardData[]>("/playlist_card_data");
  return res.data;
}