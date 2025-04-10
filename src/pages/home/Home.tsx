import styled from "@emotion/styled";
import like from "@/assets/images/originLike.svg";
import comment from "@/assets/images/comment.svg";
import defaultProfile from "@/assets/images/defaultProfile.svg";
import Title, { StyledTitle } from "@/shared/component/Title";
import Dropbox from "@/shared/component/Dropbox";
import { useEffect, useState } from "react";
import backgroundImage from "@/assets/images/backGround.png";
import { ReactSVG } from "react-svg";

const Home = () => {
  const [sortOrder, setSortOrder] = useState("최신순");

  useEffect(() => {
    console.log("정렬:", sortOrder);
  }, [sortOrder]);

  return (
    <>
      <Title
        leftContent={<StyledTitle>홈</StyledTitle>}
        rightContent={
          <Dropbox variant="text" value={sortOrder} onChange={setSortOrder} />
        }
      />

      <HomePage>
        <CardWrapper>
          <Thumbnail>
            <ThumbnailImg src={backgroundImage} />
          </Thumbnail>

          <Description>
            <TitleAndCreatorWrapper>
              <PlayListTitle>
                aespa.zip | Black Mamba부터 Whiplash까지 그리고 또 다른 영상
                제목이 이어집니다람쥐는 찍찍이는 벨트로 밴드 편해요
              </PlayListTitle>

              <CreatorInfo>
                <div className="profileImg">
                  <img
                    src={defaultProfile}
                    alt="프로필"
                    className="defaultProfile"
                  />
                </div>
                <span>나는 만든사람 입니다.</span>
              </CreatorInfo>
            </TitleAndCreatorWrapper>

            <Meta>
              <span className="videoCount">동영상 10개</span>
              <IconGroup>
                <span className="like">
                  <ReactSVG src={like} wrapper="span" className="likeSvg" />
                  50
                </span>
                <span className="comment">
                  <img src={comment} alt="댓글" />
                  235
                </span>
              </IconGroup>
            </Meta>
          </Description>
        </CardWrapper>
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

  .likeSvg {
    color: var(--primary); // ✅ 하트만 색상 적용
  }

  .likeSvg svg {
    width: 14px;
    height: 14px;
    display: block;
  }

  .comment img {
    width: 14px;
    height: 14px;
    display: block;
  }
`;
