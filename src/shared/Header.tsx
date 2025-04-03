import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import styled from "@emotion/styled";
import IdolLink from "../assets/images/IdolLink.svg";
import DefaultProfile from "../assets/images/defaultProfile.svg";

interface User {
  id: string;
}

const Header: React.FC = () => {
  const location = useLocation();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        console.warn("사용자가 로그인하지 않았습니다.");
        return;
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
        console.warn("프로필 이미지가 존재하지 않습니다.");
        setProfileImage(DefaultProfile);
        return;
      }

      const { data } = supabase.storage
        .from("profiles")
        .getPublicUrl(`profiles/${user.id}.png`);
      setProfileImage(data.publicUrl);
    };

    fetchProfileImage();
  }, [user]);

  const isProfilePage = location.pathname === "/profile";

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
  }
`;
