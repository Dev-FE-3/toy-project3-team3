import { useMutation } from "@tanstack/react-query";
import { patchPlaylist } from "@/shared/api/playlist";
import { createVideo, deleteVideosByIds } from "@/shared/api/video";
import { Video } from "@/shared/types/video";
import { diffVideoList } from "@/pages/playlist/utils/diffVideoList";

export interface VideoWithFile extends Video {
  thumbnailFile?: File;
}

interface UseUpdatePlaylistProps {
  playlistId: number;
  playlistTitle: string;
  originalVideos: VideoWithFile[];
  updatedVideos: VideoWithFile[];
  uploadPlaylistThumbnail: () => Promise<string>;
  uploadVideoThumbnail: (file: File) => Promise<string>;
  thumbnailPreview: string | File;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useUpdatePlaylist = ({
  playlistId,
  playlistTitle,
  originalVideos,
  updatedVideos,
  uploadPlaylistThumbnail,
  uploadVideoThumbnail,
  thumbnailPreview,
  onSuccess,
}: UseUpdatePlaylistProps) => {
  return useMutation({
    mutationFn: async () => {
      const { deleted, added } = diffVideoList(originalVideos, updatedVideos);

      // 플레이리스트 썸네일 업로드
      let coverImgUrl = thumbnailPreview as string;

      if (thumbnailPreview instanceof File) {
        try {
          coverImgUrl = await uploadPlaylistThumbnail();
        } catch (e) {
          console.error("커버 이미지 업로드 실패:", e);
        }
      }

      // 영상 썸네일 업로드
      const uploadedVideos = await Promise.all(
        added.map(async (v) => {
          let thumbnailUrl = v.thumbnail_url;

          if (v.thumbnailFile) {
            try {
              thumbnailUrl = await uploadVideoThumbnail(v.thumbnailFile);
            } catch (e) {
              console.error("영상 썸네일 업로드 실패:", e);
            }
          }

          return {
            title: v.title,
            channel_name: v.channel_name,
            thumbnail_url: thumbnailUrl,
            video_id: v.video_id,
            playlist_id: playlistId,
          };
        }),
      );

      await Promise.all([
        patchPlaylist({
          p_id: playlistId,
          playlist_title: playlistTitle,
          video_count: updatedVideos.length,
          cover_img_path: coverImgUrl,
        }),
        deleteVideosByIds(deleted.map((v) => v.v_id!)),
        createVideo(uploadedVideos),
      ]);
    },
    onSuccess,
    onError: (error) => {
      console.error("업데이트 실패:", error.message || error);
    },
  });
};
