import { supabase } from "@/lib/supabase.ts";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styled from "@emotion/styled";
import Button from "@/shared/component/Button";
import FormInput from "./component/FormInput";
import IdolLinkLogo from "@/assets/images/IdolLink.svg";
import { toast } from "react-toastify";

type FormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "onChange" });

  const handleLogin = async (data: FormValues) => {
    const { email, password } = data;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("이메일 또는 비밀번호를 다시 확인해주세요.");
      return;
    }

    toast.success(`반갑습니다! 🙌`);
    navigate("/");
  };

  return (
    <Wrapper>
      <Logo src={IdolLinkLogo} alt="로고" />

      <Form onSubmit={handleSubmit(handleLogin)}>
        <Title>로그인</Title>

        <FormInput
          id="email"
          label="이메일"
          type="email"
          placeholder="이메일을 입력해주세요"
          error={errors.email?.message}
          {...register("email", {
            required: "이메일을 입력해주세요.",
          })}
        />

        <FormInput
          id="password"
          label="비밀번호"
          type="password"
          autoComplete="off"
          placeholder="비밀번호를 입력해주세요"
          error={errors.password?.message}
          {...register("password", {
            required: "비밀번호를 입력해주세요.",
          })}
        />

        <LoginButton
          size="big"
          btnColor="pink"
          onClick={handleSubmit(handleLogin)}
          disabled={!isValid}
        >
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 400px;
  align-items: center;
`;

const Title = styled.h2`
  font-size: var(--font-size-subtitle);
  color: var(--text-primary);
  margin: 35px 0;
  align-self: center;
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
