import { QueryFunctionContext } from "@tanstack/react-query";
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

// 전체 플레이리스트 카드 + 무한스크롤
export const getPlaylistCardData = async (
  context?: QueryFunctionContext,
): Promise<PlaylistPageResponse> => {
  const pageParam = (context?.pageParam as number) ?? 1;
  const limit = 3;
  const offset = (pageParam - 1) * limit;

  const res = await axiosInstance.get("/playlist_card_data", {
    params: { limit, offset },
  });

  const data = res.data;
  const nextPage = data.length === limit ? pageParam + 1 : undefined;

  console.log("11data:::", data, "nextPage:::", nextPage);

  return { data, nextPage };
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
