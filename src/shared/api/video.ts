import axiosInstance from "@/shared/api/axiosInstance";

//만들기
export async function createVideo(
  videoList: {
    title: string;
    playlist_id: number;
    channel_name: string;
    thumbnail_url: string;
  }[],
): Promise<void> {
  try {
    await axiosInstance.post("/video_table", videoList);
  } catch (error) {
    console.error("createVideo 에러:", error);
    throw error;
  }
}

// 여러 개 혹은 하나만 삭제할 수 있는 함수
export async function deleteVideosByIds(v_ids: number[]): Promise<void> {
  if (v_ids.length === 0) return;

  try {
    const idString = v_ids.join(",");
    await axiosInstance.delete(`/video_table?v_id=in.(${idString})`);
  } catch (error) {
    console.error("deleteVideosByIds 에러:", error);
    throw error;
  }
}
