import { useState } from "react";
import Modal from "@/shared/component/Modal";
import cancel from "@/assets/images/cancel.svg";
import Button from "@/shared/component/Button";
import CommonInput from "@/shared/component/input";
import Dropbox from "@/shared/component/Dropbox";
import Title from "@/shared/component/Title";
import { StyledTitle } from "@/shared/component/Title";
import { useNavigate } from "react-router-dom";
import Like from "@/assets/images/Like.svg";

const Guide = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    setIsModalOpen(false);
  };

  const handleSelect = (item: string) => {
    console.log("선택한 옵션:", item);
  };

  const navigate = useNavigate();
  return (
    <>
      <Title showBackButton title="공지사항" />
      <Title title="제목만" />
      <Title showBackButton />
      /* 지금부터 완전 커스텀 */
      <Title
        leftContent={
          <>
            <StyledTitle>탐색</StyledTitle>
            <CommonInput
              placeholder="영상 제목을 검색해주세요."
              width="200px"
            />
          </> /* StyledTitle을 따로 import 할 수 있게 빼뒀어요! */
        }
      />
      <Title
        showBackButton
        title="공지사항"
        rightContent={
          <img
            src={cancel}
            alt="닫기"
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          />
        }
      />
      <Title
        showBackButton
        title="커스텀 2"
        rightContent={
          <>
            <img src={Like} alt="좋아요" style={{ cursor: "pointer" }} />
            <img
              src={cancel}
              alt="닫기"
              onClick={() => navigate(-1)}
              style={{ cursor: "pointer" }}
            />
          </>
        }
      />
      <div>
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
          id="playlistTitle"
          label="플레이리스트 제목"
          placeholder="제목을 입력해주세요"
          width="488px"
        />

        <CommonInput
          id="videoUrl"
          label="동영상 추가"
          placeholder="링크를 입력해주세요"
          width="468px"
        />

        <CommonInput
          id="userName"
          placeholder="이름을 입력해주세요"
          width="468px"
        />

        <CommonInput
          id="search"
          placeholder="검색어를 입력해주세요"
          width="318px"
        />

        <CommonInput
          id="nickname"
          label="닉네임"
          labelPosition="left"
          placeholder="닉네임을 입력해주세요"
          width="218px"
        />

        <CommonInput
          id="artist"
          label="관심 아티스트"
          labelPosition="left"
          isTextarea
          placeholder="관심 아티스트를 입력해주세요"
          width="250px"
        />
      </div>
      <h1>드롭다운</h1>
      <Dropbox variant="icon" onSelect={handleSelect} />
      <Dropbox variant="text" onSelect={handleSelect} />
    </>
  );
};

export default Guide;
