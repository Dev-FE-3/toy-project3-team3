import axiosInstance from "./axiosInstance";

export interface Comment {
  c_id: number;
  random_id: number;
  playlist_id: number;
  comment: string;
  created_at: string;
}

//가져오기
export async function getComment(): Promise<Comment[]> {
  const response = await axiosInstance.get<Comment[]>("/comments_table")
  return response.data;
}

// 예: 댓글 수 조회 함수
export async function getCommentCountByPlaylist(playlistId: number): Promise<number> {
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


//만들기
export async function createComment(): Promise<Comment[]> {
  const response = await axiosInstance.post<Comment[]>("/comments_table");
  return response.data;
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

