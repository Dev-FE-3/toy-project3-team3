import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DefaultProfile from "@/assets/images/defaultProfile.svg";
import Button from "@/shared/component/Button";
import CommonInput from "@/shared/component/input";
import useProfileImage from "@/shared/hooks/useUserProfile";

const Profile = () => {
  const [user, setUser] = useState<{
    id: string;
    email: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nickname: "사용자 닉네임",
    bio: "한 줄 소개를 입력해주세요.",
    artists: "관심 있는 아티스트를 입력해주세요.",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) return;
      setUser({
        id: data.user.id,
        email: data.user.email ?? "",
      });
    };

    fetchUser();
  }, []);

  const { profileImage } = useProfileImage();

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
      <TitleWrapper>
        <Title>프로필</Title>
      </TitleWrapper>
      <ProfileHeader>
        <ProfileImage
          src={profileImage || DefaultProfile}
          alt="프로필 이미지"
        />
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

// 스타일
const TitleWrapper = styled.div`
  width: 600px;
  height: 60px;
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 400;
  color: var(--text-primary);
  margin-left: 24px;
`;

const ProfileHeader = styled.div`
  width: 100%;
  height: 224px;
  background-color: var(--profile-background);
  display: flex;
  justify-content: center;
  position: relative;
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
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
