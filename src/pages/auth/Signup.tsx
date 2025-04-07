import { supabase } from "@/lib/supabase.ts";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styled from "@emotion/styled";
import Button from "@/shared/component/Button";
import FormInput from "./component/FormInput";
import IdolLinkLogo from "@/assets/images/IdolLink.svg";

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

const Signup = () => {
  const navigate = useNavigate();
  const {
    register, //각 input에 연결해서 폼 상태 관리
    handleSubmit,
    watch, //특정 필드 값을 실시간으로 감시
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "onChange" }); //입력이 바뀔 때마다 유효성 검사 실행

  const password = watch("password");

  /**회원가입 처리 */
  const handleSignup = async (data: FormValues) => {
    const { email, password } = data;

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("회원가입 실패: ", error.message);
      return;
    }

    alert("회원가입 성공!");
    navigate("/login");
  };

  return (
    <Wrapper>
      <Logo src={IdolLinkLogo} alt="로고" />

      <Form onSubmit={handleSubmit(handleSignup)}>
        <Title>회원가입</Title>

        <FormInput
          id="email"
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="이메일을 입력해주세요"
          error={errors.email?.message}
          {...register("email", {
            required: "이메일을 입력해주세요.",
            validate: (value) =>
              value.trim() !== "" || "공백만 입력할 수 없습니다.",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "유효한 이메일 주소를 입력해 주세요.",
            },
          })}
        />

        <FormInput
          id="password"
          label="비밀번호"
          type="password"
          autoComplete="off"
          placeholder="비밀번호를 입력해주세요 (8자리 이상)"
          error={errors.password?.message}
          {...register("password", {
            required: "비밀번호를 입력해주세요.",
            validate: (value) =>
              value.trim() !== "" || "공백만 입력할 수 없습니다.",
            minLength: {
              value: 8,
              message: "비밀번호는 8자리 이상이어야 합니다.",
            },
            maxLength: {
              value: 16,
              message: "비밀번호는 16자리 이하여야 합니다.",
            },
            pattern: {
              value: /[!@#$%^&*(),.?":{}|<>]/,
              message: "비밀번호에 특수문자 하나 이상 포함해주세요.",
            },
          })}
        />

        <FormInput
          id="confirmPassword"
          label="비밀번호 확인"
          type="password"
          autoComplete="off"
          placeholder="비밀번호를 다시 입력해주세요"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "비밀번호를 다시 입력해주세요.",
            validate: (value) =>
              value === password || "비밀번호가 일치하지 않습니다.",
          })}
        />

        <SignupButton
          size="big"
          btnColor="pink"
          onClick={handleSubmit(handleSignup)}
          disabled={!isValid} //유효할 때만 버튼 활성화
        >
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
  margin-top: 125px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 400px;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 24px;
  color: var(--text-primary);
  margin: 35px 0;
  align-self: center;
`;

const SignupButton = styled(Button)`
  margin-top: 13px;
  width: 100%;
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
