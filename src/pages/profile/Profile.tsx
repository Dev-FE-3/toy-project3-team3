import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import DefaultProfile from "@/assets/images/defaultProfile.svg";
import Button from "@/shared/component/Button";
import CommonInput from "@/shared/component/input";
import useProfileImage from "@/shared/hooks/useProfileImage";
import Dropbox from "@/shared/component/Dropbox";
import useDeleteProfileImage from "@/pages/profile/hooks/useDeleteProfileImage";
import useUploadProfileImage from "@/pages/profile/hooks/useUploadProfileImage";
import Title from "@/shared/component/Title";
import useUpdateUserInfo from "@/pages/profile/hooks/useUpdateUserInfo";
import useUser from "@/shared/hooks/useUser.ts";
import Cancel from "@/assets/images/cancel.svg";
import Modal from "@/shared/component/Modal";
import { useNavigate } from "react-router-dom";
import useLockStore from "@/stores/lockStore";
import Loading from "@/shared/component/Loading";

const Profile = () => {
  const navigate = useNavigate();
  const { lock, unlock } = useLockStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nickname: "",
    sort_intro: "",
    artist_hash_tag: "",
  });

  const {
    user,
    authUserId,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useUser(); // 유저 정보
  // 프로필 이미지 fetch
  const { profileImage, refetch: refetchImage } = useProfileImage(authUserId);

  const uploadMutation = useUploadProfileImage(refetchImage);
  const deleteMutation = useDeleteProfileImage(refetchImage);

  const updateMutation = useUpdateUserInfo(() => {
    setIsEditing(false);
  });

  useEffect(() => {
    if (isEditing) {
      lock();
    } else {
      unlock();
    }
  }, [isEditing, lock, unlock]);

  // 초기 유저 데이터 profileData에 세팅
  useEffect(() => {
    if (user) {
      setProfileData({
        nickname: user.nickname ?? "",
        sort_intro: user.sort_intro ?? "",
        artist_hash_tag: user.artist_hash_tag ?? "",
      });
    }
  }, [user]);

  const handleIconAction = (action: string) => {
    if (!authUserId) return;

    if (action === "수정하기") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          uploadMutation.mutate({ userId: authUserId, file });
        }
      };
      input.click();
    } else if (action === "삭제하기") {
      deleteMutation.mutate(authUserId);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    if (!user?.id) return;
    updateMutation.mutate({
      id: user.id,
      updatedFields: profileData,
    });
  };

  if (isUserLoading) return <Loading />;
  if (isUserError) return <div>유저 정보를 불러오지 못했습니다.</div>;
  if (!user) return <div>유저 정보가 없습니다.</div>;

  return (
    <>
      {isEditing ? (
        <Title
          title="프로필"
          rightContent={
            <img
              src={Cancel}
              alt="닫기"
              onClick={() => setIsModalOpen(true)}
              style={{ cursor: "pointer" }}
            />
          }
        />
      ) : (
        <Title showBackButton title="프로필" />
      )}

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
            placeholder="닉네임"
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
            id="sort_intro"
            label="한 줄 소개"
            placeholder="한 줄 소개를 입력해 주세요."
            labelPosition="left"
            isTextarea
            value={profileData.sort_intro}
            onChange={handleInputChange}
            isReadOnly={!isEditing}
          />
          <CommonInput
            id="artist_hash_tag"
            label="관심 아티스트"
            placeholder="관심 아티스트를 입력해 주세요."
            labelPosition="left"
            isTextarea
            value={profileData.artist_hash_tag}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // 계속하기
        onConfirm={() => {
          setIsModalOpen(false);
          navigate(0);
        }}
        message="프로필 수정을 그만두시겠습니까?"
        leftButtonText="계속하기"
        rightButtonText="네"
      />
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
