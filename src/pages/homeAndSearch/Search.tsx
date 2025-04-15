import { useInfiniteQuery } from "@tanstack/react-query";
import Dropbox from "@/shared/component/Dropbox";
import Title, { StyledTitle } from "@/shared/component/Title";
import { useMemo, useState, useRef, useCallback } from "react";
import { getPlaylistCardData, PlaylistCardData } from "@/api/playlistCardData";
import styled from "@emotion/styled";
import CommonInput from "@/shared/component/input";
import PlaylistCard from "@/pages/homeAndSearch/component/PlaylistCard";
import useLikedPlaylistIds from "@/pages/homeAndSearch/hooks/useLikedPlaylistIds";
import useDebounce from "@/shared/hooks/useDebounce";
import Reset from "@/assets/images/reset.svg";
import { useUserStore } from "@/stores/userStore";

const Search = () => {
  const [sortOrder, setSortOrder] = useState("최신순");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);

  const currentUser = useUserStore((state) => state.user);
  const { data: likedIds = [] } = useLikedPlaylistIds(currentUser?.random_id);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["playlistCardData", sortOrder, debouncedSearch],
      queryFn: ({ pageParam = 1 }) =>
        getPlaylistCardData(pageParam, sortOrder, debouncedSearch),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  const playlistCard: (PlaylistCardData & { is_active: boolean })[] =
    useMemo(() => {
      if (!data) return [];
      return data.pages.flatMap((page) =>
        page.data.map((item) => ({
          ...item,
          is_active: likedIds.includes(item.p_id),
        })),
      );
    }, [data, likedIds]);

  const observerRef = useRef<IntersectionObserver | null>(null);

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
          threshold: 1.0,
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
            <InputWrapper>
              <CommonInput
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="키워드를 검색해주세요"
                width="250px"
              />
              <ResetButton
                src={Reset}
                alt="검색 초기화"
                visible={searchInput !== ""}
                onClick={() => setSearchInput("")}
              />
            </InputWrapper>
          </>
        }
        rightContent={
          <Dropbox variant="text" value={sortOrder} onChange={setSortOrder} />
        }
      />

      <SearchPage>
        <Container>
          <ScrollableList>
            {playlistCard.map((item, index) => {
              const isLast = index === playlistCard.length - 1;
              return (
                <div ref={isLast ? lastItemRef : null} key={item.p_id}>
                  <PlaylistCard
                    {...item}
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

const InputWrapper = styled.div`
  position: relative;
  width: 250px;
`;

const ResetButton = styled.img<{ visible: boolean }>`
  width: 18px;
  height: 18px;
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
`;

const SearchPage = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 40px;
  align-items: flex-start;
  overflow-y: auto;
`;

const Container = styled.div`
  //height: 300px;
  //height: (100%-600px);
  //height: calc(100vh-500px);
  //height: 850px;
  height: 700px;
`;

const ScrollableList = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;
