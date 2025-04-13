import { createPlaylist } from "@/api/playlist";
import { createVideo } from "@/api/video";

interface PlaylistInsert {
  random_id: number;
  cover_img_path: string;
  playlist_title: string;
  video_count: number;
}

interface VideoInsert {
  title: string;
  channel_name: string;
  thumbnail_url: string;
}

/**
 * 플레이리스트 + 영상들 한 번에 업로드하는 통합 함수
 */
export async function uploadPlaylist(
  playlistData: PlaylistInsert,
  videos: VideoInsert[],
): Promise<void> {
  try {
    // 1. 플레이리스트 먼저 생성
    const playlist = await createPlaylist({
      ...playlistData,
      video_count: videos.length,
    });

    const p_id = playlist.p_id;

    // 2. 영상 목록에 playlist_id 추가해서 저장
    const videoListWithId = videos.map((video) => ({
      ...video,
      playlist_id: p_id,
    }));

    await createVideo(videoListWithId);
  } catch (error) {
    console.error("플레이리스트 업로드 실패:", error);
    throw error;
  }
}
