import styled from "@emotion/styled";
import Button from "@/shared/component/Button";
import defaultProfile from "@/assets/images/defaultProfile.svg";

interface StorageProfileCardProps {
  userData: {
    nickname: string;
    user_img?: string | null;
    sort_intro?: string | null;
    artist_hash_tag?: string | null;
  };
  isMyPage: boolean;
  isProfilePage: boolean;
  followerCount: number;
  followingCount: number;
  playlistCount: number;
  isFollowing: boolean;
  isFollowPending: boolean;
  isUnfollowPending: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  onNavigateToProfile: () => void;
  onNavigateToFollowInfo: (tab: "follower" | "following") => void;
}

const StorageProfileCard = ({
  userData,
  isMyPage,
  isProfilePage,
  followerCount,
  followingCount,
  playlistCount,
  isFollowing,
  isFollowPending,
  isUnfollowPending,
  onFollow,
  onUnfollow,
  onNavigateToProfile,
  onNavigateToFollowInfo,
}: StorageProfileCardProps) => {
  const getProfileImageUrl = (userImg?: string | null) => {
    if (!userImg) return defaultProfile;
    return userImg;
  };

  return (
    <ProfileWrapper>
      <ProfileCardTop>
        <ImageArea src={getProfileImageUrl(userData.user_img)} />
        <ProfileInfo>
          <NickName>{userData.nickname}</NickName>
          <InfoItemWrapper>
            <InfoItem onClick={() => onNavigateToFollowInfo("follower")}>
              <InfoCount>{followerCount}</InfoCount>
              <InfoLabel>팔로워</InfoLabel>
            </InfoItem>
            <InfoItem onClick={() => onNavigateToFollowInfo("following")}>
              <InfoCount>{followingCount}</InfoCount>
              <InfoLabel>팔로잉</InfoLabel>
            </InfoItem>
            <InfoItem>
              <InfoCount>{playlistCount}</InfoCount>
              <InfoLabel>리스트</InfoLabel>
            </InfoItem>
          </InfoItemWrapper>

          {isMyPage ? (
            !isProfilePage && (
              <Button size="small" onClick={onNavigateToProfile}>
                프로필 수정
              </Button>
            )
          ) : (
            <Button
              size="small"
              btnColor={isFollowing ? "white" : "pink"}
              onClick={isFollowing ? onUnfollow : onFollow}
              disabled={isFollowPending || isUnfollowPending}
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
        <BioArea>{userData.sort_intro}</BioArea>
        <HashTagArea>
          {userData.artist_hash_tag?.split(" ").map((word, i) =>
            word.startsWith("#") ? (
              <span key={i} className="hashtag">
                {word}
              </span>
            ) : (
              <span key={i}>{word}</span>
            ),
          )}
        </HashTagArea>
      </ProfileCardBottom>
    </ProfileWrapper>
  );
};

export default StorageProfileCard;

const ProfileWrapper = styled.div`
  width: 600px;
  height: 280px;
  padding: 0px 40px;
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
  font-size: var(--font-size-subtitle);
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
  margin-top: 10px;
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const BioArea = styled.span`
  font-size: var(--font-size-large);
  color: var(--text-primary);
  font-weight: 400;
  line-height: 18px;
`;

const HashTagArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 4px;

  .hashtag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary);
    color: white;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: var(--font-size-primary);
    font-weight: 500;
    line-height: 1;
  }

  span:not(.hashtag) {
    font-size: var(--font-size-primary);
    color: var(--text-primary);
    display: inline-flex;
    align-items: center;
    line-height: 1;
  }
`;
