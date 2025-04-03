import React from "react";
import styled from "@emotion/styled";

type LabelPosition = "top" | "left";

interface InputProps {
  label?: string;
  labelPosition?: LabelPosition;
  placeholder?: string;
  width?: string;
  isTextarea?: boolean;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const CommonInput = ({
  label,
  labelPosition = "top",
  placeholder = "",
  width = "250px",
  isTextarea = false,
  value,
  onChange,
}: InputProps) => {
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
          width={width}
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

const Input = styled.input<{ labelPosition: LabelPosition; width: string }>`
  height: 38px;
  width: ${({ labelPosition, width }) =>
    labelPosition === "left" ? width : "100%"};
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

const TextArea = styled.textarea<{ width?: string }>`
  height: 58px;
  width: ${({ width }) => width ?? "228px"};
  border: 1px solid var(--disabled);
  border-radius: 20px;
  background-color: var(--background-color);
  padding: 10px;
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
