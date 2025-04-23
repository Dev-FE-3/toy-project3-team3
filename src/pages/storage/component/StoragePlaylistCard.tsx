import styled from "@emotion/styled";
import { ReactSVG } from "react-svg";
import Like from "@/assets/images/like.svg";
import Comment from "@/assets/images/comment.svg";
import Dropbox from "@/shared/component/Dropbox";
import backgroundImage from "@/assets/images/backGround.png";

interface StoragePlaylistCardProps {
  item: {
    p_id: number;
    video_count: number;
    cover_img_path?: string | null;
    playlist_title: string;
    like_count: number;
    comment_count: number;
    random_id: number;
  };
  isLiked: boolean;
  isMyPage: boolean;
  activeTab: "left" | "right";
  currentUserId?: number;
  onNavigate: (p_id: number) => void;
  onIconAction: (action: number, p_id: number) => void;
}

const StoragePlaylistCard = ({
  item,
  isLiked,
  isMyPage,
  activeTab,
  currentUserId,
  onNavigate,
  onIconAction,
}: StoragePlaylistCardProps) => {
  return (
    <VideoWrapper onClick={() => onNavigate(item.p_id)}>
      <VideoArea src={item.cover_img_path || backgroundImage} />
      <Meta>
        <DetailArea>
          <Count>동영상 {item.video_count}개</Count>
          <IconGroup>
            <span className="like">
              <ReactSVG
                src={Like}
                wrapper="span"
                className={`likeSvg ${isLiked ? "active" : "inactive"}`}
              />
              {item.like_count}
            </span>
            <span className="comment">
              <img src={Comment} alt="댓글" />
              {item.comment_count}
            </span>
            {isMyPage &&
              activeTab === "left" &&
              item.random_id === currentUserId && (
                <div onClick={(e) => e.stopPropagation()}>
                  <Dropbox
                    variant="icon"
                    onChange={(action) => onIconAction(action, item.p_id)}
                  />
                </div>
              )}
          </IconGroup>
        </DetailArea>
        <VideoTitle>{item.playlist_title}</VideoTitle>
      </Meta>
    </VideoWrapper>
  );
};

export default StoragePlaylistCard;

const VideoWrapper = styled.div`
  width: 250px;
  height: 220px;
  border-radius: 15px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  object-fit: cover;

  &:hover {
    background-color: var(--profile-background);
    transition: background-color 0.3s ease-in-out;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  }
`;

const VideoArea = styled.img`
  background-color: var(--text-secondary);
  width: 224px;
  height: 126px;
  border-radius: 5px;
  margin: 11px 13px 7px 13px;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  gap: 9px;
  flex-direction: column;
  margin: 0 13px 13px 13px;
`;

const DetailArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Count = styled.span``;

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
    .likeSvg svg {
      width: 14px;
      height: 14px;
      display: block;
      color: var(--text-secondary);
    }

    .likeSvg.active svg {
      color: var(--primary);
    }

    .likeSvg.inactive svg {
      stroke: var(--text-secondary);
      fill: none;
    }
  }
`;

const VideoTitle = styled.div`
  font-size: var(--font-size-primary);
  font-weight: 700;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
