import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

type LabelPosition = "top" | "left";

interface InputProps {
  id?: string;
  label?: string;
  labelPosition?: LabelPosition;
  placeholder?: string;
  width?: string;
  isTextarea?: boolean;
  value?: string;
  isReadOnly?: boolean;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const CommonInput = ({
  id,
  label,
  labelPosition = "top",
  placeholder = "",
  width = "250px",
  isTextarea = false,
  value,
  isReadOnly,
  onChange,
}: InputProps) => {
  return (
    <Wrapper
      labelPosition={labelPosition}
      width={width}
      isTextarea={isTextarea}
    >
      {label && (
        <Label
          htmlFor={id}
          labelPosition={labelPosition}
          isTextarea={isTextarea}
        >
          {label}
        </Label>
      )}
      {isTextarea ? (
        <TextArea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          readOnly={isReadOnly}
          className={isReadOnly ? "read-only" : ""}
        />
      ) : (
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          labelPosition={labelPosition}
          width={width}
          readOnly={isReadOnly}
          className={isReadOnly ? "read-only" : ""}
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

const Label = styled.label<{
  labelPosition: LabelPosition;
  isTextarea: boolean;
}>`
  font-weight: bold;
  font-size: var(--font-size-large);
  color: var(--text-primary);
  min-width: ${({ labelPosition }) =>
    labelPosition === "left" ? "110px" : "auto"};
  text-align: ${({ labelPosition }) =>
    labelPosition === "left" ? "right" : "initial"};

  ${({ labelPosition, isTextarea }) =>
    labelPosition === "left" &&
    isTextarea &&
    css`
      margin-top: 10px;
    `}
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
    border: 1px solid var(--primary);
  }

  &::placeholder {
    color: var(--disabled);
    font-size: var(--font-size-primary);
  }

  &.read-only {
    border: 1px solid transparent; // ← 투명 테두리!
    background-color: transparent;
    cursor: default;
  }

  &.read-only:focus {
    outline: none;
    border: 1px solid transparent;
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
    border: 1px solid var(--primary);
  }

  &::placeholder {
    color: var(--disabled);
    font-size: var(--font-size-primary);
  }

  &.read-only {
    border: 1px solid transparent; // ← 투명 테두리!
    background-color: transparent;
    cursor: default;
  }

  &.read-only:focus {
    outline: none;
    border: 1px solid transparent;
  }
`;
