import axiosInstance from "@/api/axiosInstance";

export interface Follow {
  f_id: number;
  random_id: number; // 팔로우를 누른 사람 (나)
  following_id: number; // 팔로우 당하는 사람 (상대)
  is_following: boolean;
  created_at: string;
}

// ✅ 1. 팔로우 상태 확인 (is_following: true인 경우만)
export const getFollowStatus = async (fromId?: number, toId?: number) => {
  if (!fromId || !toId) return null;

  const { data } = await axiosInstance.get<Follow[]>("/follow_table", {
    params: {
      random_id: `eq.${fromId}`,
      following_id: `eq.${toId}`,
      is_following: "eq.true",
    },
  });

  return data[0] ?? null;
};

// ✅ 2. 이미 존재하는 팔로우 row 확인 (is_following 여부 무관)
export const getExistingFollowRow = async (fromId: number, toId: number) => {
  const { data } = await axiosInstance.get<Follow[]>("/follow_table", {
    params: {
      random_id: `eq.${fromId}`,
      following_id: `eq.${toId}`,
    },
  });
  return data[0] ?? null;
};

// ✅ 3. 팔로우 생성 or 복원
export const postFollow = async ({
  fromId,
  toId,
}: {
  fromId: number;
  toId: number;
}) => {
  const existing = await getExistingFollowRow(fromId, toId);

  if (existing?.f_id) {
    // 🔥 복원 시 Prefer 헤더 꼭 추가!
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

  // 신규 생성
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
};

// ✅ 4. 언팔로우 (soft delete)
export const deleteFollow = async (f_id: number) => {
  const { data } = await axiosInstance.patch(
    `/follow_table?f_id=eq.${f_id}`,
    { is_following: false },
    {
      headers: {
        Prefer: "return=representation",
        "Content-Type": "application/json", // 이거 꼭 같이 넣어줘야 안정적
      },
    },
  );
  return data;
};

// ✅ 5. 팔로워 수
export const getFollowerCount = async (userId: number) => {
  const { data } = await axiosInstance.get("/follow_table", {
    params: {
      following_id: `eq.${userId}`,
      is_following: "eq.true",
      select: "f_id",
    },
  });
  return data.length;
};

// ✅ 6. 팔로잉 수
export const getFollowingCount = async (userId: number) => {
  const { data } = await axiosInstance.get("/follow_table", {
    params: {
      random_id: `eq.${userId}`,
      is_following: "eq.true",
      select: "f_id",
    },
  });
  return data.length;
};
