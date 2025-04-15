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
  const response = await axiosInstance.get<User[]>("/user_table");
  return response.data;
}

//만들기
export async function createUser(): Promise<User[]> {
  const response = await axiosInstance.post<User[]>("/user_table");
  return response.data;
}

//수정하기
export async function updateUser(
  id: number,
  updatedFields: Partial<User>,
): Promise<User> {
  const response = await axiosInstance.patch<User>(
    `/user_table?id=eq.${id}`, // 쿼리 파라미터를 사용하여 id를 찾음
    updatedFields,
  ); // 변경하고 싶은 유저 정보를 담는 객체를 지정해야함!
  return response.data;
}


// 현재로서 사용하지 않음
export async function deleteAllUser(): Promise<User[]> {
  const response = await axiosInstance.delete<User[]>("/user_table");
  return response.data;
}
