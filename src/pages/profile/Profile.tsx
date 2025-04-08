import styled from "@emotion/styled";
import { useState } from "react";
import DefaultProfile from "@/assets/images/defaultProfile.svg";
import Button from "@/shared/component/Button";
import CommonInput from "@/shared/component/input";
import useProfileImage from "@/shared/hooks/useUserProfile";
import Dropbox from "@/shared/component/Dropbox";
import useDeleteProfileImage from "@/pages/profile/hooks/useDeleteProfileImage";
import useUploadProfileImage from "@/pages/profile/hooks/useUploadProfileImage";
import Title from "@/shared/component/Title";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nickname: "링크",
    bio: "한 줄 소개를 입력해주세요.",
    artists: "관심 있는 아티스트를 입력해주세요.",
  }); // 이 부분은 db에서 받아오는 걸로 수정할 예정입니다

  const { profileImage, user, refetchImage } = useProfileImage();
  const { upload } = useUploadProfileImage(user?.id, refetchImage);
  const { remove } = useDeleteProfileImage(user?.id, refetchImage);

  const handleIconAction = (action: string) => {
    if (action === "수정하기") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) upload(file);
      };
      input.click();
    } else if (action === "삭제하기") {
      remove();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <>
      <Title title="프로필" />
      <ProfileHeader>
        <ImageWrapper>
          <ProfileImage
            src={profileImage || DefaultProfile}
            alt="프로필 이미지"
          />
          {isEditing && (
            <DropboxWrapper>
              <Dropbox
                variant="icon"
                iconSize={24}
                onChange={handleIconAction}
              />
            </DropboxWrapper>
          )}
        </ImageWrapper>
      </ProfileHeader>
      <ProfileDataWrapper>
        <FormWrapper>
          <CommonInput
            id="nickname"
            label="닉네임"
            labelPosition="left"
            value={profileData.nickname}
            onChange={handleInputChange}
            width="218px"
            isReadOnly={!isEditing}
          />
          <CommonInput
            id="email"
            label="이메일"
            labelPosition="left"
            value={user?.email ?? ""}
            onChange={() => {}}
            width="218px"
            isReadOnly
          />
          <CommonInput
            id="bio"
            label="한 줄 소개"
            labelPosition="left"
            isTextarea
            value={profileData.bio}
            onChange={handleInputChange}
            isReadOnly={!isEditing}
          />
          <CommonInput
            id="artists"
            label="관심 아티스트"
            labelPosition="left"
            isTextarea
            value={profileData.artists}
            onChange={handleInputChange}
            isReadOnly={!isEditing}
          />
        </FormWrapper>
      </ProfileDataWrapper>
      <ButtonWrapper>
        <Button
          size="mid"
          btnColor="pink"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? "저장하기" : "수정하기"}
        </Button>
      </ButtonWrapper>
    </>
  );
};

export default Profile;

const ProfileHeader = styled.div`
  width: 100%;
  height: 224px;
  background-color: var(--profile-background);
  position: relative;
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
`;

const DropboxWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileDataWrapper = styled.div`
  width: 500px;
  height: 400px;
  border-radius: 18px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 125px auto 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;
