import { Outlet } from "react-router-dom";
import styled from "@emotion/styled";
import Header from "@/shared/Header";
import Nav from "@/shared/Nav";

const TopWrapper = styled.div`
  background-color: var(--button-gray);
  width: 100%;
  height: auto; // 콘텐츠 높이만큼 자동으로 늘어남
  min-height: 100vh; // 최소 높이를 화면 전체 높이로 보장
`;

const Wrapper = styled.div`
  width: 600px;
  margin: 0 auto;
  background-color: var(--background-color);
  box-sizing: border-box;
  padding-bottom: 60px; // nav에 콘텐츠가 가리는 않도록
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

