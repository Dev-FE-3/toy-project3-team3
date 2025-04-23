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
  try {
    const response = await axiosInstance.get<User[]>("/user_table");
    return response.data;
  } catch (error) {
    console.error("getUser 에러:", error);
    return [];
  }
}

//수정하기
export async function updateUser(
  id: number,
  updatedFields: Partial<User>,
): Promise<User> {
  try {
    const response = await axiosInstance.patch<User>(
      `/user_table?id=eq.${id}`,
      updatedFields,
    );
    return response.data;
  } catch (error) {
    console.error("updateUser 에러:", error);
    throw error;
  }
}

// 닉네임 중복 체크
export const isNicknameDuplicated = async (nickname: string) => {
  try {
    const { data } = await axiosInstance.get("/user_table", {
      params: {
        nickname: `eq.${nickname}`,
        select: "id",
      },
    });
    return data.length > 0;
  } catch (error) {
    console.error("isNicknameDuplicated 에러:", error);
    return false; // 에러 발생 시 중복 아님으로 처리 (보수적으로 동작)
  }
};

// 랜덤 아이디로 유저 찾기
export async function getUserByRandomId(
  randomId: number,
): Promise<User | null> {
  try {
    const response = await axiosInstance.get<User[]>(
      `/user_table?random_id=eq.${randomId}`,
    );
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error("getUserByRandomId 에러:", error);
    return null;
  }
}
