import styled from "@emotion/styled";
import Title from "@/shared/component/Title";
import defaultProfile from "@/assets/images/defaultProfile.svg";
import Button from "@/shared/component/Button";
import { useState } from "react";

const Storage = () => {
  const [activeTab, setActiveTab] = useState<"left" | "right">("left");

  return (
    <>
      <Title title="보관함" />
      <ProfileWrapper>
        <ProfileCardTop>
          <ImageArea src={defaultProfile} />
          <ProfileInfo>
            <NickName>내 계정</NickName>
            <InfoItemWrapper>
              <InfoItem>
                <InfoCount>6</InfoCount>
                <InfoLabel>팔로우</InfoLabel>
              </InfoItem>
              <InfoItem>
                <InfoCount>30</InfoCount>
                <InfoLabel>팔로잉</InfoLabel>
              </InfoItem>
              <InfoItem>
                <InfoCount>6</InfoCount>
                <InfoLabel>리스트</InfoLabel>
              </InfoItem>
            </InfoItemWrapper>
            <Button
              size="small"
              btnColor="pink"
              onClick={() => console.log("중간 버튼 클릭됨")}
            >
              프로필 수정
            </Button>
          </ProfileInfo>
        </ProfileCardTop>
        <ProfileCardBottom>
          <BioArea>아이돌 좋아</BioArea>
          <HashTagArea>#에스파</HashTagArea>
        </ProfileCardBottom>
      </ProfileWrapper>
      <TabMenu>
        <TabLeft
          isActive={activeTab === "left"} // 상태에 따라 스타일 변경
          onClick={() => setActiveTab("left")}
        >
          리스트
        </TabLeft>
        <TabRight
          isActive={activeTab === "right"} // 상태에 따라 스타일 변경
          onClick={() => setActiveTab("right")}
        >
          하트
        </TabRight>
      </TabMenu>
      <PlaylistArea>
        <VideoWrapper />
        <VideoWrapper />
        <VideoWrapper />
        <VideoWrapper />
        <VideoWrapper />
        <VideoWrapper />
        <VideoWrapper />
        <VideoWrapper />
      </PlaylistArea>
    </>
  );
};

export default Storage;

const ProfileWrapper = styled.div`
  width: 600px;
  height: 280px;
  padding: 10px 40px 10px 40px;
`;

const ProfileCardTop = styled.div`
  display: flex;
  padding: 18px 40px;
  gap: 100px;
`;

const ImageArea = styled.img`
  width: 165px;
  height: 165px;
`;

const ProfileInfo = styled.div`
  width: 200px;
  height: 165px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const NickName = styled.span`
  font-size: 24px;
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
  margin-top: 13px;
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BioArea = styled.span`
  font-size: var(--font-size-large);
  color: var(--text-primary);
  font-weight: 400;
  line-height: 18px;
`;

const HashTagArea = styled.span`
  font-size: var(--font-size-primary);
  color: var(--primary);
  font-weight: 400;
`;

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
    props.isActive ? `var(--primary)` : `var(--disabled-2)`};
  &:hover {
    background-color: #f5f5f5;
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
    props.isActive ? `var(--primary)` : `var(--disabled-2)`};
  &:hover {
    background-color: #f5f5f5;
    transition: background-color 0.3s ease-in-out;
  }
`;

const PlaylistArea = styled.div`
  display: flex;
  gap: 15px 0;
  padding: 15px 40px 85px 40px;
  overflow-y: auto;
  flex-wrap: wrap;
  max-height: 800px;
  justify-content: space-between;
  align-items: flex-start;
`;

const VideoWrapper = styled.div`
  width: 250px;
  height: 220px;
  border-radius: 15px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
`;
