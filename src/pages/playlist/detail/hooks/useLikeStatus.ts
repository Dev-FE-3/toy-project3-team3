import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLikeStatus,
  addLike,
  updateLikeActive,
  getLikeCountByPlaylist,
} from "@/shared/api/like";
import { useEffect, useState } from "react";
import { getCommentCountByPlaylist } from "@/shared/api/comment";

export const useLikeStatus = (userId?: number, playlistId?: number) => {
  const [likeCount, setLikeCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
  const queryClient = useQueryClient();

  // 좋아요 상태 조회
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["likeStatus", userId, playlistId],
    queryFn: () => getLikeStatus(userId!, playlistId!),
    enabled: !!userId && !!playlistId,
  });

  // 좋아요 수 조회
  useEffect(() => {
    const fetchLikeCount = async () => {
      if (!playlistId) return;
      const likeCount = await getLikeCountByPlaylist(playlistId);
      setLikeCount(likeCount);
    };

    fetchLikeCount();
  }, [playlistId]);

  // 댓글 수 조회
  useEffect(() => {
    const fetchCommentCount = async () => {
      if (!playlistId) return;
      const commentCount = await getCommentCountByPlaylist(playlistId);
      setCommentCount(commentCount);
    };
    fetchCommentCount();
  }, [playlistId]);

  // 좋아요 추가
  const like = useMutation({
    mutationFn: addLike,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["likeStatus", userId, playlistId],
      });
    },
  });

  // 좋아요 상태 토글 (true <-> false)
  const toggleLike = useMutation({
    mutationFn: (payload: { l_id: number; is_active: boolean }) =>
      updateLikeActive(payload.l_id, payload.is_active),
    onError: (err) => {
      console.error("❌ PATCH 실패:", err);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["likeStatus", userId, playlistId],
      });
    },
  });

  const handleLikeToggle = async () => {
    if (!userId || !playlistId) return;

    // 좋아요 row가 존재하지 않으면 → 새로 생성 (is_active: true)
    if (!data) {
      like.mutate({ random_id: userId, playlist_id: playlistId });
      setLikeCount((prev) => prev + 1); // 👍 좋아요 수 증가
      return;
    }

    // 좋아요 row 존재 시 → is_active 상태 토글
    const nextActive = !data.is_active;

    try {
      await toggleLike.mutateAsync({
        l_id: data.l_id,
        is_active: nextActive,
      });

      // 좋아요 수 증감 반영
      setLikeCount((prev) => prev + (nextActive ? 1 : -1));

      // 최신 상태 다시 조회
      await refetch();
    } catch (error) {
      console.error("❌ 좋아요 상태 토글 실패:", error);
    }
  };

  return {
    isLiked: !!data?.is_active,
    isLoading,
    likeCount,
    handleLikeToggle,
    commentCount,
  };
};
