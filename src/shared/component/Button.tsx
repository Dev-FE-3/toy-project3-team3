import styled from "@emotion/styled";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "big" | "mid" | "small";
  bColor?: "pink" | "white";
  children: ReactNode;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ size = "mid", bColor = "pink", children, onClick,
  ...restProps }) => {

  return (
    <StyledButton size={size} bColor={bColor} onClick={onClick} {...restProps}>
      {children}
    </StyledButton>
  );
};
export default Button

// size에 따른 스타일 객체
const sizeStyle = {
  big: {
    width: "400px",
    height: "50px",
  },
  mid: {
    width: "350px",
    height: "50px"
  },
  small: {
    width: "200px",
    height: "45px"
  },
};

// color에 따른 스타일 객체
const bColorStyle = {
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
  transition: background-color 0.3s, border-color 0.3s;

  /* size에 따른 width, height 적용 */
  ${({ size = "mid" }) => `
    width: ${sizeStyle[size].width};
    height: ${sizeStyle[size].height};
  `}

  /* bColor에 따라 pink, white 버튼 스타일 적용 */
  ${({ bColor = "pink" }) => `
    background-color: var(${bColorStyle[bColor].backgroundColor});
    color: var(${bColorStyle[bColor].color});
    border: ${bColorStyle[bColor].border || "none"};

    &:hover {
      background-color: var(${bColorStyle[bColor].hoverBackground});
    }

    &:disabled {
      background-color: var(${
        bColorStyle[bColor].disabledBackground || bColorStyle[bColor].backgroundColor
      });
      cursor: not-allowed;
    }
  `}
`;