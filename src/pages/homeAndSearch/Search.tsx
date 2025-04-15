import { useInfiniteQuery } from "@tanstack/react-query";
import Dropbox from "@/shared/component/Dropbox";
import Title, { StyledTitle } from "@/shared/component/Title";
import { useMemo, useState, useRef, useCallback } from "react";
import { getPlaylistCardData, PlaylistCardData } from "@/api/playlistCardData";
import styled from "@emotion/styled";
import CommonInput from "@/shared/component/input";
import PlaylistCard from "./component/PlaylistCard";

const Search = () => {
  const [sortOrder, setSortOrder] = useState("최신순");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    // status,
  } = useInfiniteQuery({
    queryKey: ["playlistCardData"],
    queryFn: getPlaylistCardData,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  console.log("📦 useInfiniteQuery로 받은 data: ", data);

  // 페이지 전체 데이터 평탄화 + 좋아요 상태 추가
  const playlistCard: (PlaylistCardData & { is_active: boolean })[] =
    useMemo(() => {
      if (!data) return [];
      return data.pages.flatMap((page) =>
        page.data.map((item) => ({
          ...item,
          is_active: false, // 추후 상태 반영 예정
        })),
      );
    }, [data]);

  // 정렬된 데이터
  const sortedPlaylistCards = useMemo(() => {
    return [...playlistCard].sort((a, b) => {
      if (sortOrder === "최신순") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        return b.like_count - a.like_count;
      }
    });
  }, [playlistCard, sortOrder]);

  //IntersectionOvserver 정의
  const observerRef = useRef<IntersectionObserver | null>(null);

  //마지막 요소 감지하는 ref
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage(); // 다음 페이지 요청
          }
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 1.0, // ✅ 100% 다 보여야 감지됨 (기본값은 0)
        },
      );

      if (node) observerRef.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  return (
    <>
      <Title
        leftContent={
          <>
            <StyledTitle>탐색</StyledTitle>
            <CommonInput
              placeholder="영상 제목을 검색해주세요."
              width="200px"
            />
          </>
        }
        rightContent={
          <Dropbox variant="text" value={sortOrder} onChange={setSortOrder} />
        }
      />

      <SearchPage className="searchPage">
        <Container>
          <ScrollableList className="scrollableList">
            {sortedPlaylistCards.map((item, index) => {
              const isLast = index === sortedPlaylistCards.length - 1;

              return (
                <div ref={isLast ? lastItemRef : null} key={item.p_id}>
                  <PlaylistCard
                    key={item.p_id}
                    p_id={item.p_id}
                    cover_img_path={item.cover_img_path}
                    playlist_title={item.playlist_title}
                    video_count={item.video_count}
                    user_img={item.user_img}
                    nickname={item.nickname}
                    like_count={item.like_count}
                    comment_count={item.comment_count}
                    is_active={item.is_active}
                    onLikeClick={() => console.log(item.is_active)}
                  />
                </div>
              );
            })}
          </ScrollableList>
        </Container>
      </SearchPage>
    </>
  );
};

export default Search;

const SearchPage = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 40px;
  align-items: flex-start;
  overflow-y: auto;
`;
const Container = styled.div`
  height: 300px;
`;

const ScrollableList = styled.div`
  overflow-y: auto; // 스크롤은 전체 페이지에서 생기게
  overflow-x: hidden; // 가로 스크롤 제거
  display: flex;
  flex-direction: column;
`;
