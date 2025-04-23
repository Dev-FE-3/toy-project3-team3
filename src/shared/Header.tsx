import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/shared/lib/supabase";
import styled from "@emotion/styled";
import IdolLink from "@/assets/images/IdolLink.svg";
import DefaultProfile from "@/assets/images/DefaultProfile.svg";
import useProfileImage from "./hooks/useProfileImage";
import useLockStore from "@/stores/lockStore";
import Modal from "./component/Modal";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLocked } = useLockStore();

  const { profileImage } = useProfileImage(); // 프로필 이미지 fetch

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("로그아웃 실패:", error.message);
    } else {
      navigate("/login");
    }
  };

  const isProfilePage = location.pathname === "/profile";

  return (
    <>
      <HeaderWrapper data-testid="header">
        <Link to="/" onClick={(e) => isLocked && e.preventDefault()}>
          <Logo src={IdolLink} alt="IdolLink Logo" data-testid="header-logo" />
        </Link>
        {isProfilePage ? (
          <LogoutButton
            onClick={(e) => {
              if (isLocked) {
                e.preventDefault(); // 혹시 모를 이벤트 기본 동작 방지
                setErrorMessage("현재 수정 중이라 로그아웃이 불가합니다.");
                setErrorModalOpen(true);

                return; // 로그아웃 막기
              }
              handleLogout();
            }}
          >
            로그아웃
          </LogoutButton>
        ) : (
          <Link to="/profile" onClick={(e) => isLocked && e.preventDefault()}>
            <Profile
              src={profileImage || DefaultProfile}
              alt="Profile Image"
              data-testid="header-profileLogo"
            />
          </Link>
        )}
      </HeaderWrapper>
      <Modal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        onConfirm={() => setErrorModalOpen(false)}
        message={errorMessage}
        rightButtonText="확인"
        type="alert"
      />
    </>
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
  object-fit: cover;

  cursor: pointer;
  :hover {
    width: 44px;
    height: 44px;
  }
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
