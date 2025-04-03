import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import styled from "@emotion/styled";
import IdolLink from "../assets/images/IdolLink.svg";
import DefaultProfile from "../assets/images/defaultProfile.svg";

const Header = () => {
  const location = useLocation();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const userId = "example-user-id"; // 실제 사용자 ID로 변경 필요

      // 파일이 존재하는지 확인
      const { data: fileList, error } = await supabase.storage
        .from("profiles")
        .list("profiles/", { search: userId });

      if (error || fileList.length === 0) {
        console.warn("프로필 이미지가 존재하지 않습니다.");
        setProfileImage(DefaultProfile); // 기본 이미지 유지
        return;
      }

      // 존재하면 URL 가져오기
      const { data } = supabase.storage
        .from("profiles")
        .getPublicUrl(`profiles/${userId}.png`);
      setProfileImage(data.publicUrl);
    };

    fetchProfileImage();
  }, []);

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
  font-size: 18px;
`;
