import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import styled from "@emotion/styled";
import IdolLink from "@/assets/images/IdolLink.svg";
import DefaultProfile from "@/assets/images/DefaultProfile.svg";

interface User {
  id: string;
}

const Header = () => {
  const location = useLocation();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        return; // 로그인 하지 않았을 때
      }
      setUser({ id: data.user.id });
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchProfileImage = async () => {
      const { data: fileList, error } = await supabase.storage
        .from("profiles")
        .list("profiles/", { search: user.id });

      if (error || fileList.length === 0) {
        setProfileImage(DefaultProfile); // 프로필 이미지 설정 전인 경우
        return;
      }

      const { data } = supabase.storage
        .from("profiles")
        .getPublicUrl(`profiles/${user.id}.png`);
      setProfileImage(data.publicUrl);
    };

    fetchProfileImage();
  }, [user]);

  const isProfilePage = location.pathname === "/profile"; // 경로는 storage 설정하면서 수정하면 됩니다..!

  return (
    <HeaderWrapper>
      <Link to="/">
        <Logo src={IdolLink} alt="IdolLink Logo" />
      </Link>
      {isProfilePage ? (
        <LogoutButton>로그아웃</LogoutButton>
      ) : (
        <Link to="/profile">
          <Profile src={profileImage || DefaultProfile} alt="Profile Image" />
        </Link>
      )}
    </HeaderWrapper>
  );
};

export default Header;

const HeaderWrapper = styled.div`
  width: 600px;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  justify-content: space-between;
`;

const Logo = styled.img`
  cursor: pointer;
`;

const Profile = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  cursor: pointer;
`;

const LogoutButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-large);
  color: var(--text-secondary);
  font-weight: 700;
  padding: 10px;

  :hover {
    background-color: var(--button-gray);
    border-radius: 20px;
    transition: background-color 0.3s ease-in-out;
  }
`;
