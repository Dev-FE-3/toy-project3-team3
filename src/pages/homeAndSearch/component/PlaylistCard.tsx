import styled from "@emotion/styled";
import { ReactSVG } from "react-svg";
// import { useNavigate } from "react-router-dom";

import likeIcon from "@/assets/images/Like.svg";
import commentIcon from "@/assets/images/comment.svg";
import backgroundImage from "@/assets/images/backGround.png";
import defaultProfile from "@/assets/images/defaultProfile.svg";

interface Props {
  p_id: number;
  cover_img_path: string | null;
  playlist_title: string;
  video_count: number;
  user_img: string | null;
  nickname: string;
  like_count: number;
  comment_count: number;
  is_active: boolean;
  onLikeClick: () => void;
}

const PlaylistCard = ({
  cover_img_path,
  playlist_title,
  video_count,
  user_img,
  nickname,
  like_count,
  comment_count,
  is_active,
  onLikeClick,
}: Props) => {
  // const navigate = useNavigate();

  // const handleGoToDetail = () => {
  //   navigate(`/playlist/${p_id}`);
  // };

  return (
    <CardWrapper>
      {/* <Thumbnail onClick={handleGoToDetail}> */}
      <Thumbnail>
        <ThumbnailImg src={cover_img_path || backgroundImage} />
      </Thumbnail>

      <Description>
        <TitleAndCreatorWrapper>
          {/* <PlayListTitle onClick={handleGoToDetail}> */}
          <PlayListTitle>{playlist_title}</PlayListTitle>
          <CreatorInfo>
            <div className="profileImg">
              <img
                src={user_img || defaultProfile}
                alt="프로필"
                className="defaultProfile"
              />
            </div>
            <span>{nickname}</span>
          </CreatorInfo>
        </TitleAndCreatorWrapper>

        <Meta>
          <span className="videoCount">동영상 {video_count}개</span>
          <IconGroup>
            <span className="like">
              <ReactSVG
                src={likeIcon}
                wrapper="span"
                className={`likeSvg ${is_active ? "active" : "inactive"}`}
                onClick={onLikeClick}
              />
              {like_count}
            </span>
            <span className="comment">
              <img src={commentIcon} alt="댓글" />
              {comment_count}
            </span>
          </IconGroup>
        </Meta>
      </Description>
    </CardWrapper>
  );
};

export default PlaylistCard;

const CardWrapper = styled.div`
  display: flex;
  width: 510px;
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
  cursor: pointer;
`;

const ThumbnailImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
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
  cursor: pointer;

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
  cursor: pointer;

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

  .likeSvg.active svg {
    color: var(--primary); /* 활성화: 원래 컬러 */
    fill: var(--primary); /* 색상 채우기 */
  }

  .likeSvg.inactive svg {
    color: var(--text-secondary); /* 비활성화: 회색 외곽선 */
    fill: none; /* 안은 비우기 */
  }

  .comment img {
    width: 14px;
    height: 14px;
    display: block;
  }
`;