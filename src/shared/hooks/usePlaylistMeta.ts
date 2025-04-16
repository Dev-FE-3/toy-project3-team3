// hooks/usePlaylistMeta.ts
import { useQuery } from "@tanstack/react-query";
import { getLikeStatus, getLikeCountByPlaylist} from "@/api/like";
import { useUserStore } from "@/stores/userStore";
import { getCommentCountByPlaylist } from "@/api/comment";

export const usePlaylistMeta = (playlistId: number) => {
  const userId = useUserStore((state) => state.user?.random_id);

  const { data: likeStatusData } = useQuery({
    queryKey: ["likeStatus", userId, playlistId],
    queryFn: () => getLikeStatus(userId!, playlistId),
    enabled: !!userId && !!playlistId,
  });

  const { data: likeCount = 0 } = useQuery({
    queryKey: ["likeCount", playlistId],
    queryFn: () => getLikeCountByPlaylist(playlistId),
    enabled: !!playlistId,
  });

  const { data: commentCount = 0 } = useQuery({
    queryKey: ["commentCount", playlistId],
    queryFn: () => getCommentCountByPlaylist(playlistId),
    enabled: !!playlistId,
  });

  return {
    isLiked: likeStatusData?.is_active ?? false,
    likeCount,
    commentCount,
  };
};
