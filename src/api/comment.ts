import axiosInstance from "./axiosInstance";

export interface Comment {
  c_id: number;
  user_id: number;
  playlist_id: number;
  comment: string;
  created_at: string;
}

//가져오기
export async function getComment(): Promise<Comment[]> {
  const response = await axiosInstance.get<Comment[]>("/comments_table")
  return response.data;
}

//만들기
export async function createComment(): Promise<Comment[]> {
  const response = await axiosInstance.post<Comment[]>("/comments_table")
  return response.data;
}

// 현재로서 사용하지 않음
export async function patchComment(): Promise<Comment[]> {
  const response = await axiosInstance.patch<Comment[]>("/comments_table")
  return response.data;
}

// 현재로서 사용하지 않음
export async function deleteComment(): Promise<Comment[]> {
  const response = await axiosInstance.delete<Comment[]>("/comments_table")
  return response.data;
}
