import axiosInstance from "./axiosInstance";

export interface Like {
  l_id: number;
  playlist_id: number;
  comment: string;
  is_active: boolean;
  created_at: string;
}

//가져오기
export async function getLike(): Promise<Like[]> {
  const response = await axiosInstance.get<Like[]>("/likes_table")
  return response.data;
}

//만들기
export async function createLike(): Promise<Like[]> {
  const response = await axiosInstance.post<Like[]>("/likes_table")
  return response.data;
}

//수정하기
export async function patchLike(): Promise<Like[]> {
  const response = await axiosInstance.patch<Like[]>("/likes_table")
  return response.data;
}

//현재로서 사용하지 않음
export async function deleteLike(): Promise<Like[]> {
  const response = await axiosInstance.delete<Like[]>("/likes_table")
  return response.data;
}
