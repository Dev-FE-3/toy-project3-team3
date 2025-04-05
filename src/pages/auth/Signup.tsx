import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import Button from "@/shared/component/Button";
import IdolLinkLogo from "@/assets/images/IdolLink.svg";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cofirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = () => {};
  return (
    <Wrapper>
      <Logo src={IdolLinkLogo} alt="로고" />

      <Form>
        <Title>회원가입</Title>

        <InputWrapper>
          <InputLabel htmlFor="email">이메일</InputLabel>
          <SignupInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요"
          />
        </InputWrapper>

        <InputWrapper>
          <InputLabel htmlFor="password">비밀번호</InputLabel>
          <SignupInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
          />
        </InputWrapper>

        <InputWrapper>
          <InputLabel htmlFor="confirmPassword">비밀번호 확인</InputLabel>
          <SignupInput
            id="confirmPassword"
            type="password"
            value={cofirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 다시 입력해주세요"
          />
        </InputWrapper>

        <SignupButton size="big" btnColor="pink" onClick={handleSignup}>
          회원가입
        </SignupButton>

        <LoginGuide>
          계정이 이미 있으신가요?{" "}
          <span onClick={() => navigate("/login")}>로그인</span>
        </LoginGuide>
      </Form>
    </Wrapper>
  );
};

export default Signup;

const Wrapper = styled.div`
  width: 600px;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img`
  width: 142px;
  height: 42px;
  margin-top: 120px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  align-items: center;
`;

const Title = styled.h2`
  font-size: var(--font-size-large);
  color: var(--text-primary);
  font-weight: bold;
  margin: 35px 0;
  align-self: flex-start;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

const InputLabel = styled.label`
  font-size: var(--font-size-large);
  color: var(--text-primary);
  margin-bottom: 8px;
`;

const SignupInput = styled.input`
  width: 374px;
  height: 48px;
  border: 1px solid var(--disabled);
  color: var(--text-primary);
  font-size: var(--font-size-large);
  border-radius: 20px;
  padding: 0 12px;
  margin-bottom: 37px;

  &::placeholder {
    color: var(--disabled);
  }

  &:focus {
    border: 1px solid var(--primary);
    outline: none;
  }
`;

const SignupButton = styled(Button)`
  margin-top: 13px;
`;

const LoginGuide = styled.p`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  margin-top: 15px;
  text-align: center;

  span {
    color: var(--primary);
    font-weight: bold;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;
