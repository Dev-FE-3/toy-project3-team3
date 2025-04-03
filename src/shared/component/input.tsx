import React from "react";
import styled from "@emotion/styled";

type LabelPosition = "top" | "left";
type InputSize = "xxlarge" | "xlarge" | "large" | "medium" | "small";

interface InputProps {
  label?: string;
  labelPosition?: LabelPosition;
  placeholder?: string;
  size?: InputSize;
  isTextarea?: boolean;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const sizeMap: Record<InputSize, string> = {
  xxlarge: "488px",
  xlarge: "468px",
  large: "438px",
  medium: "318px",
  small: "250px",
};

const CommonInput = ({
  label,
  labelPosition = "top",
  placeholder = "",
  size = "small",
  isTextarea = false,
  value,
  onChange,
}: InputProps) => {
  const width = sizeMap[size];

  return (
    <Wrapper
      labelPosition={labelPosition}
      width={width}
      isTextarea={isTextarea}
    >
      {label && <Label labelPosition={labelPosition}>{label}</Label>}
      {isTextarea ? (
        <TextArea placeholder={placeholder} value={value} onChange={onChange} />
      ) : (
        <Input
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          labelPosition={labelPosition}
        />
      )}
    </Wrapper>
  );
};

export default CommonInput;

interface WrapperProps {
  labelPosition: LabelPosition;
  width: string;
  isTextarea: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: ${({ labelPosition }) =>
    labelPosition === "top" ? "column" : "row"};
  align-items: ${({ labelPosition, isTextarea }) =>
    labelPosition === "top"
      ? "flex-start"
      : isTextarea
        ? "flex-start"
        : "center"};
  gap: ${({ labelPosition }) => (labelPosition === "left" ? "50px" : "12px")};
  width: ${({ labelPosition, width }) =>
    labelPosition === "left" ? "auto" : width};
`;

const Label = styled.label<{ labelPosition: LabelPosition }>`
  font-weight: bold;
  font-size: var(--font-size-large);
  color: var(--text-primary);
  min-width: ${({ labelPosition }) =>
    labelPosition === "left" ? "110px" : "auto"};
  text-align: ${({ labelPosition }) =>
    labelPosition === "left" ? "right" : "initial"};
`;

const Input = styled.input<{ labelPosition: LabelPosition }>`
  height: 38px;
  width: ${({ labelPosition }) =>
    labelPosition === "left" ? "218px" : "100%"};
  border: 1px solid var(--disabled);
  border-radius: 20px;
  background-color: var(--background-color);
  padding: 0 15px;
  font-size: var(--font-size-primary);
  color: var(--text-primary);

  &:focus {
    border: 2px solid var(--primary);
  }

  &::placeholder {
    color: var(--disabled);
    font-size: var(--font-size-primary);
  }
`;

const TextArea = styled.textarea`
  height: 58px;
  width: 228px;
  border: 1px solid var(--disabled);
  border-radius: 20px;
  background-color: var(--background-color);
  padding: 10px 10px;
  font-size: var(--font-size-primary);
  color: var(--text-primary);
  resize: none;

  &:focus {
    border: 2px solid var(--primary);
  }

  &::placeholder {
    color: var(--disabled);
    font-size: var(--font-size-primary);
  }
`;
