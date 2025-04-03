import { useState } from "react";
import Modal from "@/shared/component/Modal";
import cancel from "@/assets/images/cancel.svg";

const ModalTest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
        aria-label="삭제 아이콘"
      >
        <img src={cancel} alt="삭제" width={24} height={24} />
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        message="해당 영상을 정말 삭제하시겠습니까?"
        leftButtonText="취소"
        rightButtonText="삭제하기"
      />
    </div>
  );
};

export default ModalTest;
