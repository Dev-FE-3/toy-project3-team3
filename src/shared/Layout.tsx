import { Outlet } from "react-router-dom";
import styled from "@emotion/styled";
import Header from "@/shared/Header";
import Nav from "@/shared/Nav";

// const TopWrapper = styled.div`
//   background-color: var(--button-gray);
//   width: 100%;
//   height: 100vh; // 콘텐츠 높이만큼 자동으로 늘어남

// `;

// const Wrapper = styled.div`
//   width: 600px;
//   margin: 0 auto;
//   background-color: var(--background-color);
//   height: 100vh;
//   //margin-bottom: 200px;
// `;

// const Layout = () => {
//   return (
//     <TopWrapper>
//       <Wrapper>
//         <Header />
//         <Outlet />
//         <Nav />
//       </Wrapper>
//     </TopWrapper>
//   );
// };

const TopWrapper = styled.div`
  background-color: var(--button-gray);
  min-height: 100vh;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 600px;
  margin: 0 auto;
  background-color: var(--background-color);
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1;
  overflow-y: auto;
  flex-direction: column;
  overflow: hidden; // ✨ 중요! 내부에서만 스크롤 일어나도록
`;

const Layout = () => {
  return (
    <TopWrapper>
      <Wrapper>
        <Header />
        <Content>
          <Outlet />
        </Content>
        <Nav />
      </Wrapper>
    </TopWrapper>
  );
};

export default Layout;
