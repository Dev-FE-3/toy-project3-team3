import { useQuery } from "@tanstack/react-query";
import { extractVideoId } from "@/shared/ExtractVideoId";
import { fetchYoutubeVideoData } from "@/api/youtube";
import { toast } from "react-toastify";

export type YoutubeVideo = {
  videoId: string;
  title: string;
  source: string;
  thumbnail: string;
  thumbnailFile?: File; // 썸네일 이미지 파일 (업로드 시 사용)
};

export function useYoutubeInfo(videoUrl: string) {
  const fetchVideoInfo = async (): Promise<YoutubeVideo | null> => {
    const videoId = extractVideoId(videoUrl); // 링크에서 영상 ID 추출
    if (!videoId) {
      toast.error("유효하지 않은 링크입니다");
      return null;
    }

    // 유튜브 API 호출로 영상 데이터 가져오기
    const data = await fetchYoutubeVideoData(videoId);

    return {
      videoId,
      title: data.title,
      source: data.channelTitle,
      thumbnail: data.thumbnail,
      thumbnailFile: undefined,
    };
  };

  return useQuery({
    queryKey: ["youtubeInfo", videoUrl],
    queryFn: fetchVideoInfo,
    enabled: false, // refetch로만 실행되게
  });
}
