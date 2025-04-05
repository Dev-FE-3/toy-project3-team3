import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase.ts";
import styled from "@emotion/styled";
import Button from "@/shared/component/Button";
import IdolLinkLogo from "@/assets/images/IdolLink.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("로그인 실패:", error.message);
      return;
    }

    navigate("/");
  };

  return (
    <Wrapper>
      <Logo src={IdolLinkLogo} alt="로고" />

      <Form>
        <Title>로그인</Title>
        <InputWrapper>
          <InputLabel htmlFor="email">이메일</InputLabel>
          <LoginInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요"
          />
        </InputWrapper>

        <InputWrapper>
          <InputLabel htmlFor="password">비밀번호</InputLabel>
          <LoginInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
          />
        </InputWrapper>

        <LoginButton size="big" btnColor="pink" onClick={handleLogin}>
          로그인
        </LoginButton>
        <SignupGuide>
          계정이 아직 없으신가요?
          <span onClick={() => navigate("/signup")}> 회원가입</span>
        </SignupGuide>
      </Form>
    </Wrapper>
  );
};

export default Login;

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
  margin: 35px 0;
  font-weight: bold;
  align-self: flex-start;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%
  gap: 20px;
`;

const InputLabel = styled.label`
  font-size: var(--font-size-large);
  color: var(--text-primary);
  margin-bottom: 20px;
`;

const LoginInput = styled.input`
  width: 374px;
  height: 48px;
  border: 1px solid var(--disabled);
  color: var(--text-primary);
  font-size: var(----font-size-large);
  border-radius: 20px;
  padding: 0 12px;
  margin-bottom: 37px;

  &::placeholder {
    color: var(--disabled);
  }

  &:focus {
    border: 1px solid var(--primary);
  }
`;

const LoginButton = styled(Button)`
  margin-top: 13px;
`;

const SignupGuide = styled.p`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  text-align: center;
  margin-top: 15px;

  span {
    color: var(--primary);
    font-weight: bold;
    cursor: pointer;
  }
`;
