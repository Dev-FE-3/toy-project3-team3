import styled from "@emotion/styled";
import Title, { StyledTitle } from "@/shared/component/Title";
import Dropbox from "@/shared/component/Dropbox";
import { useMemo, useState, useRef, useCallback } from "react";

import useHomeFeedPlaylists from "./hooks/useHomeFeedPlaylists";
import PlaylistCard from "@/pages/homeAndSearch/component/PlaylistCard";
import useLikedPlaylistIds from "@/pages/homeAndSearch/hooks/useLikedPlaylistIds";
import Loading from "@/shared/component/Loading";
import { useUserStore } from "@/stores/userStore";

const Home = () => {
  const [sortOrder, setSortOrder] = useState("최신순");

  const randomId = useUserStore((state) => state.user?.random_id);
  const { data: likedIds = [] } = useLikedPlaylistIds(randomId);

  const {
    playlists,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useHomeFeedPlaylists();

  const playlistWithLikeState = useMemo(() => {
    return playlists.map((item) => ({
      ...item,
      is_active: likedIds.includes(item.p_id),
    }));
  }, [playlists, likedIds]);

  const sortedPlaylistCards = useMemo(() => {
    return [...playlistWithLikeState].sort((a, b) => {
      if (sortOrder === "최신순") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        return b.like_count - a.like_count;
      }
    });
  }, [playlistWithLikeState, sortOrder]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  return (
    <>
      <Title
        leftContent={<StyledTitle>홈</StyledTitle>}
        rightContent={
          <Dropbox variant="text" value={sortOrder} onChange={setSortOrder} />
        }
      />
      <HomePage>
        <Container isEmpty={sortedPlaylistCards.length === 0}>
          {isLoading ? (
            <Loading />
          ) : sortedPlaylistCards.length === 0 ? (
            <EmptyMessage>
              관심 있는 이용자를 팔로우하여 <br />
              나만의 타임라인을 구성하세요 😄
            </EmptyMessage>
          ) : (
            <ScrollableList>
              {sortedPlaylistCards.map((item, index) => {
                const isLast = index === sortedPlaylistCards.length - 1;
                return (
                  <div ref={isLast ? lastItemRef : null} key={item.p_id}>
                    <PlaylistCard {...item} />
                  </div>
                );
              })}
            </ScrollableList>
          )}
        </Container>
      </HomePage>
    </>
  );
};

export default Home;

const HomePage = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 40px;
  align-items: flex-start;
  overflow-y: auto;
  height: 700px;
`;

const Container = styled.div<{ isEmpty?: boolean }>`
  height: 700px;
  width: 100%;
  display: ${({ isEmpty }) => (isEmpty ? "flex" : "block")};
  justify-content: center;
  align-items: center;
`;

const ScrollableList = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const EmptyMessage = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--font-size-subtitle);
  color: var(--text-secondary);
  margin: 0 auto;
  line-height: normal;
`;
