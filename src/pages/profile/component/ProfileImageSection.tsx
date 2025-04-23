import styled from "@emotion/styled";
import Dropbox from "@/shared/component/Dropbox";
import DefaultProfile from "@/assets/images/defaultProfile.svg";
import { useUserStore } from "@/stores/userStore";

interface ProfileImageSectionProps {
  profileImage?: string;
  isEditing: boolean;
  onIconAction: (action: number) => void;
}

const ProfileImageSection = ({
  isEditing,
  onIconAction,
}: ProfileImageSectionProps) => {
  const { user } = useUserStore();
  const profileSrc = user?.user_img
    ? `${user.user_img}?t=${Date.now()}`
    : DefaultProfile;

  return (
    <Wrapper>
      <Image
        src={profileSrc}
        alt="프로필 이미지"
        onError={(e) => {
          e.currentTarget.src = DefaultProfile;
        }}
      />
      {isEditing && (
        <DropboxWrapper>
          <Dropbox variant="icon" iconSize={24} onChange={onIconAction} />
        </DropboxWrapper>
      )}
    </Wrapper>
  );
};

export default ProfileImageSection;

// 스타일 컴포넌트
const Wrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const DropboxWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
`;
