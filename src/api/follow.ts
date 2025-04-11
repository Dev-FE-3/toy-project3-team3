import axiosInstance from "./axiosInstance";

export interface Follow {
  f_id: number;
  randeom_id: number; // 팔로우를 누른 사람 (나 자신)
  following_id: number; // 팔로우 당한 사람 (상대방)
  is_following: boolean; // 팔로우 여부 (soft delete 용도도 가능)
  created_at: string;
}

//가져오기
export async function getFollow(): Promise<Follow[]> {
  const response = await axiosInstance.get<Follow[]>("/follow_table");
  return response.data;
}

//만들기
export async function createFollow(): Promise<Follow[]> {
  const response = await axiosInstance.post<Follow[]>("/follow_table");
  return response.data;
}

//수정하기
export async function patchFollow(): Promise<Follow[]> {
  const response = await axiosInstance.patch<Follow[]>("/follow_table");
  return response.data;
}

//현재로서 사용하지 않음
export async function deleteFollow(): Promise<Follow[]> {
  const response = await axiosInstance.delete<Follow[]>("/follow_table");
  return response.data;
}
