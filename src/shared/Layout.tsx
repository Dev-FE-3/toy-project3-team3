import { Outlet } from "react-router-dom";
import styled from "@emotion/styled";
import Header from "./Header";
import Nav from "./Nav";

const Wrapper = styled.div`
  width: 600px;
  height: 100vh;
  margin: 0 auto;
  box-sizing: border-box;
`;

const Layout = () => {
  return (
    <Wrapper>
      <Header />
      <Outlet />
      <Nav />
    </Wrapper>
  );
};

export default Layout;
