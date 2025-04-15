import styled from "@emotion/styled";
import Title from "@/shared/component/Title";
import defaultProfile from "@/assets/images/defaultProfile.svg";
import Button from "@/shared/component/Button";
import { useState } from "react";
import Like from "@/assets/images/like.svg";
import Comment from "@/assets/images/comment.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useOtherUser from "@/api/services/useOtherUser";
import useFollowCount from "@/api/services/useFollowCount";
import Loading from "@/shared/component/Loading";
import { useUserStore } from "@/stores/userStore";
import useFollowStatus from "@/pages/followInfo/hooks/useFollowStatus";
import useLikedPlaylists from "@/api/services/useLikedPlaylists";
import useMyPlaylists from "@/api/services/useMyPlaylists";
import backgroundImage from "@/assets/images/backGround.png";
import Dropbox from "@/shared/component/Dropbox";
import Modal from "@/shared/component/Modal";
import { softDeletePlaylist } from "@/api/playlist";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getMyLikedPlaylistIds } from "@/api/like";
import { ReactSVG } from "react-svg";

const Storage = () => {
  const [activeTab, setActiveTab] = useState<"left" | "right">("left");
  const { randomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const currentUser = useUserStore((state) => state.user);
  const { data: otherUser } = useOtherUser(Number(randomId));
  const isMyPage = currentUser?.random_id === Number(randomId);
  const targetId = isMyPage ? currentUser?.random_id : otherUser?.random_id;
  const targetUser = isMyPage ? currentUser : otherUser;
  const userData = targetUser;

  const { followerCount, followingCount } = useFollowCount(targetId);
  const { data: myPlaylists = [], isLoading: isMyPlaylistsLoading } =
    useMyPlaylists(targetId);

  const { likedPlaylists = [], isLoading: isLikedPlaylistsLoading } =
    useLikedPlaylists(targetId);

  const { data: likedIds = [] } = useQuery({
    queryKey: ["myLikedIds", currentUser?.random_id],
    queryFn: () => getMyLikedPlaylistIds(currentUser!.random_id),
    enabled: !!currentUser?.random_id,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedIdToDelete, setSelectedIdToDelete] = useState<number | null>(
    null,
  );

  const {
    isFollowing,
    handleFollow,
    handleUnfollow,
    isLoading: isFollowLoading,
    isFollowPending,
    isUnfollowPending,
  } = useFollowStatus(targetId);

  const getProfileImageUrl = (userImg?: string | null) => {
    if (!userImg) return defaultProfile;
    return userImg;
  };

  const handleNavigate = (tab: "follower" | "following") => {
    navigate(`/storage/${randomId}/follow-info?tab=${tab}`);
  };

  if (!targetUser || isFollowLoading) return <Loading />;

  const isProfilePage = location.pathname === "/profile";

  const handleIconAction = async (action: string, p_id: number) => {
    if (action === "수정하기") {
      navigate(`/edit/${p_id}`);
    } else if (action === "삭제하기") {
      setSelectedIdToDelete(p_id);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {isMyPage ? (
        <Title title="보관함" />
      ) : (
        <Title title="보관함" showBackButton />
      )}

      <ProfileWrapper>
        <ProfileCardTop>
          <ImageArea src={getProfileImageUrl(userData?.user_img)} />
          <ProfileInfo>
            <NickName>{userData?.nickname}</NickName>
            <InfoItemWrapper>
              <InfoItem onClick={() => handleNavigate("follower")}>
                <InfoCount>{followerCount}</InfoCount>
                <InfoLabel>팔로워</InfoLabel>
              </InfoItem>
              <InfoItem onClick={() => handleNavigate("following")}>
                <InfoCount>{followingCount}</InfoCount>
                <InfoLabel>팔로잉</InfoLabel>
              </InfoItem>
              <InfoItem>
                <InfoCount>{myPlaylists.length}</InfoCount>
                <InfoLabel>리스트</InfoLabel>
              </InfoItem>
            </InfoItemWrapper>
            {isMyPage ? (
              !isProfilePage && (
                <Button size="small" onClick={() => navigate("/profile")}>
                  프로필 수정
                </Button>
              )
            ) : (
              <Button
                size="small"
                btnColor={isFollowing ? "white" : "pink"}
                onClick={() => {
                  if (!currentUser?.random_id || !targetId) return;
                  if (isFollowing) {
                    handleUnfollow();
                  } else {
                    handleFollow();
                  }
                }}
                disabled={
                  isFollowPending ||
                  isUnfollowPending ||
                  !currentUser?.random_id ||
                  !targetId
                }
              >
                {isFollowPending || isUnfollowPending
                  ? "처리 중..."
                  : isFollowing
                    ? "팔로잉"
                    : "팔로우"}
              </Button>
            )}
          </ProfileInfo>
        </ProfileCardTop>
        <ProfileCardBottom>
          <BioArea>{userData?.sort_intro}</BioArea>
          <HashTagArea>{userData?.artist_hash_tag}</HashTagArea>
        </ProfileCardBottom>
      </ProfileWrapper>
      <TabMenu>
        <TabLeft
          isActive={activeTab === "left"}
          onClick={() => setActiveTab("left")}
        >
          리스트
        </TabLeft>
        <TabRight
          isActive={activeTab === "right"}
          onClick={() => setActiveTab("right")}
        >
          하트
        </TabRight>
      </TabMenu>
      <PlaylistArea>
        {(activeTab === "left" ? myPlaylists : likedPlaylists)?.map((item) => {
          const isLiked = likedIds.includes(item.p_id);

          return (
            <VideoWrapper key={item.p_id}>
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

                    <span className="Comment">
                      <img src={Comment} alt="댓글" />
                      {item.comment_count}
                    </span>
                    {isMyPage &&
                      activeTab === "left" &&
                      item.random_id === currentUser?.random_id && (
                        <Dropbox
                          variant="icon"
                          onChange={(action) =>
                            handleIconAction(action, item.p_id)
                          }
                        />
                      )}
                  </IconGroup>
                </DetailArea>
                <VideoTitle>{item.playlist_title}</VideoTitle>
              </Meta>
            </VideoWrapper>
          );
        })}

        {(activeTab === "left" && isMyPlaylistsLoading) ||
        (activeTab === "right" && isLikedPlaylistsLoading) ? (
          <Loading />
        ) : null}
      </PlaylistArea>

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

export default Storage;

const ProfileWrapper = styled.div`
  width: 600px;
  height: 280px;
  padding: 10px 40px 10px 40px;
`;

const ProfileCardTop = styled.div`
  display: flex;
  padding: 18px 20px;
  gap: 100px;
`;

const ImageArea = styled.img`
  width: 165px;
  height: 165px;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  width: 200px;
  height: 165px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const NickName = styled.span`
  font-size: 24px;
  font-weight: 700;
`;

const InfoItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 25px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  cursor: pointer;
`;

const InfoCount = styled.span`
  font-size: var(--font-size-large);
  font-weight: 700;
`;

const InfoLabel = styled.span`
  font-size: var(--font-size-primary);
  font-weight: 400;
`;

const ProfileCardBottom = styled.div`
  margin-top: 13px;
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BioArea = styled.span`
  font-size: var(--font-size-large);
  color: var(--text-primary);
  font-weight: 400;
  line-height: 18px;
`;

const HashTagArea = styled.span`
  font-size: var(--font-size-primary);
  color: var(--primary);
  font-weight: 400;
`;

const TabMenu = styled.div`
  width: 600px;
  height: 60px;
  display: flex;
  font-size: var(--font-size-large);
`;

const TabLeft = styled.div<{ isActive: boolean }>`
  width: 300px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: ${(props) => (props.isActive ? 700 : 400)};
  border-bottom: ${(props) =>
    props.isActive
      ? `3px solid var(--primary)`
      : `3px solid var(--disabled-2)`};
  color: ${(props) =>
    props.isActive ? `var(--primary)` : `var(--text-primary)`};
  &:hover {
    background-color: var(--profile-background);
    transition: background-color 0.3s ease-in-out;
  }
`;

const TabRight = styled.div<{ isActive: boolean }>`
  width: 300px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: ${(props) => (props.isActive ? 700 : 400)};
  border-bottom: ${(props) =>
    props.isActive
      ? `3px solid var(--primary)`
      : `3px solid var(--disabled-2)`};
  color: ${(props) =>
    props.isActive ? `var(--primary)` : `var(--text-primary)`};
  &:hover {
    background-color: var(--profile-background);
    transition: background-color 0.3s ease-in-out;
  }
`;

const PlaylistArea = styled.div`
  display: flex;
  gap: 15px 0;
  padding: 15px 40px 85px 40px;
  overflow-y: auto;
  flex-wrap: wrap;
  max-height: 800px;
  justify-content: space-between;
  align-items: flex-start;
`;

const VideoWrapper = styled.div`
  width: 250px;
  height: 220px;
  border-radius: 15px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  object-fit: cover;
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
      color: var(--text-secondary); /* 기본 회색 */
    }

    .likeSvg.active svg {
      color: var(--primary); /* 좋아요 눌렀을 때 */
    }

    .likeSvg.inactive svg {
      stroke: var(--text-secondary); /* 비활성 테두리 */
      fill: none; /* 비활성 내부는 비워둠 */
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
