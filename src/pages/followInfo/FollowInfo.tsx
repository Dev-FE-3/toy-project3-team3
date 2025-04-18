import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Title from "@/shared/component/Title";
import CommonInput from "@/shared/component/input";
import styled from "@emotion/styled";
import defaultProfile from "@/assets/images/defaultProfile.svg";
import useFollowList from "@/api/services/useFollowList";
import { getUser } from "@/api/users.ts";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/shared/component/Loading";
import Reset from "@/assets/images/reset.svg";
import useDebounce from "@/shared/hooks/useDebounce";

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

  const [searchTerm, setSearchTerm] = useState("");
  // const [filteredUsers, setFilteredUsers] = useState(users);

  // 검색어 변경 → 필터링
  // const handleSearch = useCallback(
  //   (value: string) => {
  //     if (!value) {
  //       setFilteredUsers(users);
  //     } else {
  //       const filtered = users.filter((user) =>
  //         user.nickname?.toLowerCase().includes(value.toLowerCase()),
  //       );
  //       setFilteredUsers(filtered);
  //     }
  //   },
  //   [users],
  // );

  // const debouncedSearch = useMemo(
  //   () => debounce(handleSearch, 100),
  //   [handleSearch],
  // );

  // useEffect(() => {
  //   debouncedSearch(searchTerm);
  // }, [searchTerm, debouncedSearch]);

  // useEffect(() => {
  //   setFilteredUsers(users); // `users`가 변경될 때마다 `filteredUsers` 초기화
  // }, [users]);

  const debouncedSearchTerm = useDebounce(searchTerm, 100);

  const filteredUsers = useMemo(() => {
    if (!debouncedSearchTerm) return users;
    return users.filter((user) =>
      user.nickname?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    );
  }, [debouncedSearchTerm, users]);

  const matchedUsers = filteredUsers.filter((user) =>
    (followList as FollowItem[]).some((f) =>
      selectedTab === "follower"
        ? f.random_id === user.random_id
        : f.following_id === user.random_id,
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
`;

const ProfileName = styled.span`
  font-size: var(--font-size-large);
  color: var(--text-primary);
  font-weight: 400;
  flex-direction: column;
`;
