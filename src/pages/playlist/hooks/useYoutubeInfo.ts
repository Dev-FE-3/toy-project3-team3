import { useState } from "react";
import { extractVideoId } from "@/shared/ExtractVideoId";
import { fetchYoutubeVideoData } from "@/api/youtube";

export function useYoutubeInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getVideoInfo = async (url: string) => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      setError("유효하지 않은 유튜브 링크입니다.");
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchYoutubeVideoData(videoId);
      return {
        title: data.title,
        source: data.channelTitle,
        thumbnail: data.thumbnail,
      };
    } catch (err) {
      setError("영상 정보를 불러오는 데 실패했습니다.");
      console.error("영상 정보를 불러오는 데 실패했습니다:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getVideoInfo, loading, error };
}
