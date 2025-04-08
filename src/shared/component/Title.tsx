import styled from "@emotion/styled";
import GoBack from "@/assets/images/GoBack.svg";
import { useNavigate } from "react-router-dom";

type TitleProps = {
  title?: string;
  showBackButton?: boolean;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
};

const Title = ({
  title,
  showBackButton,
  leftContent,
  rightContent,
}: TitleProps) => {
  const navigate = useNavigate();

  const defaultLeft = (
    <>
      {showBackButton && (
        <BackIcon src={GoBack} alt="뒤로가기" onClick={() => navigate(-1)} />
      )}
      {title && <StyledTitle>{title}</StyledTitle>}
    </>
  );

  return (
    <TitleWrapper>
      <Left>{leftContent ?? defaultLeft}</Left>
      <Right>{rightContent}</Right>
    </TitleWrapper>
  );
};

export default Title;

const TitleWrapper = styled.div`
  width: 100%;
  height: 60px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const BackIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

export const StyledTitle = styled.h1`
  font-size: var(--font-size-title);
  font-weight: 400;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;
