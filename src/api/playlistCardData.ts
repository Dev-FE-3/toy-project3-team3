//import { QueryFunctionContext } from "@tanstack/react-query";
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

  // is_active: boolean;
  like_count: number;
  comment_count: number;
}

interface PlaylistPageResponse {
  data: PlaylistCardData[];
  nextPage?: number;
}

// 전체 플레이리스트 카드 + 무한스크롤
// export const getPlaylistCardData = async (
//   context?: QueryFunctionContext,
// ): Promise<PlaylistPageResponse> => {
//   const pageParam = (context?.pageParam as number) ?? 1;
//   const limit = 3;
//   const offset = (pageParam - 1) * limit;

//   const res = await axiosInstance.get("/playlist_card_data", {
//     params: { limit, offset },
//   });

//   const data = res.data;
//   const nextPage = data.length === limit ? pageParam + 1 : undefined;

//   console.log("11data:::", data, "nextPage:::", nextPage);

//   return { data, nextPage };
// };

// playlistCardData.ts
// export const getPlaylistCardData = async (
//   pageParam: number = 1,
//   sortOrder: string = "최신순",
// ): Promise<PlaylistPageResponse> => {
//   const limit = 3;
//   const offset = (pageParam - 1) * limit;

//   // Supabase 기준 or 백엔드 기준으로 정렬 파라미터 생성
//   const orderBy =
//     sortOrder === "최신순" ? "created_at.desc" : "like_count.desc";

//   const res = await axiosInstance.get("/playlist_card_data", {
//     params: {
//       limit,
//       offset,
//       order: orderBy, // 👈 정렬 기준을 쿼리로 넘김
//     },
//   });

//   const data = res.data;
//   const nextPage = data.length === limit ? pageParam + 1 : undefined;

//   return { data, nextPage };
// };

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

  // ✅ Supabase REST 형식 기준: ilike 연산자
  if (searchKeyword) {
    params.playlist_title = `ilike.*${searchKeyword}*`;
  }

  const res = await axiosInstance.get("/playlist_card_data", { params });

  return {
    data: res.data,
    nextPage: res.data.length === limit ? pageParam + 1 : undefined,
  };
};

// // 팔로우 api이용해서 팔로잉중인 random_id를 받아서 조건으로 가져올 예정
// export const getFilteredPlaylistCardData = async ({
//   pageParam = 1,
//   randomIds,
// }: {
//   pageParam?: number;
//   randomIds: number[];
// }): Promise<PlaylistPageResponse> => {
//   const limit = 6;
//   const offset = (pageParam - 1) * limit;

//   if (!randomIds.length) {
//     return { data: [], nextPage: undefined };
//   }

//   // Supabase(PostgREST)는 `in` 연산을 `in.(1,2,3)` 형태로 보냄
//   const randomIdFilter = `in.(${randomIds.join(",")})`;

//   const res = await axiosInstance.get<PlaylistCardData[]>(
//     "/playlist_card_data",
//     {
//       params: {
//         limit,
//         offset,
//         random_id: randomIdFilter,
//       },
//     },
//   );

//   const data = res.data;
//   const nextPage = data.length === limit ? pageParam + 1 : undefined;

//   return { data, nextPage };
// };

export const getFilteredPlaylistCardData = async ({
  pageParam = 1,
  randomIds,
}: {
  pageParam?: number;
  randomIds: number[];
}): Promise<PlaylistPageResponse> => {
  const limit = 6;
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
