import { getCommentCountByPlaylist } from "@/shared/api/comment";
import {
  addLike,
  getLikeCountByPlaylist,
  getLikeStatus,
  updateLikeActive,
} from "@/shared/api/like";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useLikeStatus = (userId?: number, playlistId?: number) => {
  const queryClient = useQueryClient();

  // 좋아요 상태 조회
  const { data, isLoading } = useQuery({
    queryKey: ["likeStatus", userId, playlistId],
    queryFn: () => getLikeStatus(userId!, playlistId!),
    enabled: !!userId && !!playlistId,
  });

  // 좋아요 수 조회
  const { data: likeCount = 0 } = useQuery({
    queryKey: ["likeCount", playlistId],
    queryFn: () => getLikeCountByPlaylist(playlistId!),
    enabled: !!playlistId,
  });

  // 댓글 수 조회
  const { data: commentCount = 0 } = useQuery({
    queryKey: ["commentCount", playlistId],
    queryFn: () => getCommentCountByPlaylist(playlistId!),
    enabled: !!playlistId,
  });

  // 좋아요 추가
  const like = useMutation({
    mutationFn: addLike,
    onMutate: async (_newData) => {
      await queryClient.cancelQueries({ queryKey: ["likeCount", playlistId] });

      const previousLikeCount = queryClient.getQueryData<number>([
        "likeCount",
        playlistId,
      ]);

      if (typeof previousLikeCount === "number") {
        queryClient.setQueryData(
          ["likeCount", playlistId],
          previousLikeCount + 1,
        );
      }

      return { previousLikeCount };
    },
    onError: (err, _variables, context) => {
      if (typeof context?.previousLikeCount === "number") {
        queryClient.setQueryData(
          ["likeCount", playlistId],
          context.previousLikeCount,
        );
      }
      console.error("❌ 좋아요 추가 실패:", err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["likeStatus", userId, playlistId],
      });
      queryClient.invalidateQueries({ queryKey: ["likeCount", playlistId] });
    },
  });

  // 좋아요 상태 토글 (true <-> false)
  const toggleLike = useMutation({
    mutationFn: (payload: { l_id: number; is_active: boolean }) =>
      updateLikeActive(payload.l_id, payload.is_active),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: ["likeStatus", userId, playlistId],
      });
      await queryClient.cancelQueries({ queryKey: ["likeCount", playlistId] });

      const previousData = queryClient.getQueryData<{
        is_active: boolean;
        l_id: number;
      }>(["likeStatus", userId, playlistId]);

      const previousLikeCount = queryClient.getQueryData<number>([
        "likeCount",
        playlistId,
      ]);

      if (previousData) {
        queryClient.setQueryData(["likeStatus", userId, playlistId], {
          ...previousData,
          is_active: payload.is_active,
        });
      }

      if (typeof previousLikeCount === "number") {
        // ★ 추가!
        queryClient.setQueryData(
          ["likeCount", playlistId],
          payload.is_active ? previousLikeCount + 1 : previousLikeCount - 1,
        );
      }

      return { previousData, previousLikeCount };
    },
    onError: (err, _variables, context) => {
      console.error("❌ PATCH 실패:", err);

      if (context?.previousData) {
        queryClient.setQueryData(
          ["likeStatus", userId, playlistId],
          context.previousData,
        );
      }
      if (typeof context?.previousLikeCount === "number") {
        queryClient.setQueryData(
          ["likeCount", playlistId],
          context.previousLikeCount,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["likeStatus", userId, playlistId],
      });
      queryClient.invalidateQueries({ queryKey: ["likeCount", playlistId] });
    },
  });

  const handleLikeToggle = async () => {
    if (!userId || !playlistId) return;

    // 좋아요 row가 존재하지 않으면 → 새로 생성 (is_active: true)
    if (!data) {
      like.mutate({ random_id: userId, playlist_id: playlistId });
      return;
    }

    // 좋아요 row 존재 시 → is_active 상태 토글
    const nextActive = !data.is_active;

    try {
      await toggleLike.mutateAsync({
        l_id: data.l_id,
        is_active: nextActive,
      });
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
