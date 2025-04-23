import axiosInstance from "./axiosInstance";

export interface PlaylistCardData {
  p_id: number;
  video_count: number;
  cover_img_path: string;
  playlist_title: string;
  is_delete: boolean;
  created_at: string;

  random_id: number;
  nickname: string;
  user_img: string;

  is_active: boolean;
  like_count: number;
  comment_count: number;
}

export interface PlaylistPageResponse {
  data: PlaylistCardData[];
  nextPage?: number;
}

export async function getAllPlaylistCardData(): Promise<PlaylistCardData[]> {
  const res = await axiosInstance.get<PlaylistCardData[]>(
    "/playlist_card_data",
    {
      params: {
        is_delete: "eq.false",
      },
    },
  );

  return res.data;
}

// 전체 플레이리스트 카드 + 무한스크롤
export const getPlaylistCardData = async (
  pageParam: number = 1,
  sortOrder: string = "최신순",
  searchKeyword: string = "",
): Promise<PlaylistPageResponse> => {
  const limit = 3;
  const offset = (pageParam - 1) * limit;

  const orderBy =
    sortOrder === "최신순" ? "created_at.desc" : "like_count.desc";

  const params: Record<string, string | number> = {
    limit,
    offset,
    order: orderBy,
  };

  // Supabase REST 형식 기준: ilike 연산자
  if (searchKeyword) {
    params.playlist_title = `ilike.*${searchKeyword}*`;
  }

  const res = await axiosInstance.get("/playlist_card_data", { params });

  return {
    data: res.data,
    nextPage: res.data.length === limit ? pageParam + 1 : undefined,
  };
};

export const getFilteredPlaylistCardData = async ({
  pageParam = 1,
  randomIds,
}: {
  pageParam?: number;
  randomIds: number[];
}): Promise<PlaylistPageResponse> => {
  const limit = 3;
  const offset = (pageParam - 1) * limit;

  if (!randomIds.length) {
    return { data: [], nextPage: undefined };
  }

  const randomIdFilter = `in.(${randomIds.join(",")})`;

  const res = await axiosInstance.get<PlaylistCardData[]>(
    "/playlist_card_data",
    {
      params: {
        limit,
        offset,
        random_id: randomIdFilter,
      },
    },
  );

  const data = res.data;
  const nextPage = data.length === limit ? pageParam + 1 : undefined;

  return { data, nextPage };
};

// 내가 만든 플레이리스트
export async function getMyPlaylists(
  randomId: number,
): Promise<PlaylistCardData[]> {
  const { data } = await axiosInstance.get<PlaylistCardData[]>(
    "/playlist_card_data",
    {
      params: {
        random_id: `eq.${randomId}`,
        is_delete: "eq.false", // 삭제되지 않은 항목만
      },
    },
  );
  return data;
}
