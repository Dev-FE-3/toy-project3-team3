import axiosInstance from "@/api/axiosInstance";
import { PlaylistCardData } from "@/api/playlistCardData";

// 내가 만든 플레이리스트
export async function getMyPlaylists(
  randomId: number,
): Promise<PlaylistCardData[]> {
  const { data } = await axiosInstance.get<PlaylistCardData[]>(
    "/playlist_card_data",
    {
      params: {
        random_id: `eq.${randomId}`,
        is_delete: "eq.false", // 삭제되지 않은 항목만
      },
    },
  );
  return data;
}
