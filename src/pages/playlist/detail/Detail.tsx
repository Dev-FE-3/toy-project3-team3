import styled from "@emotion/styled";
import Title from '@/shared/component/Title';
import Like from "@/assets/images/Like.svg";
import Dropbox from "@/shared/component/Dropbox";
import { useUserStore } from '@/stores/userStore';
import backgroundImage from "@/assets/images/backGround.png";
import comment from "@/assets/images/comment.svg";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPlaylistWithVideos } from "@/api/playlistWithvideos";
import { useLikeStatus } from "./hooks/useLikeStatus";

const Detail = () => {
  // 로그인된 유저의 random_id를 userId로 사용 (DB 컬럼명은 random_id)
  const userId = useUserStore((state) => state.user?.random_id);
  const { p_id } = useParams<{ p_id: string }>();
  const playlistId = Number(p_id);

  // 1. 플레이리스트 정보 조회
  const {
    data: playlistData,
    isLoading: isPlaylistLoading,
    error,
  } = useQuery({
    queryKey: ["playlistWithVideos", playlistId],
    queryFn: () => getPlaylistWithVideos(playlistId),
    enabled: !!playlistId,
  });

  // 2. 좋아요 상태 훅 사용
  const {
    isLiked,
    isLoading: isLikeLoading,
    handleLikeToggle,
    likeCount,
  } = useLikeStatus(userId, playlistId);

  const isLoading = isPlaylistLoading || isLikeLoading;

  if (isLoading) return <div>로딩 중...</div>;
  if (error || !playlistData) return <div>에러 발생 또는 데이터 없음</div>;

  const handleIconAction = (action: string) => {
    if (!userId) return;
    if (action === "수정하기") {
      console.log("✏️ 수정 페이지로 이동");
    } else if (action === "삭제하기") {
      console.log("🗑️ 삭제 처리 로직 실행");
    }
  };

  return (
    <>
      <div className="headerArea">
        <Title
          showBackButton
          title={playlistData.playlist_title}
          rightContent={
            <>
              <LikeIcon
                src={Like}
                alt="좋아요"
                onClick={handleLikeToggle}
                isLiked={isLiked}
              />
              <Dropbox
                variant="icon"
                iconSize={24}
                onChange={handleIconAction}
              />
            </>
          }
        />
      </div>
      <DetailPage>
        <CoverImage
          src={playlistData.cover_img_path || backgroundImage}
          alt="플리 커버 이미지"
        />

        <Meta>
          <span className="videoCount">
            동영상 {playlistData.video_count}개
          </span>
          <IconGroup>
            <span className="like">
              <img src={Like} alt="좋아요" /> {likeCount}
            </span>
            <span className="comment">
              <img src={comment} alt="댓글" /> 235
            </span>
          </IconGroup>
        </Meta>

        <VideoListWrapper>
          {playlistData.videos.map((item) => (
            <VideoCardWrapper key={item.v_id}>
              <Thumbnail
                src={item.thumbnail_url || backgroundImage}
                alt="썸네일"
              />
              <VideoInfo>
                <VideoTitle>{item.title}</VideoTitle>
                <VideoCreater>{item.channel_name}</VideoCreater>
              </VideoInfo>
            </VideoCardWrapper>
          ))}
        </VideoListWrapper>
      </DetailPage>
    </>
  );
};

export default Detail;

const DetailPage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  padding: 20px 40px;
`;

const LikeIcon = styled.img<{ isLiked: boolean }>`
  width: 24px;
  height: 24px;
  cursor: pointer;

  path {
    fill: ${({ isLiked }) => (isLiked ? "var(--primary)" : "none")};
    stroke: ${({ isLiked }) =>
      isLiked ? "var(--primary)" : "var(--text-secondary)"};
  }
`;

const CoverImage = styled.img`
  width: 480px;
  height: 270px;
  border-radius: 10px;
  display: block;
  margin: 0 auto;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  padding-top: 20px;
  padding-bottom: 10px;
`;

const IconGroup = styled.div`
  display: flex;
  gap: 10px;

  span {
    display: flex;
    align-items: center;
    gap: 4px;

    img {
      width: 14px;
      height: 14px;
    }
  }
`;

const VideoListWrapper = styled.div`
  border-top: 1px solid var(--text-secondary);
  flex-direction: column;
  display: flex;
 
  margin-bottom: 15px;
  gap: 15px;
`;

const VideoCardWrapper = styled.div`
 width: 520px;
 height: 90px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
  
  &:first-of-type {
    margin-top: 16px;
  }
`;

const Thumbnail = styled.img`
  width: 150px;
  height: 90px;
  border-radius: 8px;
  object-fit: cover;
`;

const VideoInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

const VideoTitle = styled.div`
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

const VideoCreater = styled.div`
  font-size: var(--font-size-primary);
  color: var(--text-secondary);
`;
