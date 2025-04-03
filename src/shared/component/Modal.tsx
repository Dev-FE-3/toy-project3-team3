import ReactDOM from "react-dom";
import React from "react";
import styled from "@emotion/styled";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  leftButtonText: string;
  rightButtonText: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  leftButtonText,
  rightButtonText,
}) => {
  if (!isOpen) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const handleConfirm = () => {
    onClose(); //모달 먼저 닫고
    onConfirm(); //사용자 정의 동작 실행 (페이지 이동 or 요소 삭제)
  };

  return ReactDOM.createPortal(
    <Backdrop>
      <Container>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button variant="left" onClick={onClose}>
            {leftButtonText}
          </Button>
          <Button variant="right" onClick={handleConfirm}>
            {rightButtonText}
          </Button>
        </ButtonGroup>
      </Container>
    </Backdrop>,
    document.getElementById("modal-root") as HTMLElement,
  );
};

export default Modal;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const Container = styled.div`
  width: 400px;
  height: 142px;
  background-color: white;
  padding: 14px 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Message = styled.p`
  font-size: 18px;
  color: #000;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const Button = styled.button<{ variant: "left" | "right" }>`
  flex: 1;
  padding: 12px 0;
  border-radius: 19px;
  border: 1px solid #f6a8a8;
  background-color: ${({ variant }) =>
    variant === "right" ? "#f2b4b4" : "#fff"};
  color: ${({ variant }) => (variant === "right" ? "#fff" : "#F6A8A8")};
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`;
