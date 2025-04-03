import styled from "@emotion/styled";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animation/loading.json";

const Loading = () => {
  return (
    <Wrapper>
      <AnimationBox>
        <Lottie animationData={loadingAnimation} loop />
      </AnimationBox>
    </Wrapper>
  );
};

export default Loading;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const AnimationBox = styled.div`
  width: 30px;
  height: 30px;
`;
