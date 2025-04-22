import styled from "@emotion/styled";
import Title from "@/shared/component/Title";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useOtherUser from "@/api/useOtherUser";
import useFollowCount from "@/api/useFollowCount";
import Loading from "@/shared/component/Loading";
import { useUserStore } from "@/stores/userStore";
import useFollowStatus from "@/api/useFollowStatus";
import useLikedPlaylists from "@/api/useLikedPlaylists";
import useMyPlaylists from "@/api/useMyPlaylists";
import Modal from "@/shared/component/Modal";
import { softDeletePlaylist } from "@/db/playlist";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getMyLikedPlaylistIds } from "@/db/like";
import StoragePlaylistCard from "@/pages/storage/component/StoragePlaylistCard";
import StorageProfileCard from "@/pages/storage/component/StorageProfileCard";
import { TabMenu, TabButton } from "@/shared/component/Tab";

const Storage = () => {
  const [activeTab, setActiveTab] = useState<"left" | "right">("left");
  const { randomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const currentUser = useUserStore((state) => state.user);
  const {
    otherUser,
    //isLoading: isOtherUserLoading,
    //isError: isOtherUserError,
  } = useOtherUser(Number(randomId));
  const isMyPage = currentUser?.random_id === Number(randomId);
  const targetId = isMyPage ? currentUser?.random_id : otherUser?.random_id;
  const targetUser = isMyPage ? currentUser : otherUser;
  const userData = targetUser;

  const { followerCount, followingCount } = useFollowCount(targetId);
  const {
    myPlaylists = [],
    isLoading: isMyPlaylistsLoading,
    //isError: isMyPlaylistsError,
  } = useMyPlaylists(targetId);

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

      <StorageWrapper>
        <FixedHeaderArea>
          <StorageProfileCard
            userData={userData!}
            isMyPage={isMyPage}
            isProfilePage={isProfilePage}
            followerCount={followerCount}
            followingCount={followingCount}
            playlistCount={myPlaylists.length}
            isFollowing={isFollowing}
            isFollowPending={isFollowPending}
            isUnfollowPending={isUnfollowPending}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
            onNavigateToProfile={() => navigate("/profile")}
            onNavigateToFollowInfo={handleNavigate}
          />

          <TabMenu>
            <TabButton
              isActive={activeTab === "left"}
              onClick={() => setActiveTab("left")}
            >
              리스트
            </TabButton>
            <TabButton
              isActive={activeTab === "right"}
              onClick={() => setActiveTab("right")}
            >
              하트
            </TabButton>
          </TabMenu>
        </FixedHeaderArea>

        <ScrollablePlaylistArea>
          {(activeTab === "left" ? myPlaylists : likedPlaylists)?.map(
            (item) => {
              const isLiked = likedIds.includes(item.p_id);

              return (
                <StoragePlaylistCard
                  key={item.p_id}
                  item={item}
                  isLiked={isLiked}
                  isMyPage={isMyPage}
                  activeTab={activeTab}
                  currentUserId={currentUser?.random_id}
                  onNavigate={(id) => navigate(`/playlist/${id}`)}
                  onIconAction={handleIconAction}
                />
              );
            },
          )}

          {(activeTab === "left" && isMyPlaylistsLoading) ||
          (activeTab === "right" && isLikedPlaylistsLoading) ? (
            <Loading />
          ) : null}
        </ScrollablePlaylistArea>
      </StorageWrapper>

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

const StorageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
`;

const FixedHeaderArea = styled.div`
  flex-shrink: 0;
`;

const ScrollablePlaylistArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px 40px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px 0;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;

  &::after {
    content: "";
    flex-basis: 100%;
    height: 120px;
  }
`;
