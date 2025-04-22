import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import VideoItem from "@/pages/playlist/component/VideoItem";
import { toast } from "react-toastify";
import { useYoutubeInfo } from "@/pages/playlist/hooks/useYoutubeInfo";
import { useThumbnail } from "@/pages/playlist/hooks/useThumbnailUpload";
import { getPlaylistWithVideos } from "@/db/playlistWithvideos";
import { Video } from "@/types/video";
import { useUpdatePlaylist } from "@/pages/playlist/hooks/useUpdatePlaylist";
import ErrorFallback from "@/shared/component/ErrorFallback";

const Modify = () => {
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const { lock, unlock } = useLockStore();
  const {
    thumbnailPreview,
    handleThumbnailChange,
    setThumbnailPreview,
    uploadPlaylistThumbnail,
    uploadVideoThumbnail,
  } = useThumbnail();

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [videoUrl, setVideoUrl] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [originalVideos, setOriginalVideos] = useState<Video[]>([]);
  const [title, setTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"exit" | "delete" | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { refetch, isFetching } = useYoutubeInfo(videoUrl);
  const queryClient = useQueryClient();

  useEffect(() => {
    lock();
  }, [lock, navigate]);

  // 1. React Query
  const {
    data: playlistData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["playlistDetail", playlistId] as const,
    queryFn: async () => {
      const data = await getPlaylistWithVideos(Number(playlistId));
      // if (!data)
      //   throw new Error("플레이리스트가 존재하지 않거나 삭제되었습니다.");
      return data;
    },
    enabled: !!playlistId,
  });

  // 2. 상태 초기화 useEffect
  useEffect(() => {
    if (!playlistData) return;

    const formattedVideos = playlistData.videos.map((v: Video) => ({
      v_id: v.v_id,
      title: v.title,
      playlist_id: v.playlist_id,
      channel_name: v.channel_name,
      thumbnail_url: v.thumbnail_url,
      created_at: v.created_at,
      video_id: v.video_id,
      thumbnailFile: undefined,
    }));

    setTitle(playlistData.playlist_title);
    setVideos(formattedVideos);
    setOriginalVideos(formattedVideos);
    setThumbnailPreview(playlistData.cover_img_path);
  }, [playlistData]);

  const handleAddVideo = async () => {
    const { data: video } = await refetch(); //추가할 유튜브 영상 정보 받아오기기
    if (!video) return;

    setVideos((prev) => [
      ...prev,
      {
        v_id: Date.now() + Math.random(), // ❗ 임시 고유값으로 대체 (아직 DB에 들어가있지 않지만, react에서 구분하기 위해서 사용)
        video_id: video.videoId,
        title: video.title,
        channel_name: video.source,
        thumbnail_url: video.thumbnail,
        created_at: new Date().toISOString(),
        playlist_id: Number(playlistId),
        thumbnailFile: video.thumbnailFile,
      },
    ]);
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
      navigate(-1);
    } else if (modalType === "delete" && selectedIndex !== null) {
      handleDelete(selectedIndex);
    }
    setIsModalOpen(false);
    setModalType(null);
    setSelectedIndex(null);
  };

  const updateMutation = useUpdatePlaylist({
    playlistId: Number(playlistId),
    playlistTitle: title.trim(),
    originalVideos,
    updatedVideos: videos,
    uploadPlaylistThumbnail,
    uploadVideoThumbnail,
    thumbnailPreview: thumbnailPreview ?? "",
    onSuccess: () => {
      toast.success("업데이트 성공! 멋진 변화를 주셨네요 ✨");

      //수정 성공 후 캐시 무효화 → 다시 데이터를 가져옴
      queryClient.invalidateQueries({
        queryKey: ["playlistDetail", playlistId],
      });

      unlock();
      navigate("/storage");
    },
    onError: (error) => {
      console.error("업데이트 실패:", error);
      setErrorMessage("업데이트에 실패했습니다. 다시 시도해주세요 😢");
      setErrorModalOpen(true);
    },
  });

  if (isLoading) return <Loading />;

  if (isError || !playlistData) {
    return (
      <ErrorFallback message="존재하지 않거나 삭제된 플레이리스트입니다." />
    );
  }

  return (
    <Wrapper>
      <Title
        title="플레이리스트 수정"
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
                key={video.v_id}
                thumbnail={video.thumbnail_url}
                title={video.title}
                source={video.channel_name}
                onDelete={() => handleDeleteRequest(index)}
              />
            ))}
          </ScrollableList>
        </VideoListWrapper>
        <ButtonWrapper>
          <Button
            size="big"
            color="pink"
            onClick={() => updateMutation.mutate()}
          >
            수정하기
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

      <Modal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        onConfirm={() => setErrorModalOpen(false)}
        message={errorMessage}
        rightButtonText="확인"
        type="alert"
      />
    </Wrapper>
  );
};

export default Modify;

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
  font-size: var(--font-size-subtitle);
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
  margin: 15px 0;
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
