import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Title from "@/shared/component/Title";
import CommonInput from "@/shared/component/input";
import styled from "@emotion/styled";
import defaultProfile from "@/assets/images/defaultProfile.svg";
import useFollowList from "@/api/services/useFollowList";
import { getUser } from "@/api/users.ts";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/shared/component/Loading";

interface FollowItem {
  random_id: number;
  following_id: number;
  nickname?: string;
  user_img?: string;
}

const FollowInfo = () => {
  const { randomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tabParam = searchParams.get("tab");
  const initialTab =
    tabParam === "follower" || tabParam === "following" ? tabParam : "follower";

  const [selectedTab, setSelectedTab] = useState<"follower" | "following">(
    initialTab,
  );

  useEffect(() => {
    if (tabParam === "follower" || tabParam === "following") {
      setSelectedTab(tabParam);
    }
  }, [tabParam]);

  const targetId = Number(randomId);

  const { data: followList = [], isLoading: isFollowLoading } = useFollowList(
    targetId,
    selectedTab,
  );

  const { data: users = [], isLoading: isUserLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getUser,
  });

  const isLoading = isFollowLoading || isUserLoading;

  // followList의 random_id에 해당하는 user만 필터링
  const matchedUsers = users.filter((user) =>
    (followList as FollowItem[]).some(
      (f) =>
        selectedTab === "follower"
          ? f.random_id === user.random_id // 나를 팔로우한 사람의 random_id
          : f.following_id === user.random_id, // 내가 팔로우한 사람의 following_id
    ),
  );

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
      {selectedTab === "follower" || selectedTab === "following" ? (
        <ProfileListWrapper>
          {isLoading ? (
            <Loading />
          ) : (
            matchedUsers.map((user) => (
              <ProfileArea
                key={user.random_id}
                onClick={() => navigate(`/storage/${user.random_id}`)}
              >
                <ProfileImg src={user.user_img || defaultProfile} />
                <ProfileName>{user.nickname}</ProfileName>
              </ProfileArea>
            ))
          )}
        </ProfileListWrapper>
      ) : null}
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
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
`;

const ProfileImg = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
`;

const ProfileName = styled.span`
  font-size: var(--font-size-large);
  color: var(--text-primary);
  font-weight: 400;
  flex-direction: column;
`;
