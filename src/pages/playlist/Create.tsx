import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
import styled from "@emotion/styled";
import useLockStore from "@/stores/lockStore";
import Title from "@/shared/component/Title";
import CommonInput from "@/shared/component/input";
import Button from "@/shared/component/Button";
import cancel from "@/assets/images/cancel.svg";
import add from "@/assets/images/add.svg";
import Modal from "@/shared/component/Modal";
import Loading from "@/shared/component/Loading";
import VideoItem from "./component/VideoItem";
import { toast } from "react-toastify";
import { useYoutubeInfo } from "./hooks/useYoutubeInfo";
import { useThumbnail } from "./hooks/useThumbnailUpload";
import { useUserStore } from "@/stores/userStore";
import { convertImageToFile } from "@/pages/playlist/utils/convertToFile";
import { useUploadPlaylist } from "@/pages/playlist/hooks/useUploadPlaylist";

const Create = () => {
  const navigate = useNavigate();
  const { lock, unlock } = useLockStore();
  const {
    thumbnailPreview,
    handleThumbnailChange,
    uploadPlaylistThumbnail,
    uploadVideoThumbnail,
  } = useThumbnail();

  const user = useUserStore((s) => s.user); //store에서 사용자 정보 가져오기
  const [videoUrl, setVideoUrl] = useState("");
  const [videos, setVideos] = useState<
    {
      videoId: string;
      title: string;
      source: string;
      thumbnail?: string; //유튜브 썸네일 url
      thumbnailFile?: File; //blob 이미지 (스토리지에 업로드할 파일)
    }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"exit" | "delete" | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { refetch, isFetching } = useYoutubeInfo(videoUrl);

  useEffect(() => {
    lock();
  }, [lock, navigate]);

  const handleAddVideo = async () => {
    const { data: video } = await refetch();
    if (!video) return;

    try {
      const file = await convertImageToFile(video.thumbnail!, video.title);
      video.thumbnailFile = file;
    } catch (e) {
      console.error("썸네일 업로드 실패:", e);
    }
    setVideos((prev) => [...prev, video]);
    setVideoUrl("");
  };

  const handleDelete = (index: number) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);
  };

  const handleDeleteRequest = (index: number) => {
    setSelectedIndex(index);
    setModalType("delete");
    setIsModalOpen(true);
  };

  const handleModalClose = () => setIsModalOpen(false);

  const handleModalConfirm = () => {
    if (modalType === "exit") {
      unlock();
      navigate("/");
    } else if (modalType === "delete" && selectedIndex !== null) {
      handleDelete(selectedIndex);
    }
    setIsModalOpen(false);
    setModalType(null);
    setSelectedIndex(null);
  };

  const { mutate: uploadPlaylistMutate } = useUploadPlaylist({
    userId: user!.random_id,
    videos,
    uploadPlaylistThumbnail,
    uploadVideoThumbnail,
    onSuccess: () => {
      toast.success("좋아요! 새로운 플레이리스트가 생성되었어요 🎶");
      unlock();
      navigate("/storage");
    },
  });

  const handleUpload = () => {
    const titleInput = document.getElementById(
      "playlistTitle",
    ) as HTMLInputElement;
    const playlistTitle = titleInput?.value.trim();
    uploadPlaylistMutate({ playlistTitle });
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
          {thumbnailPreview && (
            <ThumbnailImage src={thumbnailPreview} alt="썸네일 미리보기" />
          )}

          <AddThumbnailButton>
            <label htmlFor="thumbnail-upload" style={{ cursor: "pointer" }}>
              <img src={add} alt="추가" />
            </label>
            <input
              id="thumbnail-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleThumbnailChange}
            />
          </AddThumbnailButton>
        </ThumbnailWrapper>
        <TitleInputWrapper>
          <CommonInput
            id="playlistTitle"
            label="플레이리스트 제목"
            placeholder="제목을 입력해주세요"
            width="520px"
          />
        </TitleInputWrapper>

        <VideoInputWrapper>
          <CommonInput
            id="videoUrl"
            label="동영상 추가"
            placeholder="링크를 입력해주세요"
            width="470px"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <AddButton onClick={handleAddVideo}>
            <ReactSVG src={add} wrapper="span" />
          </AddButton>
        </VideoInputWrapper>

        <VideoListWrapper>
          <SectionTitle>추가된 동영상 목록</SectionTitle>
          <ScrollableList>
            {isFetching && <Loading />}
            {videos.map((video, index) => (
              <VideoItem
                key={index}
                thumbnail={video.thumbnail}
                title={video.title}
                source={video.source}
                onDelete={() => handleDeleteRequest(index)}
              />
            ))}
          </ScrollableList>
        </VideoListWrapper>
        <ButtonWrapper>
          <Button size="big" color="pink" onClick={handleUpload}>
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
  border-radius: 10px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  position: relative;
  display: flex;
  align-items: center;
  margin: 25px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  object-fit: cover;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const AddThumbnailButton = styled.button`
  position: absolute;
  z-index: 2;
  background-color: transparent;
  font-size: 24px;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const TitleInputWrapper = styled.div`
  width: 520px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const VideoInputWrapper = styled.div`
  width: 520px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
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
  margin-top: 30px;
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
