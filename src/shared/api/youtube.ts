import axios from "axios";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export async function fetchYoutubeVideoData(videoId: string) {
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
  return {
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium.url,
    channelTitle: item.snippet.channelTitle,
  };
}
