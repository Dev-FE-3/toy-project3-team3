import { useInfiniteQuery } from "@tanstack/react-query";
import { getFilteredPlaylistCardData } from "@/api/playlistCardData";
import useFollowList from "@/api/services/useFollowList";
import { useUserStore } from "@/stores/userStore";
import { Follow } from "@/api/follow";

const useHomeFeedPlaylists = () => {
  // 1. 내가 팔로우한 사람들 가져오기
  const currentUserId = useUserStore((state) => state.user?.id);

  // 👇 조건 분기
  const { data: followList = [] } = useFollowList(
    currentUserId ?? -1, // 또는 그냥 0도 가능
    "following",
  );

  // 2. following_id 배열 추출
  const followingIds = followList.map((f: Follow) => f.following_id);

  // 3. 무한스크롤 쿼리
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["homeFeedPlaylists", followingIds],
      queryFn: ({ pageParam = 1 }) =>
        getFilteredPlaylistCardData({ pageParam, randomIds: followingIds }),
      enabled: !!currentUserId && followingIds.length > 0,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  // 4. 평탄화된 데이터
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
