import { getLikedPlaylistIds } from "@/db/likeActive";
import { useQuery } from "@tanstack/react-query";

const useLikedPlaylistIds = (randomId?: number) => {
  return useQuery({
    queryKey: ["likedPlaylistIds", randomId],
    queryFn: () => {
      if (!randomId) return Promise.resolve([]);
      return getLikedPlaylistIds(randomId);
    },
    enabled: !!randomId,
    staleTime: 1000 * 60, // 1분 정도 캐싱해도 괜찮음
  });
};

export default useLikedPlaylistIds;
