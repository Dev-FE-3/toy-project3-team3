import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import Button from "@/shared/component/Button";

type ModalType = "alert" | "confirm";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: React.ReactNode;
  leftButtonText?: string;
  rightButtonText: string;
  type?: ModalType;
}

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  leftButtonText,
  rightButtonText,
  type = "confirm",
}: ModalProps) => {
  if (!isOpen) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const handleConfirm = () => {
    onClose();
    onConfirm();
  };

  return ReactDOM.createPortal(
    <Backdrop>
      <Container>
        <Message>{message}</Message>
        <ButtonGroup>
          {type === "confirm" && leftButtonText && (
            <Button
              className="left-button"
              size="small"
              btnColor="white"
              onClick={onClose}
            >
              {leftButtonText}
            </Button>
          )}
          <Button
            className="right-button"
            size="small"
            btnColor="pink"
            onClick={handleConfirm}
            data-testid="modal-confirm-button"
          >
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
  z-index: 999;
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
  font-size: var(--font-size-large);
  color: var(--text-primary);
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
