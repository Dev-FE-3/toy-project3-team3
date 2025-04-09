import axiosInstance from "./axiosInstance";

export interface User {
  id: number;
  email: string;
  password: string;
  random_id: number;
  nickname: string;
  user_img: string;
  sort_intro: string;
  artist_hash_tag: string;
  created_at: string; // Supabase timestamp는 ISO string 형태로 옴
}

//가져오기
export async function getUser(): Promise<User[]> {
  const response = await axiosInstance.get<User[]>("/user_table")
  return response.data;
}

//만들기
export async function createUser(): Promise<User[]> {
  const response = await axiosInstance.post<User[]>("/user_table")
  return response.data;
}

//수정하기
export async function patchAllUser(): Promise<User[]> {
  const response = await axiosInstance.patch<User[]>("/user_table")
  return response.data;
}

//삭제하기
export async function deleteAllUser(): Promise<User[]> {
  const response = await axiosInstance.delete<User[]>("/user_table")
  return response.data;
}
