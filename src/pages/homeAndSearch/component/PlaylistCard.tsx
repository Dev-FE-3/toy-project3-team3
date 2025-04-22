import styled from "@emotion/styled";
import { ReactSVG } from "react-svg";
import { useNavigate } from "react-router-dom";

import likeIcon from "@/assets/images/Like.svg";
import commentIcon from "@/assets/images/comment.svg";
import backgroundImage from "@/assets/images/backGround.png";
import defaultProfile from "@/assets/images/defaultProfile.svg";

interface PlaylistCardProps {
  playlist: {
    p_id: number;
    cover_img_path: string | null;
    playlist_title: string;
    video_count: number;
    user_img: string | null;
    nickname: string;
    like_count: number;
    comment_count: number;
    is_active: boolean;
    random_id: number;
  };
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  const {
    p_id,
    cover_img_path,
    playlist_title,
    video_count,
    user_img,
    nickname,
    like_count,
    comment_count,
    is_active,
    random_id,
  } = playlist;

  const navigate = useNavigate();

  const handleGoToStorage = () => {
    navigate(`/storage/${random_id}`);
  };

  return (
    <CardWrapper>
      <Thumbnail onClick={() => navigate(`/playlist/${p_id}`)}>
        <ThumbnailImg src={cover_img_path || backgroundImage} />
      </Thumbnail>

      <Description>
        <TitleAndCreatorWrapper>
          <PlayListTitle onClick={() => navigate(`/playlist/${p_id}`)}>
            {playlist_title}
          </PlayListTitle>
          <CreatorInfo onClick={handleGoToStorage}>
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
    color: var(--text-secondary); /* 기본 회색 */
  }

  .likeSvg.active svg {
    color: var(--primary); /* 좋아요 눌렀을 때 */
  }

  .likeSvg.inactive svg {
    stroke: var(--text-secondary); /* 비활성 테두리 */
    fill: none; /* 비활성 내부는 비워둠 */
  }

  .comment img {
    width: 14px;
    height: 14px;
    display: block;
  }
`;
