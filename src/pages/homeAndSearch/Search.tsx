import Dropbox from "@/shared/component/Dropbox";
import Title, { StyledTitle } from "@/shared/component/Title";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";
import {
  getPlaylistCardData,
  playlistCardData,
} from "@/api/services/playlistCardData";
import styled from "@emotion/styled";
import CommonInput from "@/shared/component/input";
import PlaylistCard from "./component/PlaylistCard";

const Search = () => {
  const [sortOrder, setSortOrder] = useState("최신순");
  const [playlistCard, setPlaylistCard] = useState<playlistCardData[]>([]);

  // playlist테이블, user테이블 join한 데이터 가져오는 api 실행
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const result = await getPlaylistCardData();
        const witheLikeStatus = result.map((item) => ({
          ...item,
          is_active: false, //일단 모든 좋아요 표시를 false로 해둠-> 고민이 필요함
        }));
        setPlaylistCard(witheLikeStatus);
        console.log("가져온 플레이리스트witheLikeStatus :::", witheLikeStatus);
      } catch (error) {
        console.error("플레이리스트 가져오기 실패", error);
      }
    };

    fetchPlaylists();
  }, []);

  // 로그인 유저 가져오기
  const randomId = useUserStore((state) => state.user?.random_id);
  console.log("랜덤아이디??", randomId);

  // 정렬시키는 함수
  const sortedPlaylistCards = [...playlistCard].sort((a, b) => {
    if (sortOrder === "최신순") {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else {
      return b.like_count - a.like_count;
    }
  });

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

      <SearchPage>
        {sortedPlaylistCards.map((item) => (
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
        ))}
      </SearchPage>
    </>
  );
};

export default Search;

const SearchPage = styled.div`
  display: flex;
  padding: 20px 40px;
  flex-direction: column;
  align-items: flex-start;
`;
