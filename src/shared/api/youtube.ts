import axios from "axios";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export async function fetchYoutubeVideoData(videoId: string) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet",
          id: videoId,
          key: API_KEY,
        },
      },
    );

    const item = response.data.items[0];

    if (!item) {
      throw new Error("해당 videoId에 대한 정보가 없습니다.");
    }

    return {
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
    };
  } catch (error) {
    console.error("fetchYoutubeVideoData 에러:", error);
    throw error; // 상위에서 처리할 수 있도록 다시 던짐
  }
}
