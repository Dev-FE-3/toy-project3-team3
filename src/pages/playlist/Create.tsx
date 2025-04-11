import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import Title from "@/shared/component/Title";
import CommonInput from "@/shared/component/input";
import Button from "@/shared/component/Button";
import cancel from "@/assets/images/cancel.svg";
import add from "@/assets/images/add.svg";
import Modal from "@/shared/component/Modal";
import VideoItem from "./component/VideoItem";
import { ReactSVG } from "react-svg";

const Create = () => {
  const [videos, setVideos] = useState([
    {
      title:
        "카리나 직캠인데, 에스파 직캠인데, 누구 직캠이지? 모르겠는데, 윈터 직캠인가 길게 길게 길게해요",
      source: "SM공식 계정은 아니야",
    },
    { title: "도파민", source: "멜론" },
    { title: "고양이 직캠", source: "지니" },
    { title: "강아지 직캠", source: "유튜브 뮤직" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"exit" | "delete" | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleModalClose = () => setIsModalOpen(false);
  const handleModalConfirm = () => {
    if (modalType === "exit") {
      navigate("/");
    } else if (modalType === "delete" && selectedIndex !== null) {
      handleDelete(selectedIndex);
    }
    setIsModalOpen(false);
    setModalType(null);
    setSelectedIndex(null);
  };

  const handleDelete = (index: number) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);
  };

  const handleVideoDeleteRequest = (index: number) => {
    setSelectedIndex(index);
    setModalType("delete");
    setIsModalOpen(true);
  };

  return (
    <Wrapper>
      <Title
        title="플레이리스트 생성"
        rightContent={
          <img
            src={cancel}
            alt="닫기"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setModalType("exit");
              setIsModalOpen(true);
            }}
          />
        }
      />

      <Container>
        <ThumbnailWrapper>
          <AddThumbnailButton>
            <img src={add} alt="추가" style={{ cursor: "pointer" }} />
          </AddThumbnailButton>
        </ThumbnailWrapper>

        <TitleInputWrapper>
          <CommonInput
            id="playlistTitle"
            label="플레이리스트 제목"
            placeholder="제목을 입력해주세요"
            width="478px"
          />
        </TitleInputWrapper>

        <VideoInputWrapper>
          <CommonInput
            id="videoUrl"
            label="동영상 추가"
            placeholder="링크를 입력해주세요"
            width="438px"
          />
          <AddButton>
            <ReactSVG src={add} wrapper="span" />
          </AddButton>
        </VideoInputWrapper>

        <VideoListWrapper>
          <SectionTitle>추가된 동영상 목록</SectionTitle>
          <ScrollableList>
            {videos.map((video, index) => (
              <VideoItem
                key={index}
                title={video.title}
                source={video.source}
                onDelete={() => handleVideoDeleteRequest(index)}
              />
            ))}
          </ScrollableList>
        </VideoListWrapper>
        <ButtonWrapper>
          {/*버튼 클릭 이벤트는 로직 구현하면서 변경 예정*/}
          <Button
            size="big"
            color="pink"
            onClick={() => console.log("큰 버튼 클릭됨")}
          >
            업로드 하기
          </Button>
        </ButtonWrapper>
      </Container>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        message={
          modalType === "exit" ? (
            <>
              작성 중인 내용이 저장되지 않습니다.
              <br />
              정말 나가시겠습니까?
            </>
          ) : modalType === "delete" ? (
            "정말 삭제하시겠습니까?"
          ) : (
            ""
          )
        }
        leftButtonText="취소"
        rightButtonText={modalType === "exit" ? "나가기" : "삭제"}
      />
    </Wrapper>
  );
};

export default Create;
const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  padding: 0 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 50px;
`;

const ThumbnailWrapper = styled.div`
  width: 400px;
  height: 225px;
  background-color: var(--background-color);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px 0;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2); //
`;

const AddThumbnailButton = styled.button`
  background-color: transparent;
  font-size: 24px;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const TitleInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600px;
  padding-right: 35px;
`;

const VideoInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin: 25px 0;
`;

const AddButton = styled.button`
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 28px;
  color: var(--text-secondary);
`;

const VideoListWrapper = styled.div`
  width: 520px;
  justify-content: center;
`;

const SectionTitle = styled.p`
  font-size: var(--font-size-large);
  font-weight: bold;
  color: var(--text-primary);
`;

const ScrollableList = styled.div`
  height: 180px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 12px;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 15px 0;
  margin-bottom: 80px;
`;
