import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Title from "@/shared/component/Title";
import CommonInput from "@/shared/component/input";
import styled from "@emotion/styled";
import defaultProfile from "@/assets/images/defaultProfile.svg";
import useFollowList from "@/api/useFollowList";
import { getUser } from "@/db/users";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/shared/component/Loading";
import Reset from "@/assets/images/reset.svg";
import useDebounce from "@/shared/hooks/useDebounce";
import { TabMenu, TabButton } from "@/shared/component/Tab";

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

  const targetId = Number(randomId);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 100);

  const {
    followList,
    isLoading: isFollowLoading,
    //isError: isFollowError,
  } = useFollowList(targetId, selectedTab);

  const { data: filteredUsers = [], isLoading: isUserLoading } = useQuery({
    queryKey: ["allUsers", debouncedSearchTerm],
    queryFn: getUser,
    select: (users) => {
      if (!debouncedSearchTerm) return users;
      return users.filter((user) =>
        user.nickname
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()),
      );
    },
  });

  const isLoading = isFollowLoading || isUserLoading;

  const matchedUsers = useMemo(() => {
    return filteredUsers.filter((user) =>
      (followList as FollowItem[]).some((f) =>
        selectedTab === "follower"
          ? f.random_id === user.random_id
          : f.following_id === user.random_id,
      ),
    );
  }, [filteredUsers, followList, selectedTab]);

  return (
    <>
      <Title showBackButton />
      <TabMenu>
        <TabButton
          isActive={selectedTab === "follower"}
          onClick={() => setSelectedTab("follower")}
        >
          팔로워
        </TabButton>
        <TabButton
          isActive={selectedTab === "following"}
          onClick={() => setSelectedTab("following")}
        >
          팔로잉
        </TabButton>
      </TabMenu>

      <InputWrapper>
        <InputContainer>
          <CommonInput
            id="userName"
            placeholder="사용자를 검색해 주세요."
            width="100%"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ResetButton
            src={Reset}
            alt="검색 초기화"
            visible={searchTerm !== ""}
            onClick={() => setSearchTerm("")}
          />
        </InputContainer>
      </InputWrapper>

      <ProfileListWrapper>
        {isLoading ? (
          <Loading />
        ) : matchedUsers.length === 0 ? (
          <EmptyMessage>일치하는 사용자가 없습니다.</EmptyMessage>
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
    </>
  );
};

export default FollowInfo;

const InputWrapper = styled.div`
  width: 100%;
  height: 40px;
  margin-top: 25px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
`;

const InputContainer = styled.div`
  position: relative;
  width: 400px; // CommonInput의 width와 동일
`;

const ResetButton = styled.img<{ visible: boolean }>`
  width: 18px;
  height: 18px;
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
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
  object-fit: cover;
`;

const ProfileName = styled.span`
  font-size: var(--font-size-large);
  color: var(--text-primary);
  font-weight: 400;
  flex-direction: column;
`;

const EmptyMessage = styled.div`
  text-align: center;
  margin-top: 40px;
  font-size: var(--font-size-medium);
  color: var(--text-secondary);
`;
