import { useMutation } from "@tanstack/react-query";
import { uploadPlaylist } from "@/api/uploadPlaylist";
import { toast } from "react-toastify";

type UploadVideo = {
  videoId: string;
  title: string;
  source: string;
  thumbnail?: string;
  thumbnailFile?: File;
};

interface UseUploadPlaylistProps {
  userId: number;
  videos: UploadVideo[];
  uploadPlaylistThumbnail: () => Promise<string>;
  uploadVideoThumbnail: (file: File) => Promise<string>;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

/**
 * 플레이리스트 생성에 필요한 데이터를 받아 업로드하는 커스텀 훅
 * - 제목 유효성 및 비디오 개수 검사
 * - 썸네일 업로드
 * - 각 영상별 썸네일 업로드
 * - 최종 데이터 정리 후 uploadPlaylist API 호출
 * - 성공/에러 처리 포함
 */
export function useUploadPlaylist({
  userId,
  videos,
  uploadPlaylistThumbnail,
  uploadVideoThumbnail,
  onSuccess,
}: UseUploadPlaylistProps) {
  return useMutation({
    mutationFn: async ({ playlistTitle }: { playlistTitle: string }) => {
      //제목 및 비디오 개수 검사
      if (!playlistTitle) throw new Error("플레이리스트 제목을 입력해주세요.");
      if (videos.length === 0)
        throw new Error("1개 이상의 영상을 추가해주세요.");

      const thumbnailUrl = await uploadPlaylistThumbnail();

      const videoData = await Promise.all(
        videos.map(async (v) => {
          let finalThumb = v.thumbnail;
          if (v.thumbnailFile) {
            finalThumb = await uploadVideoThumbnail(v.thumbnailFile);
          }
          return {
            title: v.title,
            channel_name: v.source,
            thumbnail_url: finalThumb!,
            video_id: v.videoId,
          };
        }),
      );

      // 최종 플레이리스트 및 영상 정보 업로드
      return uploadPlaylist(
        {
          random_id: userId,
          cover_img_path: thumbnailUrl,
          playlist_title: playlistTitle,
          video_count: videos.length,
        },
        videoData,
      );
    },
    onSuccess,
    onError: (error) => {
      console.error("업로드 실패:", error.message || error);
      toast.error(error.message || "업로드에 실패했습니다. 다시 시도해주세요.");
      throw error;
    },
  });
}
