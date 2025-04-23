import axiosInstance from "./axiosInstance";

export interface Follow {
  f_id: number;
  random_id: number; // 팔로우를 누른 사람 (나 자신)
  following_id: number; // 팔로우 당한 사람 (상대방)
  is_following: boolean; // 팔로우 여부 (soft delete 용도도 가능)
  created_at: string;
}

//가져오기
// export async function getFollow(): Promise<Follow[]> {
//   const response = await axiosInstance.get<Follow[]>("/follow_table");
//   return response.data;
// }

//만들기
// export async function createFollow(): Promise<Follow[]> {
//   const response = await axiosInstance.post<Follow[]>("/follow_table");
//   return response.data;
// }

//수정하기
// export async function patchFollow(): Promise<Follow[]> {
//   const response = await axiosInstance.patch<Follow[]>("/follow_table");
//   return response.data;
// }

// 팔로우 상태 확인 (is_following: true인 경우만)
export const getFollowStatus = async (fromId?: number, toId?: number) => {
  if (!fromId || !toId) return null;
  try {
    const { data } = await axiosInstance.get<Follow[]>("/follow_table", {
      params: {
        random_id: `eq.${fromId}`,
        following_id: `eq.${toId}`,
        is_following: "eq.true",
      },
    });
    return data[0] ?? null;
  } catch (error) {
    console.error("getFollowStatus 에러:", error);
    return null;
  }
};

// 이미 존재하는 팔로우 row 확인 (is_following 여부 무관)
export const getExistingFollowRow = async (fromId: number, toId: number) => {
  try {
    const { data } = await axiosInstance.get<Follow[]>("/follow_table", {
      params: {
        random_id: `eq.${fromId}`,
        following_id: `eq.${toId}`,
      },
    });
    return data[0] ?? null;
  } catch (error) {
    console.error("getExistingFollowRow 에러:", error);
    return null;
  }
};

// 팔로우 생성 or 복원
export const postFollow = async ({
  fromId,
  toId,
}: {
  fromId: number;
  toId: number;
}) => {
  try {
    const existing = await getExistingFollowRow(fromId, toId);

    if (existing?.f_id) {
      const res = await axiosInstance.patch(
        `/follow_table?f_id=eq.${existing.f_id}`,
        { is_following: true },
        {
          headers: {
            Prefer: "return=representation",
            "Content-Type": "application/json",
          },
        },
      );
      return res.data;
    }

    const res = await axiosInstance.post(
      "/follow_table",
      {
        random_id: fromId,
        following_id: toId,
        is_following: true,
      },
      {
        headers: {
          Prefer: "return=representation",
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error("postFollow 에러:", error);
    throw error;
  }
};

// 언팔로우 (soft delete)
export const deleteFollow = async (f_id: number) => {
  try {
    const { data } = await axiosInstance.patch(
      `/follow_table?f_id=eq.${f_id}`,
      { is_following: false },
      {
        headers: {
          Prefer: "return=representation",
          "Content-Type": "application/json",
        },
      },
    );
    return data;
  } catch (error) {
    console.error("deleteFollow 에러:", error);
    throw error;
  }
};

// 팔로워 수
export const getFollowerCount = async (userId: number) => {
  try {
    const { data } = await axiosInstance.get("/follow_table", {
      params: {
        following_id: `eq.${userId}`,
        is_following: "eq.true",
        select: "f_id",
      },
    });
    return data.length;
  } catch (error) {
    console.error("getFollowerCount 에러:", error);
    return 0;
  }
};

// 팔로잉 수
export const getFollowingCount = async (userId: number) => {
  try {
    const { data } = await axiosInstance.get("/follow_table", {
      params: {
        random_id: `eq.${userId}`,
        is_following: "eq.true",
        select: "f_id",
      },
    });
    return data.length;
  } catch (error) {
    console.error("getFollowingCount 에러:", error);
    return 0;
  }
};

export const fetchFollowList = async (
  targetId: number,
  type: "follower" | "following",
) => {
  try {
    const isFollower = type === "follower";
    const queryKey = isFollower ? "following_id" : "random_id";

    const response = await axiosInstance.get("/follow_table", {
      params: {
        [`${queryKey}`]: `eq.${targetId}`,
        is_following: "eq.true",
        select: "random_id, following_id",
      },
    });

    return response.data;
  } catch (error) {
    console.error("fetchFollowList 에러:", error);
    return [];
  }
};
