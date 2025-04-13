import styled from "@emotion/styled";
import likeIcon from "@/assets/images/originLike.svg";
import comment from "@/assets/images/comment.svg";
import defaultProfile from "@/assets/images/defaultProfile.svg";
import Title, { StyledTitle } from "@/shared/component/Title";
import Dropbox from "@/shared/component/Dropbox";
import { useEffect, useState } from "react";
import backgroundImage from "@/assets/images/backGround.png";
import { ReactSVG } from "react-svg";
import { useUserStore } from "@/stores/userStore";
import {
  getPlaylistCard,
  PlaylistFullView,
} from "@/api/services/playlistFullView";
import { getLike, Like, updateLike } from "@/api/like";

const Home = () => {
  const [sortOrder, setSortOrder] = useState("최신순");
  const [playlistCard, setPlaylistCard] = useState<PlaylistFullView[]>([]);
  const [like, setLike] = useState<Like[]>([]);

  // like가져오는 api
  useEffect(() => {
    const fetchLike = async () => {
      try {
        const likeData = await getLike();
        setLike(likeData);
        console.log("가져온 like데이터 확인: ", likeData);
      } catch (error) {
        console.error("좋아요 데이터 가져오기 실패", error);
      }
    };

    fetchLike();
  }, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const result = await getPlaylistCard();
        const witheLikeStatus = result.map((item) => ({
          ...item,
          is_active: false,
        }));
        setPlaylistCard(witheLikeStatus);
        console.log("가져온 플레이리스트witheLikeStatus :::", witheLikeStatus);
      } catch (error) {
        console.error("플레이리스트 가져오기 실패", error);
      }
    };

    fetchPlaylists();
  }, []);

  const randomId = useUserStore((state) => state.user?.random_id);
  console.log("랜덤아이디??", randomId);

  //좋아요 상태 토글 함수
  const handleLike = async (p_id: number) => {
    if (!randomId) {
      console.warn("로그인된 유저가 아닙니다.");
      return;
    }

    console.log("하트 클릭");
    const current = playlistCard.find((item) => item.p_id === p_id);
    if (!current) return;

    const newStatus = !current.is_active;

    await updateLike(p_id, randomId, newStatus);
  };

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
        leftContent={<StyledTitle>홈</StyledTitle>}
        rightContent={
          <Dropbox variant="text" value={sortOrder} onChange={setSortOrder} />
        }
      />

      <HomePage>
        {sortedPlaylistCards.map((item) => (
          <CardWrapper key={item.p_id}>
            <Thumbnail>
              <ThumbnailImg src={item.cover_img_path || backgroundImage} />
            </Thumbnail>

            <Description>
              <TitleAndCreatorWrapper>
                <PlayListTitle>{item.playlist_title}</PlayListTitle>
                <CreatorInfo>
                  <div className="profileImg">
                    <img
                      src={item.user_img || defaultProfile}
                      alt="프로필"
                      className="defaultProfile"
                    />
                  </div>
                  <span>{item.nickname}</span>
                </CreatorInfo>
              </TitleAndCreatorWrapper>

              <Meta>
                <span className="videoCount">동영상 {item.video_count}개</span>
                <IconGroup>
                  <span className="like">
                    <ReactSVG
                      src={likeIcon}
                      wrapper="span"
                      className={`likeSvg ${item.is_active ? "active" : "inactive"}`}
                      onClick={() => handleLike(item.p_id)}
                    />
                    {item.like_count}
                  </span>
                  <span className="comment">
                    <img src={comment} alt="댓글" />
                    {item.comment_count}
                  </span>
                </IconGroup>
              </Meta>
            </Description>
          </CardWrapper>
        ))}
      </HomePage>
    </>
  );
};

export default Home;

const HomePage = styled.div`
  display: flex;
  padding: 20px 40px;
  flex-direction: column;
  align-items: flex-start;
`;

const CardWrapper = styled.div`
  display: flex;
  width: 519px;
  height: 135px;
  margin-bottom: 15px;
  gap: 15px;
`;

const Thumbnail = styled.div`
  width: 240px;
  height: 135px;
  border-radius: 10px;
  flex-shrink: 0;
  border-radius: 1px solid var(--text-primary);
`;

const ThumbnailImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 8px 0;
  flex: 1;
`;

const TitleAndCreatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PlayListTitle = styled.div`
  font-size: var(--font-size-primary);
  font-weight: 400;
  color: var(--text-primary);
  line-height: 20px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  word-break: break-word;
  white-space: normal;
`;

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--font-size-primary);
  color: var(--text-secondary);

  .profileImg {
    width: 25px;
    height: 25px;

    img.defaultProfile {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-small);
  color: var(--text-secondary);
`;

const IconGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  .like,
  .comment {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .likeSvg svg {
    width: 14px;
    height: 14px;
    display: block;
    color: var(--text-secondary);
    transition: color 0.2s ease;
  }

  /* 활성화된 상태일 때 색상 변경 */
  .likeSvg.active svg {
    color: var(--primary);
  }

  .likeSvg.inactive svg {
    color: var(--text-secondary); // 비활성 색상 유지
  }

  .comment img {
    width: 14px;
    height: 14px;
    display: block;
  }
`;
