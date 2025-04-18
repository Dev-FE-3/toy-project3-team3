import styled from "@emotion/styled";
import Title from "@/shared/component/Title";
import Like from "@/assets/images/Like.svg";
import Dropbox from "@/shared/component/Dropbox";
import { useUserStore } from "@/stores/userStore";
import backgroundImage from "@/assets/images/backGround.png";
import comment from "@/assets/images/comment.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlaylistWithVideos } from "@/api/playlistWithvideos";
import { useLikeStatus } from "./hooks/useLikeStatus";
import { ReactSVG } from "react-svg";
import { useState } from "react";
import Modal from "@/shared/component/Modal";
import { softDeletePlaylist } from "@/api/playlist";

const Detail = () => {
  // 로그인된 유저의 random_id를 userId로 사용 (DB 컬럼명은 random_id)
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = useUserStore((state) => state.user?.random_id);
  const { p_id } = useParams<{ p_id: string }>();
  const playlistId = Number(p_id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState<number | null>(
    null,
  );

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
    commentCount,
  } = useLikeStatus(userId, playlistId);

  const isLoading = isPlaylistLoading || isLikeLoading;

  if (isLoading) return <div>로딩 중...</div>;
  if (error || !playlistData) return <div>에러 발생 또는 데이터 없음</div>;

  // 메뉴 동작
  const handleIconAction = (action: string, p_id: number) => {
    if (!userId) return;
    if (action === "수정하기") {
      navigate(`/edit/${p_id}`);
    } else if (action === "삭제하기") {
      setSelectedIdToDelete(p_id);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Title
        showBackButton
        title={playlistData.playlist_title}
        rightContent={
          <>
            <LikeIcon>
              <ReactSVG
                src={Like}
                onClick={handleLikeToggle}
                wrapper="span"
                className={`likeSvg ${isLiked ? "active" : "inactive"}`}
              />
            </LikeIcon>
            {userId === playlistData.random_id ? (
              <Dropbox
                variant="icon"
                iconSize={24}
                onChange={(action) => handleIconAction(action, playlistId)}
              />
            ) : null}
          </>
        }
      />

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
              <ReactSVG
                src={Like}
                wrapper="span"
                className={`likeSvg ${isLiked ? "active" : "inactive"}`}
              />
              {likeCount}
            </span>
            <span className="comment">
              <img src={comment} alt="댓글" />
              {commentCount}
            </span>
          </IconGroup>
        </Meta>

        <VideoListWrapper>
          {playlistData.videos.map((item) => (
            <VideoCardWrapper
              key={item.v_id}
              onClick={() => navigate(`/play/${playlistId}/${item.video_id}`)}
            >
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedIdToDelete(null);
          setIsModalOpen(false);
        }}
        onConfirm={async () => {
          if (selectedIdToDelete !== null) {
            try {
              await softDeletePlaylist(selectedIdToDelete);
              await queryClient.invalidateQueries({
                queryKey: ["myPlaylists"],
              });
              setSelectedIdToDelete(null);
              setIsModalOpen(false);

              navigate(-1); // ✅ 삭제 후 이전 페이지로 이동
            } catch (error) {
              console.error("삭제 실패", error);
            }
          }
        }}
        message="플레이리스트를 삭제하시겠습니까?"
        leftButtonText="아니오"
        rightButtonText="네"
      />
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

const LikeIcon = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;

  .likeSvg svg {
    width: 24px;
    height: 24px;
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

const VideoListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
  padding-bottom: 180px;
  border-top: 1px solid var(--text-secondary);
`;

const VideoCardWrapper = styled.div`
  width: 520px;
  height: 90px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
  cursor: pointer;

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
  padding-right: 20px;
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
