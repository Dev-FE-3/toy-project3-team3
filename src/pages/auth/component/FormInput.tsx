import { InputHTMLAttributes, forwardRef } from "react";
import styled from "@emotion/styled";

/**HTML <input> 요소에 들어가는  기본 props를 모두 상속*/
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, ...inputProps }, ref) => {
    return (
      <InputWrapper>
        <InputLabel htmlFor={inputProps.id}>{label}</InputLabel>
        <InputField ref={ref} {...inputProps} hasError={!!error} />
        {error && <ErrorText>{error}</ErrorText>}
      </InputWrapper>
    );
  },
);

export default FormInput;

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

const InputField = styled.input<{ hasError?: boolean }>`
  width: 374px;
  height: 48px;
  border: 1px solid
    ${({ hasError }) => (hasError ? "var(--error, red)" : "var(--disabled)")};
  border-radius: 20px;
  padding: 0 12px;
  margin-bottom: 37px;
  font-size: var(--font-size-primary);

  &::placeholder {
    color: var(--disabled);
  }

  &:focus {
    outline: none;
    border-color: ${({ hasError }) =>
      hasError ? "var(--error, red)" : "var(--primary)"};
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
