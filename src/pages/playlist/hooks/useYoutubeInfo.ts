import { useQuery } from "@tanstack/react-query";
import { extractVideoId } from "@/shared/ExtractVideoId";
import { fetchYoutubeVideoData } from "@/api/youtube";
import { toast } from "react-toastify";

export type YoutubeVideo = {
  videoId: string;
  title: string;
  source: string;
  thumbnail: string;
  thumbnailFile?: File;
};

export function useYoutubeInfo(videoUrl: string) {
  const fetchVideoInfo = async (): Promise<YoutubeVideo | null> => {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      toast.error("유효하지 않은 링크입니다");
      return null;
    }
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
