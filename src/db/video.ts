import axiosInstance from "@/db/axiosInstance";

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

// 여러 개 혹은 하나만 삭제할 수 있는 함수
export async function deleteVideosByIds(v_ids: number[]): Promise<void> {
  if (v_ids.length === 0) return;

  const idString = v_ids.join(",");
  await axiosInstance.delete(`/video_table?v_id=in.(${idString})`);
}
