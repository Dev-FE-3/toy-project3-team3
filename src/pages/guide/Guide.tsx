import { useState } from "react";
import Modal from "@/shared/component/Modal";
import cancel from "@/assets/images/cancel.svg";
import Button from "@/shared/component/Button";
import CommonInput from "@/shared/component/input";

const Guide = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div>
        <br />
        <h1>가이드 페이지</h1>
        <br />
        <Button
          size="big"
          color="pink"
          onClick={() => console.log("큰 버튼 클릭됨")}
        >
          큰 버튼
        </Button>
        <br />
        <Button
          size="mid"
          btnColor="pink"
          onClick={() => console.log("중간 버튼 클릭됨")}
        >
          중간 버튼
        </Button>
        <br />
        <Button
          size="small"
          btnColor="pink"
          onClick={() => console.log("작은 버튼 클릭됨")}
        >
          핑크 작은 버튼
        </Button>
        <Button
          size="small"
          btnColor="white"
          onClick={() => console.log("작은 버튼 클릭됨")}
        >
          화이트 작은 버튼
        </Button>
      </div>
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
        <CommonInput
          label="플레이리스트 제목"
          size="xxlarge"
          placeholder="제목을 입력해주세요"
        />

        <CommonInput
          label="동영상 추가"
          size="large"
          placeholder="링크를 입력해주세요"
        />

        <CommonInput size="medium" placeholder="검색어를 입력해주세요" />

        <CommonInput size="xlarge" placeholder="이름을 입력해주세요" />

        <CommonInput
          label="닉네임"
          labelPosition="left"
          size="small"
          placeholder="닉네임을 입력해주세요"
        />

        <CommonInput
          label="관심 아티스트"
          labelPosition="left"
          size="small"
          isTextarea
          placeholder="좋아하는 아티스트를 입력해주세요"
        />
      </div>
    </>
  );
};

export default Guide;
