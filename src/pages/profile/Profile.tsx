import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import Button from "@/shared/component/Button";
import useProfileImage from "@/shared/hooks/useProfileImage";
import Title from "@/shared/component/Title";
import useUpdateUserInfo from "@/api/useUpdateUserInfo";
import Cancel from "@/assets/images/cancel.svg";
import Modal from "@/shared/component/Modal";
import { useNavigate } from "react-router-dom";
import useLockStore from "@/stores/lockStore";
import useUploadDeleteProfileImage from "@/api/useUploadDeleteProfileImage";
import { toast } from "react-toastify";
import { useUserStore } from "@/stores/userStore";
import { isNicknameDuplicated } from "@/db/users";
import ProfileImageSection from "@/pages/profile/component/ProfileImageSection";
import ProfileForm from "@/pages/profile/component/ProfileForm";

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

  const user = useUserStore((state) => state.user);
  const { profileImage, refetch: refetchImage } = useProfileImage(); // 프로필 이미지 fetch

  const imageMutation = useUploadDeleteProfileImage(refetchImage);
  const updateMutation = useUpdateUserInfo(() => {
    setIsEditing(false);
  });

  useEffect(() => {
    if (isEditing) {
      lock();
    } else {
      unlock();
    }
  }, [isEditing, lock, unlock]); // isEditing 상태에 따라 상단 하단 lock/unlock

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

  const handleIconAction = (action: number) => {
    if (!user) return;

    // 1 = "수정하기" 2 = "삭제하기"
    if (action === 1) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          imageMutation.mutate({ file });
        }
      };
      input.click();
    } else if (action === 2) {
      imageMutation.mutate({});
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    // 닉네임 중복 체크
    if (profileData.nickname !== user.nickname) {
      const isDuplicate = await isNicknameDuplicated(profileData.nickname);
      if (isDuplicate) {
        toast.error("이미 사용 중인 닉네임입니다.");
        return;
      }
    }

    updateMutation.mutate({
      id: user.id,
      updatedFields: profileData,
    });
  };

  if (!user) {
    return (
      <ProfilePage>
        <EmptyMessage>유저 정보를 불러올 수 없습니다.</EmptyMessage>
      </ProfilePage>
    );
  }

  return (
    <ProfilePage>
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
        <ProfileImageSection
          profileImage={profileImage}
          isEditing={isEditing}
          onIconAction={handleIconAction}
        />
      </ProfileHeader>
      <ProfileDataWrapper>
        <ProfileForm
          profileData={profileData}
          email={user?.email ?? ""}
          isEditing={isEditing}
          onInputChange={handleInputChange}
        />
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
    </ProfilePage>
  );
};

export default Profile;

const ProfilePage = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 100px;
`;

const ProfileHeader = styled.div`
  width: 100%;
  height: 220px;
  background-color: var(--profile-background);
  position: relative;
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

const EmptyMessage = styled.div`
  text-align: center;
  margin-top: 40px;
  font-size: var(--font-size-medium);
  color: var(--text-secondary);
`;
