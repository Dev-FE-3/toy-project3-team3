import styled from "@emotion/styled";
import Title from '@/shared/component/Title';
import Like from "@/assets/images/Like.svg";
import Dropbox from "@/shared/component/Dropbox";
import { useUserStore } from '@/stores/userStore';
import backgroundImage from "@/assets/images/backGround.png";
import comment from "@/assets/images/comment.svg";

const Detail = () => {
  const user = useUserStore((state) => state.user?.random_id);

  const handleIconAction = (action: string) => {
    console.log("클릭?");
    if (!user) return;

    if (action === "수정하기") {
      // 수정 페이지로 이동
    } else if (action === "삭제하기") {
      // 삭제하는 로직
    }
  };

  return (
    <>
      <div className="headerArea">
        <Title
          showBackButton
          title="플리 제목이 나옴"
          rightContent={
            <>
              <LikeIcon src={Like} alt="좋아요" />
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
          <CoverImage src={backgroundImage} alt="플리 커버 이미지" />

          <Meta>
            <span className="videoCount">동영상 10개</span>
            <IconGroup>
              <span className="like">
                <img src={Like} alt="좋아요" /> 50
              </span>
              <span className="comment">
                <img src={comment} alt="댓글" /> 235
              </span>
            </IconGroup>
          </Meta>
        
          <VideoListWrapper>
            {[...Array(3)].map((_, i) => (
              <VideoCardWrapper key={i}>
                <Thumbnail src={backgroundImage} alt="썸네일" />
                <VideoInfo>
                  <VideoTitle>
                    Playlist 나야 최파민, 역대급 실화모로 돌아온 에스파 플리
                  </VideoTitle>
                  <VideoCreater>엠플리</VideoCreater>
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

const LikeIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
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
