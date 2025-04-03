import { NavLink } from "react-router-dom";
import styled from "@emotion/styled";
import Home from "../assets/images/Home.svg";
import Inbox from "../assets/images/Inbox.svg";
import Plus from "../assets/images/Plus.svg";
import Search from "../assets/images/Search.svg";

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
}

const NavWrapper = styled.div`
  width: 600px;
  height: 70px;
  display: flex;
  align-items: center;
  background: var(--background-color);
  position: fixed;
  bottom: 0;
  z-index: 100;
`;

const ButtonWrapper = ({ to, icon, label }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) => (isActive ? "active" : "")}
    style={{ textDecoration: "none" }}
  >
    <StyledButton>
      <ButtonIcon src={icon} alt={label} />
      <ButtonName>{label}</ButtonName>
    </StyledButton>
  </NavLink>
);

const StyledButton = styled.div`
  width: 150px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);

  &.active {
    color: var(--primary);

    svg {
      fill: var(--primary);
    }
  }
`;

const ButtonIcon = styled.img`
  width: 28px;
  height: 28px;
  margin-bottom: 8px;
`;

const ButtonName = styled.span`
  font-size: var(--font-size-primary);
  font-weight: 500;
`;

const navItems: NavItemProps[] = [
  { to: "/", icon: Home, label: "홈" },
  { to: "/search", icon: Search, label: "탐색" },
  { to: "/create", icon: Plus, label: "생성" },
  { to: "/storage", icon: Inbox, label: "보관함" },
];

const Nav = () => {
  return (
    <NavWrapper>
      {navItems.map((item) => (
        <ButtonWrapper key={item.to} {...item} />
      ))}
    </NavWrapper>
  );
};

export default Nav;
