import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { useForm } from "react-hook-form";
import Button from "@/shared/component/Button";
import IdolLinkLogo from "@/assets/images/IdolLink.svg";

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });

  const password = watch("password");

  const onSubmit = (data: FormValues) => {
    console.log("회원가입 진행:", data);
  };

  return (
    <Wrapper>
      <Logo src={IdolLinkLogo} alt="로고" />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Title>회원가입</Title>

        <InputWrapper>
          <InputLabel htmlFor="email">이메일</InputLabel>
          <SignupInput
            id="email"
            type="email"
            placeholder="이메일을 입력해주세요"
            hasError={!!errors.email}
            {...register("email", {
              validate: (value) =>
                value.trim() !== "" || "공백만 입력할 수 없습니다.",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "유효한 이메일 주소를 입력해 주세요.",
              },
            })}
          />
          {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
        </InputWrapper>

        <InputWrapper>
          <InputLabel htmlFor="password">비밀번호</InputLabel>
          <SignupInput
            id="password"
            type="password"
            placeholder="비밀번호를 입력해주세요(8자리 이상)"
            hasError={!!errors.password}
            {...register("password", {
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
          {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
        </InputWrapper>

        <InputWrapper>
          <InputLabel htmlFor="confirmPassword">비밀번호 확인</InputLabel>
          <SignupInput
            id="confirmPassword"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            hasError={!!errors.confirmPassword}
            {...register("confirmPassword", {
              validate: (value) =>
                value === password || "비밀번호가 일치하지 않습니다.",
            })}
          />
          {errors.confirmPassword && (
            <ErrorText>{errors.confirmPassword.message}</ErrorText>
          )}
        </InputWrapper>

        <SignupButton
          size="big"
          btnColor="pink"
          onClick={handleSubmit(onSubmit)}
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

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const InputLabel = styled.label`
  font-size: var(--font-size-large);
  color: var(--text-primary);
  margin-bottom: 20px;
`;

const SignupInput = styled.input<{ hasError?: boolean }>`
  width: 374px;
  height: 48px;
  border: 1px solid
    ${(props) => (props.hasError ? "var(--error, red)" : "var(--disabled)")};
  color: var(--text-primary);
  font-size: var(--font-size-primary);
  border-radius: 20px;
  padding: 0 12px;
  margin-bottom: 37px;

  &::placeholder {
    color: var(--disabled);
  }

  &:focus {
    border: 1px solid
      ${(props) => (props.hasError ? "var(--error, red)" : "var(--primary)")};
  }
`;

const ErrorText = styled.p`
  position: absolute;
  bottom: 20px;
  left: 12px;
  color: var(--error, red);
  font-size: var(--font-size-small);
  margin: 0;
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
