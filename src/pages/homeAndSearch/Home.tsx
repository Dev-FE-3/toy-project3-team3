import styled from "@emotion/styled";
import Title, { StyledTitle } from "@/shared/component/Title";
import Dropbox from "@/shared/component/Dropbox";
import { useMemo, useState, useRef, useCallback } from "react";

import useHomeFeedPlaylists from "./hooks/useHomeFeedPlaylists";
import PlaylistCard from "@/pages/homeAndSearch/component/PlaylistCard";

const Home = () => {
  const [sortOrder, setSortOrder] = useState("최신순");

  const {
    playlists,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useHomeFeedPlaylists();

  const sortedPlaylistCards = useMemo(() => {
    return [...playlists].sort((a, b) => {
      if (sortOrder === "최신순") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        return b.like_count - a.like_count;
      }
    });
  }, [playlists, sortOrder]);

  // ✅ IntersectionObserver
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
        <ScrollableList>
          {isLoading ? (
            <div>로딩 중...</div>
          ) : sortedPlaylistCards.length === 0 ? (
            <div>팔로우한 유저가 없습니다 🥲</div>
          ) : (
            sortedPlaylistCards.map((item, index) => {
              const isLast = index === sortedPlaylistCards.length - 1;
              return (
                <div ref={isLast ? lastItemRef : null} key={item.p_id}>
                  <PlaylistCard
                    {...item}
                    is_active={false}
                    onLikeClick={() => console.log(item.p_id)}
                  />
                </div>
              );
            })
          )}
        </ScrollableList>
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

// const Container = styled.div`
//   //height: 300px;
//   //height: (100%-600px);
//   //height: calc(100vh-500px);
//   //height: 850px;
//   height: 700px;
// `;

const ScrollableList = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;
