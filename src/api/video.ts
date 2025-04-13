import axiosInstance from "./axiosInstance";

export interface Video {
  v_id: number;
  title: string;
  playlist_id: number;
  channel_name: string;
  thumbnail_url: string;
  created_at: string; // ISO timestamp
}

//가져오기
export async function getVideo(): Promise<Video[]> {
  const response = await axiosInstance.get<Video[]>("/video_table");
  return response.data;
}

//만들기
export async function createVideo(
  videoList: {
    title: string;
    playlist_id: number;
    channel_name: string;
    thumbnail_url: string;
  }[],
): Promise<void> {
  await axiosInstance.post("/video_table", videoList);
}

//수정하기
export async function patchVideo(): Promise<Video[]> {
  const response = await axiosInstance.patch<Video[]>("/video_table");
  return response.data;
}

//삭제하기
export async function deleteVideo(): Promise<Video[]> {
  const response = await axiosInstance.delete<Video[]>("/video_table");
  return response.data;
}
