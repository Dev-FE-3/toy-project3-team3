import { useInfiniteQuery } from "@tanstack/react-query";
import { getFilteredPlaylistCardData } from "@/api/playlistCardData";
import useFollowList from "@/api/services/useFollowList";
import { useUserStore } from "@/stores/userStore";
import { Follow } from "@/api/follow";
import { useMemo } from "react";

const useHomeFeedPlaylists = () => {
  const currentUserId = useUserStore((state) => state.user?.random_id);

  // 팔로잉 리스트 (random_id → following_id)
  const { data: followList = [] } = useFollowList(
    currentUserId ?? -1,
    "following",
  );

  // followingId 배열 추출 (useMemo로 안정적으로 계산)
  const followingIds = useMemo(() => {
    return followList.map((f: Follow) => f.following_id);
  }, [followList]);

  // 무한스크롤 플레이리스트 요청
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["homeFeedPlaylists", followingIds],
      queryFn: ({ pageParam = 1 }) =>
        getFilteredPlaylistCardData({ pageParam, randomIds: followingIds }),
      enabled: !!currentUserId && followList.length > 0, // ✅ 조건이 충족돼야 실행됨
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  // 평탄화된 결과 리스트
  const flattenedList = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    playlists: flattenedList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  };
};

export default useHomeFeedPlaylists;
