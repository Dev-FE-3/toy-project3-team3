import axiosInstance from "./axiosInstance";

export interface CommentType {
  c_id: number;
  random_id: number;
  playlist_id: number;
  comment: string;
  created_at: string;
}

export interface CommentWithUserInfo {
  c_id: number;
  playlist_id: number;
  comment: string;
  created_at: number;
  random_id: number;
  user_nickname: string;
  user_img: string;
}

// 댓글이랑 작성자 정보
export const getCommentWithUserInfo = async (
  playlistId: number,
): Promise<CommentWithUserInfo[]> => {
  const response = await axiosInstance.get<CommentWithUserInfo[]>(
    "/comment_with_user_info",
    {
      params: {
        playlist_id: `eq.${playlistId}`,
        order: "comment_created_at.desc",
      },
    },
  );
  console.log("가져오고 있는 데이터 확잌 ::::::", response.data);
  return response.data;
};

//댓글 작성
export async function createComment(payload: {
  playlist_id: number;
  random_id: number;
  comment: string;
}): Promise<CommentWithUserInfo[]> {
  const response = await axiosInstance.post<CommentWithUserInfo[]>(
    "/comments_table",
    [payload],
    {
      headers: {
        Prefer: "return=representation",
      },
    },
  );
  return response.data;
}

//가져오기
export async function getComment(playlistId: number): Promise<CommentType[]> {
  const response = await axiosInstance.get<CommentType[]>(`/comments_table`, {
    params: {
      playlist_id: `eq.${playlistId}`,
    },
  });
  return response.data;
}

// 댓글 수 조회 함수
export async function getCommentCountByPlaylist(
  playlistId: number,
): Promise<number> {
  const { data, status } = await axiosInstance.get(`/comments_table`, {
    params: {
      playlist_id: `eq.${playlistId}`,
      select: "c_id", // 꼭 필요한 컬럼만 선택 (최적화)
    },
  });

  if (status !== 200 || !Array.isArray(data)) {
    console.error("댓글 수 조회 실패", data);
    return 0;
  }

  return data.length;
}



// 현재로서 사용하지 않음
export async function patchComment(): Promise<Comment[]> {
  const response = await axiosInstance.patch<Comment[]>("/comments_table");
  return response.data;
}

// 현재로서 사용하지 않음
export async function deleteComment(): Promise<Comment[]> {
  const response = await axiosInstance.delete<Comment[]>("/comments_table");
  return response.data;
}

