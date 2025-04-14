import { ReactSVG } from "react-svg";
import styled from "@emotion/styled";

interface IconProps {
  src: string;
  alt?: string;
  size?: "small" | "large";
  colorType?: "white" | "black"; // var(--background-color) | var(--text-secondary)
  rotate?: number;
  onClick?: () => void;
}

const sizeMap = {
  small: { width: 10, height: 20 },
  large: { width: 28, height: 28 },
};

const Wrapper = styled.span<{
  size: "small" | "large";
  rotate: number;
  colorType: "white" | "black";
}>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: ${({ size }) => sizeMap[size].width}px;
  height: ${({ size }) => sizeMap[size].height}px;
  transform: rotate(${({ rotate }) => rotate}deg);
  color: ${({ colorType }) =>
    colorType === "white"
      ? "var(--background-color)"
      : "var(--text-secondary)"};
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;
    display: block; // 이걸 안 하면 아이콘 모음에서 세로로 정렬이 안 맞음
  }

  path {
    fill: currentColor;
  }
`;

const Icon = ({
  src,
  alt = "",
  size = "small",
  colorType = "black",
  rotate = 0,
  onClick,
}: IconProps) => (
  <Wrapper size={size} rotate={rotate} colorType={colorType} onClick={onClick}>
    <ReactSVG
      src={src}
      beforeInjection={(svg) => {
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", alt);
        svg.setAttribute("fill", "currentColor");
        svg.removeAttribute("width");
        svg.removeAttribute("height");
      }}
    />
  </Wrapper>
);

export default Icon;
