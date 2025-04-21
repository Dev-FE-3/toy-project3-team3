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
  confirmPassword: string;
};

const generateRandomId = () => {
  return Math.floor(100000 + Math.random() * 900000); //6자리 숫자
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
    const randomId = generateRandomId();

    //Supabase Auth를 사용하여 회원가입 진행
    const { data: signupData, error } = await supabase.auth.signUp({
      email,
      password,
    });

    //에러가 발생하거나 유저 정보가 없으면 종료
    if (error || !signupData.user) {
      // 이미 가입된 이메일에 대한 에러만 사용자에게 노출
      if (error?.message === "User already registered") {
        toast.error(
          <>
            이미 존재하는 이메일입니다.
            <br />
            로그인 페이지를 이용해주세요.
          </>,
        );
      }

      console.error("회원가입 실패: ", error?.message);
      return;
    }

    //회원 정보를 user_table에 저장
    const { error: insertError } = await supabase.from("user_table").insert({
      email,
      password,
      random_id: randomId,
      nickname: String(randomId),
    });

    if (insertError) {
      console.error("user_table 저장 실패: ", insertError.message);
      return;
    }

    toast.success(`환영합니다 🎉`);
    navigate("/login");
  };

  return (
    <Background>
      <Wrapper>
        <Logo src={IdolLinkLogo} alt="로고" />

        <Form onSubmit={handleSubmit(handleSignup)}>
          <Title data-testid="signup-title">회원가입</Title>

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
                value.trim() !== "" || "공백을 입력할 수 없습니다.",
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
            placeholder="비밀번호를 입력해주세요 (특수문자 포함 8자리 이상)"
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

          <LoginGuide data-testid="signup-guide">
            계정이 이미 있으신가요?{" "}
            <span data-testid="login-link" onClick={() => navigate("/login")}>
              로그인
            </span>
          </LoginGuide>
        </Form>
      </Wrapper>
    </Background>
  );
};

export default Signup;

const Background = styled.div`
  width: 100%;
  height: 100vh;
  background-color: var(--button-gray);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 100vh;
  background-color: var(--background-color);
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
  font-size: var(--font-size-subtitle);
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
