import CommonInput from "@/shared/component/input";
import styled from "@emotion/styled";
import RenderHashTags from "@/pages/profile/component/renderHashTags";

interface ProfileFormProps {
  profileData: {
    nickname: string;
    sort_intro: string;
    artist_hash_tag: string;
  };
  email: string;
  isEditing: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const ProfileForm = ({
  profileData,
  email,
  isEditing,
  onInputChange,
}: ProfileFormProps) => {
  return (
    <FormWrapper>
      <CommonInput
        id="nickname"
        label="닉네임"
        placeholder="닉네임"
        labelPosition="left"
        value={profileData.nickname}
        onChange={onInputChange}
        width="250px"
        isReadOnly={!isEditing}
      />
      <CommonInput
        id="email"
        label="이메일"
        labelPosition="left"
        value={email}
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
        onChange={onInputChange}
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
          onChange={onInputChange}
          isReadOnly={false}
        />
      ) : (
        <div
          style={{
            display: "flex",
            gap: "50px",
            alignItems: "flex-start",
          }}
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
          <RenderHashTags text={profileData.artist_hash_tag} />
        </div>
      )}
    </FormWrapper>
  );
};

export default ProfileForm;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;
