import { Outlet } from "react-router-dom";
import styled from "@emotion/styled";
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
      <h2>Outlet 위에 로고 두면 될 듯!</h2>
      <Outlet />
      <Nav />
    </Wrapper>
  );
};

export default Layout;
