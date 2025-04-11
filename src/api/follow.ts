import axiosInstance from "./axiosInstance";

export interface Follow {
  f_id: number;
  randeom_id: number;
  following_id: number;
  is_following: boolean;
  created_at: string;
}

//가져오기
export async function getFollow(): Promise<Follow[]> {
  const response = await axiosInstance.get<Follow[]>("/follow_table")
  return response.data;
}

//만들기
export async function createFollow(): Promise<Follow[]> {
  const response = await axiosInstance.post<Follow[]>("/follow_table")
  return response.data;
}

//수정하기
export async function patchFollow(): Promise<Follow[]> {
  const response = await axiosInstance.patch<Follow[]>("/follow_table")
  return response.data;
}

//현재로서 사용하지 않음
 export async function deleteFollow(): Promise<Follow[]> {
   const response = await axiosInstance.delete<Follow[]>("/follow_table")
   return response.data;
 }
