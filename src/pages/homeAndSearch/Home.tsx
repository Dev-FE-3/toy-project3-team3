import styled from "@emotion/styled";
import Title, { StyledTitle } from "@/shared/component/Title";
import Dropbox from "@/shared/component/Dropbox";
import { useMemo, useState, useRef, useCallback, useEffect } from "react";

import useHomeFeedPlaylists from "./hooks/useHomeFeedPlaylists";
import PlaylistCard from "@/pages/homeAndSearch/component/PlaylistCard";
import useLikedPlaylistIds from "@/pages/homeAndSearch/hooks/useLikedPlaylistIds";
import Loading from "@/shared/component/Loading";
import { useUserStore } from "@/stores/userStore";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const Home = () => {
  const [sortOrder, setSortOrder] = useState<number>(1);

  const randomId = useUserStore((state) => state.user?.random_id);
  const { data: likedIds = [] } = useLikedPlaylistIds(randomId);

  const location = useLocation(); // 👈 경로 감지를 위한 훅
  const queryClient = useQueryClient(); // 👈 React Query 클라이언트

  useEffect(() => {
    if (randomId) {
      queryClient.invalidateQueries({
        queryKey: ["likedPlaylistIds", randomId],
      });
    }
  }, [location.pathname, randomId, queryClient]);

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
      if (sortOrder === 1) {
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
    <HomePage>
      <TitleWrapper>
        <Title
          leftContent={<StyledTitle>홈</StyledTitle>}
          rightContent={
            <Dropbox variant="text" value={sortOrder} onChange={setSortOrder} />
          }
        />
      </TitleWrapper>

      <ScrollableArea>
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
      </ScrollableArea>
    </HomePage>
  );
};

export default Home;

const HomePage = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

const TitleWrapper = styled.div`
  flex-shrink: 0;
`;

const ScrollableArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 40px;
`;

const Container = styled.div<{ isEmpty?: boolean }>`
  width: 100%;
  display: ${({ isEmpty }) => (isEmpty ? "flex" : "block")};
  justify-content: ${({ isEmpty }) => (isEmpty ? "center" : "initial")};
  align-items: ${({ isEmpty }) => (isEmpty ? "center" : "initial")};
  flex: 1;
`;

const ScrollableList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 80px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  font-size: var(--font-size-subtitle);
  color: var(--text-secondary);
  line-height: normal;
`;
