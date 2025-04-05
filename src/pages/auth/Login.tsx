import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase.ts";
import styled from "@emotion/styled";
import Button from "@/shared/component/Button";

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
    <>
      <h2>로그인</h2>
      <LoginInput
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
      />
      <LoginInput
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
      />
      <Button size="big" btnColor="pink" onClick={handleLogin}>
        로그인
      </Button>
    </>
  );
};

export default Login;

const LoginInput = styled.input`
  width: 500px;
  height: 50px;
  border: 1px solid var(--disabled);
  color: var(--disabled);
  font-size: var(----font-size-large);
  border-radius: 20px;
`;
