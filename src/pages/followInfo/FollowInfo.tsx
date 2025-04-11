import { useSearchParams, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Title from "@/shared/component/Title";
import CommonInput from "@/shared/component/input";
import styled from "@emotion/styled";
import defaultProfile from "@/assets/images/defaultProfile.svg";

const FollowInfo = () => {
  const { randomId } = useParams();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "follower"; // 기본값은 follower

  const [selectedTab, setSelectedTab] = useState<"follower" | "following">(
    defaultTab as any,
  );

  useEffect(() => {
    if (defaultTab === "follower" || defaultTab === "following") {
      setSelectedTab(defaultTab);
    }
  }, [defaultTab]);

  return (
    <>
      <Title showBackButton />
      <TabMenu>
        <TabLeft
          isActive={selectedTab === "follower"}
          onClick={() => setSelectedTab("follower")}
        >
          팔로워
        </TabLeft>
        <TabRight
          isActive={selectedTab === "following"}
          onClick={() => setSelectedTab("following")}
        >
          팔로잉
        </TabRight>
      </TabMenu>
      <InputWrapper>
        <CommonInput
          id="userName"
          placeholder="사용자를 검색해 주세요."
          width="468px"
        />
      </InputWrapper>

      {selectedTab === "follower" ? (
        <ProfileListWrapper>
          <ProfileArea>
            <ProfileImg src={defaultProfile} />
            <ProfileName>사용자 이름</ProfileName>
          </ProfileArea>
          <ProfileArea>
            <ProfileImg src={defaultProfile} />
            <ProfileName>사용자 이름</ProfileName>
          </ProfileArea>
        </ProfileListWrapper>
      ) : (
        <div>팔로잉 리스트 렌더링</div>
      )}
    </>
  );
};

export default FollowInfo;

const TabMenu = styled.div`
  width: 600px;
  height: 60px;
  display: flex;
  font-size: var(--font-size-large);
`;

const TabLeft = styled.div<{ isActive: boolean }>`
  width: 300px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: ${(props) => (props.isActive ? 700 : 400)};
  border-bottom: ${(props) =>
    props.isActive
      ? `3px solid var(--primary)`
      : `3px solid var(--disabled-2)`};
  color: ${(props) =>
    props.isActive ? `var(--primary)` : `var(--text-primary)`};
  &:hover {
    background-color: var(--profile-background);
    transition: background-color 0.3s ease-in-out;
  }
`;

const TabRight = styled.div<{ isActive: boolean }>`
  width: 300px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: ${(props) => (props.isActive ? 700 : 400)};
  border-bottom: ${(props) =>
    props.isActive
      ? `3px solid var(--primary)`
      : `3px solid var(--disabled-2)`};
  color: ${(props) =>
    props.isActive ? `var(--primary)` : `var(--text-primary)`};
  &:hover {
    background-color: var(--profile-background);
    transition: background-color 0.3s ease-in-out;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  height: 40px;
  margin-top: 25px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center; // 핵심! 가운데로 보내줌
  justify-content: center;
`;

const ProfileListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileArea = styled.div`
  margin: 0 65px;
  padding: 15px 0;
  display: flex;
  gap: 30px;
  border-bottom: 1px solid var(--disabled-2);
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const ProfileImg = styled.img`
  width: 70px;
  height: 70px;
`;

const ProfileName = styled.span`
  font-size: var(--font-size-large);
  color: var(--text-primary);
  font-weight: 400;
  flex-direction: column;
`;
