import axiosInstance from "@/db/axiosInstance";

//가져오기
// export async function getVideo(p_id: number): Promise<Video[]> {
//   const response = await axiosInstance.get<Video[]>(
//     `/video_table?playlist_id=eq.${p_id}`,
//   );
//   return response.data;
// }

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
// export async function patchVideo(): Promise<Video[]> {
//   const response = await axiosInstance.patch<Video[]>("/video_table");
//   return response.data;
// }

//삭제하기
// export async function deleteVideo(): Promise<Video[]> {
//   const response = await axiosInstance.delete<Video[]>("/video_table");
//   return response.data;
// }

// 여러 개 혹은 하나만 삭제할 수 있는 함수
export async function deleteVideosByIds(v_ids: number[]): Promise<void> {
  if (v_ids.length === 0) return;

  const idString = v_ids.join(",");
  await axiosInstance.delete(`/video_table?v_id=in.(${idString})`);
}
