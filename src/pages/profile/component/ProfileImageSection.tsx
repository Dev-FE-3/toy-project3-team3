import styled from "@emotion/styled";
import Dropbox from "@/shared/component/Dropbox";
import DefaultProfile from "@/assets/images/defaultProfile.svg";

interface ProfileImageSectionProps {
  profileImage?: string;
  isEditing: boolean;
  onIconAction: (action: string) => void;
}

const ProfileImageSection = ({
  profileImage,
  isEditing,
  onIconAction,
}: ProfileImageSectionProps) => {
  return (
    <Wrapper>
      <Image src={profileImage || DefaultProfile} alt="프로필 이미지" />
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
