import { useState } from "react";
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

export function useYoutubeInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getVideoInfo = async (url: string): Promise<YoutubeVideo | null> => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      toast.error("유효하지 않은 링크입니다");
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchYoutubeVideoData(videoId);
      return {
        videoId,
        title: data.title,
        source: data.channelTitle,
        thumbnail: data.thumbnail,
        thumbnailFile: undefined,
      };
    } catch (err) {
      setError("영상 정보를 불러오는 데 실패했습니다.");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getVideoInfo, loading, error };
}
