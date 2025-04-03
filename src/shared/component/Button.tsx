import styled from "@emotion/styled";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "big" | "mid" | "small";
  btnColor?: "pink" | "white";
  children: ReactNode;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
  size = "mid",
  btnColor = "pink",
  children,
  onClick,
  ...restProps
}) => {
  return (
    <StyledButton
      size={size}
      btnColor={btnColor}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </StyledButton>
  );
};
export default Button;

// size에 따른 스타일 객체
const sizeStyle = {
  big: {
    width: "400px",
    height: "50px",
  },
  mid: {
    width: "350px",
    height: "50px",
  },
  small: {
    width: "200px",
    height: "45px",
  },
};

// color에 따른 스타일 객체
const btnColorStyle = {
  pink: {
    backgroundColor: "--primary",
    color: "--background-color",
    hoverBackground: "--primary-dark",
    disabledBackground: "--primary-light",
    border: "none",
  },
  white: {
    backgroundColor: "--background-color",
    color: "--primary",
    hoverBackground: "--button-gray",
    disabledBackground: "--disabled",
    border: "1px solid var(--primary)",
  },
};

const StyledButton = styled.button<ButtonProps>`
  font-size: var(--font-size-large);
  border-radius: 20px;
  text-align: center;
  transition:
    background-color 0.3s,
    border-color 0.3s;
  font-weight: 900px;

  /* size에 따른 width, height 적용 */
  ${({ size = "mid" }) => `
    width: ${sizeStyle[size].width};
    height: ${sizeStyle[size].height};
  `}

  /* btnColor 따라 pink, white 버튼 스타일 적용 */
  ${({ btnColor = "pink" }) => `
    background-color: var(${btnColorStyle[btnColor].backgroundColor});
    color: var(${btnColorStyle[btnColor].color});
    border: ${btnColorStyle[btnColor].border || "none"};

    &:hover {
      background-color: var(${btnColorStyle[btnColor].hoverBackground});
    }

    &:disabled {
      background-color: var(${
        btnColorStyle[btnColor].disabledBackground ||
        btnColorStyle[btnColor].backgroundColor
      });
      cursor: not-allowed;
    }
  `}
`;