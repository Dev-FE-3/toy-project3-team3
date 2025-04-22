import { useInfiniteQuery } from "@tanstack/react-query";
import Dropbox from "@/shared/component/Dropbox";
import Title, { StyledTitle } from "@/shared/component/Title";
import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { getPlaylistCardData, PlaylistCardData } from "@/db/playlistCardData";
import styled from "@emotion/styled";
import CommonInput from "@/shared/component/input";
import PlaylistCard from "@/pages/homeAndSearch/component/PlaylistCard";
import useLikedPlaylistIds from "@/pages/homeAndSearch/hooks/useLikedPlaylistIds";
import useDebounce from "@/shared/hooks/useDebounce";
import Reset from "@/assets/images/reset.svg";
import { useUserStore } from "@/stores/userStore";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const Search = () => {
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);

  const currentUser = useUserStore((state) => state.user);
  const { data: likedIds = [] } = useLikedPlaylistIds(currentUser?.random_id);

  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentUser?.random_id) {
      queryClient.invalidateQueries({
        queryKey: ["likedPlaylistIds", currentUser.random_id],
      });
    }
  }, [location.pathname, currentUser?.random_id, queryClient]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        "playlistCardData",
        { sortOrder, searchKeyword: debouncedSearch },
      ],
      queryFn: ({ pageParam = 1 }) =>
        getPlaylistCardData(pageParam, sortOrder, debouncedSearch),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    });

  const playlistCard: (PlaylistCardData & { is_active: boolean })[] =
    useMemo(() => {
      if (!data) return [];

      const flatData = data.pages.flatMap((page) =>
        page.data.map((item) => ({
          ...item,
          is_active: likedIds.includes(item.p_id),
        })),
      );

      // ✨ p_id 기준으로 중복 제거
      const uniqueData = Array.from(
        new Map(flatData.map((item) => [item.p_id, item])).values(),
      );

      return uniqueData;
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
    <SearchPage>
      <TitleWrapper>
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
      </TitleWrapper>

      <ScrollableArea>
        <ScrollableList>
          {playlistCard.map((item, index) => {
            const isLast = index === playlistCard.length - 1;
            return (
              <div ref={isLast ? lastItemRef : null} key={item.p_id}>
                <PlaylistCard playlist={item} />
              </div>
            );
          })}
        </ScrollableList>
      </ScrollableArea>
    </SearchPage>
  );
};

export default Search;

const SearchPage = styled.div`
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

const ScrollableList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 70px; // Nav 가림 방지용
`;

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
