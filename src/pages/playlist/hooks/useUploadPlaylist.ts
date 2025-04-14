import { useMutation } from "@tanstack/react-query";
import { uploadPlaylist } from "@/api/services/uploadPlaylist";
import { toast } from "react-toastify";

type Video = {
  videoId: string;
  title: string;
  source: string;
  thumbnail?: string;
  thumbnailFile?: File;
};

interface UseUploadPlaylistProps {
  userId: number;
  videos: Video[];
  uploadPlaylistThumbnail: () => Promise<string>;
  uploadVideoThumbnail: (file: File) => Promise<string>;
  onSuccess?: () => void;
}

export function useUploadPlaylist({
  userId,
  videos,
  uploadPlaylistThumbnail,
  uploadVideoThumbnail,
  onSuccess,
}: UseUploadPlaylistProps) {
  return useMutation({
    mutationFn: async ({ playlistTitle }: { playlistTitle: string }) => {
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
