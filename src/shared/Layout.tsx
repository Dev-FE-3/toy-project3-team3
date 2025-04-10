import { Outlet } from "react-router-dom";
import styled from "@emotion/styled";
import Header from "@/shared/Header";
import Nav from "@/shared/Nav";

const TopWrapper = styled.div`
  background-color: var(--button-gray);
  width: 100%;
  height: 100vh; // 콘텐츠 높이만큼 자동으로 늘어남
`;

const Wrapper = styled.div`
  width: 600px;
  margin: 0 auto;
  background-color: var(--background-color);
  height: 100vh;
`;

const Layout = () => {
  return (
    <TopWrapper>
      <Wrapper>
        <Header />
        <Outlet />
        <Nav />
      </Wrapper>
    </TopWrapper>
  );
};

export default Layout;

