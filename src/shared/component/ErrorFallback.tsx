import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

interface ErrorFallbackProps {
  message?: string;
}

const ErrorFallback = ({
  message = "문제가 발생했습니다.",
}: ErrorFallbackProps) => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Message>{message}</Message>
      <BackLink onClick={() => navigate(-1)}>뒤로 가기</BackLink>
    </Wrapper>
  );
};

export default ErrorFallback;

const Wrapper = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Message = styled.div`
  font-size: var(--font-size-large);
  color: var(--text-secondary);
  margin-bottom: 20px;
`;

const BackLink = styled.span`
  font-size: var(--font-size-small);
  color: var(--primary);
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
`;
