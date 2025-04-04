import { NavLink } from "react-router-dom";
import styled from "@emotion/styled";
import { ReactSVG } from "react-svg";
import Home from "@/assets/images/Home.svg";
import Inbox from "@/assets/images/Inbox.svg";
import Plus from "@/assets/images/Plus.svg";
import Search from "@/assets/images/Search.svg";

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
}

const navItems: NavItemProps[] = [
  { to: "/", icon: Home, label: "홈" },
  { to: "/search", icon: Search, label: "탐색" },
  { to: "/create", icon: Plus, label: "생성" },
  { to: "/storage", icon: Inbox, label: "보관함" },
];

const Nav = () => {
  return (
    <NavWrapper>
      {navItems.map(({ to, icon, label }) => (
        <StyledNavLink key={to} to={to}>
          <ButtonIcon src={icon} alt={label} />
          <ButtonName>{label}</ButtonName>
        </StyledNavLink>
      ))}
    </NavWrapper>
  );
};

export default Nav;

const NavWrapper = styled.div`
  width: 600px;
  height: 70px;
  display: flex;
  align-items: center;
  background: var(--background-color);
  position: fixed;
  bottom: 0;
  z-index: 100; // nav바가 항상 위에 있도록!
  box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.1);
`;

const StyledNavLink = styled(NavLink)`
  width: 150px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--text-secondary);
  transition: color 0.3s ease-in-out;

  &.active {
    color: var(--primary);
  }
`;

const ButtonIcon = ({ src }: { src: string; alt: string }) => (
  <ReactSVG
    src={src}
    wrapper="span" // 부모의 color 속성 상속
    style={{ width: "28px", height: "28px", marginBottom: "8px" }}
  />
);

const ButtonName = styled.span`
  font-size: var(--font-size-primary);
  font-weight: 500;
`;
