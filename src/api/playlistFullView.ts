import axiosInstance from "./axiosInstance";

export interface SingleVideoData  {
  p_id: number;
  playlist_title: string;

  user_random_id: number;
  nickname: string;
  user_img: string | null;

  v_id: number;
  title: string;
  video_id: string;
}

// 🎯 Supabase View에서 p_id와 user_random_id로 조건부 필터링하여 조회
export const getSingleVideoFromPlaylist  = async (
  playlistId: number,
  videoId: string
): Promise<SingleVideoData | null> => {
  const response = await axiosInstance.get<SingleVideoData[]>(
    "/playlist_full_view",
    {
      params: {
        p_id: `eq.${playlistId}`,
        video_id: `eq.${videoId}`,
      },
    }
  );

  return response.data[0] ?? null;
};