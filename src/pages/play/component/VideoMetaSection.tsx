import styled from "@emotion/styled";
import { ReactSVG } from "react-svg";
import DefaultProfile from "@/assets/images/defaultProfile.svg";
import Like from "@/assets/images/Like.svg";
import commentIcon from "@/assets/images/comment.svg";

interface VideoMetaSectionProps {
  videoId: string;
  title: string;
  userImg: string;
  nickname: string;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  onProfileClick: () => void;
  onLikeToggle: () => void;
}

const VideoMetaSection = ({
  videoId,
  title,
  userImg,
  nickname,
  isLiked,
  likeCount,
  commentCount,
  onProfileClick,
  onLikeToggle,
}: VideoMetaSectionProps) => {
  return (
    <div>
      <VideoWrapper className="playContainer">
        {videoId  && (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        )}
      </VideoWrapper>
      <VideoTitle>{title}</VideoTitle>
      <Meta>
        <ProfileWrapper onClick={onProfileClick}>
          <ProfileImage
            src={userImg || DefaultProfile}
            onError={(e) => (e.currentTarget.src = DefaultProfile)}
          />
          <ProfileName>{nickname}</ProfileName>
        </ProfileWrapper>
        <IconGroup>
          <span
            className="like"
            onClick={onLikeToggle}
            style={{ cursor: "pointer" }}
          >
            <ReactSVG
              src={Like}
              wrapper="span"
              className={`likeSvg ${isLiked ? "active" : "inactive"}`}
            />
            <span>{likeCount}</span>
          </span>
          <span className="comment">
            <img src={commentIcon} alt="댓글" /> {commentCount}
          </span>
        </IconGroup>
      </Meta>
    </div>
  )
}

export default VideoMetaSection

const VideoWrapper = styled.div`
  width: 480px;
  height: 270px;
  margin: 20px 60px;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
`;

const VideoTitle = styled.div`
  font-size: var(--font-size-large);
  font-weight: 500;
  line-height: 1.2;
  margin: 0 50px;
  height: 45px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  word-break: break-word;
  white-space: normal;
`;

const Meta = styled.div`
  margin: 0 50px;
  padding: 15px 0;
  border-bottom: 1px solid var(--disabled);
  display: flex;
  justify-content: space-between;
`;

const ProfileWrapper = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50px;
  object-fit: cover;
  cursor: pointer;
`;

const ProfileName = styled.span`
  font-size: var(--font-size-large);
  font-weight: 400;
`;

const IconGroup = styled.div`
  display: flex;
  gap: 15px; // 아이콘 그룹 간 여백
  align-items: center;

  .like,
  .comment {
    width: 28px;
    height: 28px;
    cursor: pointer;
    color: var(--text-secondary);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-width: 40px;
    white-space: nowrap;
  }

  .likeSvg.active svg {
    color: var(--primary);
    stroke: none;
    fill: var(--primary);
  }

  .likeSvg.inactive svg {
    color: var(--text-secondary);
    stroke: var(--text-secondary);
    fill: none;
  }

  .comment img {
    width: 28px;
    height: 28px;
    display: block;
  }
`;