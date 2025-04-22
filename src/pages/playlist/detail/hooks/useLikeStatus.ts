import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLikeStatus,
  addLike,
  updateLikeActive,
  getLikeCountByPlaylist,
} from "@/db/like";
import { useEffect, useState } from "react";
import { getCommentCountByPlaylist } from "@/db/comment";

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
      setLikeCount((prev) => prev + 1); // 먼저 화면 업데이트 (좋아요 수 증가)
      like.mutate(
        { random_id: userId, playlist_id: playlistId },
        {
          onError: () => {
            // ❌ 실패하면 원상복구
            setLikeCount((prev) => prev - 1);
          },
        },
      );
      return;
    }

    // 좋아요 row 존재 시 → is_active 상태 토글
    const nextActive = !data.is_active;

    // 1️⃣ 먼저 화면 업데이트 (optimistic update)
    setLikeCount((prev) => prev + (nextActive ? 1 : -1));

    try {
      await toggleLike.mutateAsync({
        l_id: data.l_id,
        is_active: nextActive,
      });

    } catch (error) {
      console.error("❌ 좋아요 상태 토글 실패:", error);
      setLikeCount((prev) => prev + (nextActive ? -1 : 1));
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
