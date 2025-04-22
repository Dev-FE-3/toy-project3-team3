import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import DefaultProfile from "@/assets/images/defaultProfile.svg";
import Button from "@/shared/component/Button";
import CommonInput from "@/shared/component/input";
import useProfileImage from "@/shared/hooks/useProfileImage";
import Dropbox from "@/shared/component/Dropbox";
import Title from "@/shared/component/Title";
import useUpdateUserInfo from "@/pages/profile/hooks/useUpdateUserInfo";
import Cancel from "@/assets/images/cancel.svg";
import Modal from "@/shared/component/Modal";
import { useNavigate } from "react-router-dom";
import useLockStore from "@/stores/lockStore";
import useUploadDeleteProfileImage from "./hooks/useUploadDeleteProfileImage";
import { toast } from "react-toastify";
import { useUserStore } from "@/stores/userStore";
import { isNicknameDuplicated } from "@/db/users";

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

  if (!user) return toast.error("유저 정보가 존재하지 않습니다.");

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
            width="250px"
            isReadOnly={!isEditing}
          />
          <CommonInput
            id="email"
            label="이메일"
            labelPosition="left"
            value={user?.email ?? ""}
            onChange={() => {}}
            width="250px"
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
          {isEditing ? (
            <CommonInput
              id="artist_hash_tag"
              label="관심 아티스트"
              placeholder="관심 아티스트를 입력해 주세요."
              labelPosition="left"
              isTextarea
              value={profileData.artist_hash_tag}
              onChange={handleInputChange}
              isReadOnly={false}
            />
          ) : (
            <div
              style={{ display: "flex", gap: "50px", alignItems: "flex-start" }}
            >
              <label
                style={{
                  minWidth: "110px",
                  fontWeight: "bold",
                  fontSize: "var(--font-size-large)",
                  color: "var(--text-primary)",
                  textAlign: "right",
                  marginTop: "10px",
                }}
              >
                관심 아티스트
              </label>
              <StyledReadOnlyTag>
                {profileData.artist_hash_tag.split(" ").map((word, idx) =>
                  word.startsWith("#") ? (
                    <span className="hashtag" key={idx}>
                      {word + " "}
                    </span>
                  ) : (
                    word + " "
                  ),
                )}
              </StyledReadOnlyTag>
            </div>
          )}
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
    </ProfilePage>
  );
};

export default Profile;

const ProfilePage = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto; // 🔥 이걸 추가!
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 100px; // Nav 가림 방지용
`;

const ProfileHeader = styled.div`
  width: 100%;
  //height: 150px;
  height: 220px;
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
  //height: 350px;
  height: 400px;
  border-radius: 18px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  //margin: 110px auto 0;
  margin: 125px auto 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  //margin-top: 15px;
  margin-top: 30px;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const StyledReadOnlyTag = styled.div`
  width: 250px;
  min-height: 60px;
  padding: 5px 5px;
  border-radius: 20px;
  background-color: transparent;
  color: var(--text-primary);
  font-size: var(--font-size-primary);
  border: 1px solid transparent;
  white-space: pre-wrap;
  word-break: break-word;

  span.hashtag {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    background-color: var(--primary);
    color: white;

    height: 26px;
    padding: 0 10px;
    margin-right: 6px;

    border-radius: 999px; /* pill 모양 */
    font-weight: 500;
    font-size: 14px;
    line-height: 1;
  }
`;
