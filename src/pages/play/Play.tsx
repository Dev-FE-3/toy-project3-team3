import styled from "@emotion/styled";
import Title from "@/shared/component/Title";
import GoBack from "@/assets/images/GoBack.svg";
import List from "@/assets/images/List.svg";
import Icon from "@/shared/component/Icon";
import { useState } from "react";
import {
  CommentWithUserInfo,
  createComment,
  getCommentWithUserInfo,
} from "@/db/comment";
import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "@/stores/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSingleVideoFromPlaylist } from "@/db/playlistFullView";
import {
  getPlaylistWithVideos,
  PlaylistWithVideos,
} from "@/db/playlistWithvideos";
import VideoMetaSection from "./component/VideoMetaSection";
import CommentSection from "./component/CommentSection";
import { useLikeStatus } from "../detail/hooks/useLikeStatus";

const Play = () => {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");
  const userId = useUserStore((state) => state.user?.random_id);
  const { p_id, video_id } = useParams<{ p_id: string; video_id: string }>();
  const playlistId = Number(p_id);
  const videoId = video_id ?? "";
  const user = useUserStore((state) => state.user);
  const {
    isLiked,
    isLoading: isLikeLoading,
    likeCount,
    commentCount,
    handleLikeToggle,
  } = useLikeStatus(userId, playlistId);
  const navigate = useNavigate();

  // ✅ 비디오 정보 가져오기
  const { data: videoData, isLoading: isPlaylistLoading } = useQuery({
    queryKey: ["singleVideo", playlistId, videoId],
    queryFn: () => getSingleVideoFromPlaylist(playlistId, videoId),
    enabled: !!playlistId && !!videoId,
  });

  // ✅ 댓글 목록 가져오기
  const { data: commentList = [] } = useQuery<CommentWithUserInfo[]>({
    queryKey: ["comments", playlistId],
    queryFn: () => getCommentWithUserInfo(playlistId),
    enabled: !!playlistId,
  });

  // ✅ 댓글 작성
  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", playlistId] }); // 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["commentCount", playlistId] }); // 댓글 수 갱신
      setCommentText(""); // 입력창 초기화
    },
    onError: (error) => {
      console.error("댓글 작성 실패", error);
      alert("댓글 등록 중 오류가 발생했습니다.");
    },
  });

  // ✅ 댓글 제출
  const handleSubmit = () => {
    if (!commentText.trim()) return alert("댓글을 입력해주세요.");
    if (!userId || !playlistId) return alert("로그인 정보 없음");

    mutation.mutate({
      playlist_id: playlistId,
      random_id: userId,
      comment: commentText,
    });
  };

  // ✅ 영상 리모트
  const { data: videoListData } = useQuery<PlaylistWithVideos | null>({
    queryKey: ["playlistWithVideos", playlistId],
    queryFn: () => getPlaylistWithVideos(playlistId),
    enabled: !!playlistId,
  });

  const videoList = videoListData?.videos ?? [];
  const currentIndex = videoList.findIndex((v) => v.video_id === videoId);
  const prevVideo = videoList[currentIndex - 1];
  const nextVideo = videoList[currentIndex + 1];
  const totalCount = videoList.length;

  // ✅ 조건 분기 처리
  if (isPlaylistLoading || isLikeLoading) {
    return <p>플레이리스트 정보를 불러오는 중...</p>;
  }

  return (
    <Wrapper>
      <Title
        showBackButton
        title={videoData?.playlist_title}
        // onBackClick={() => navigate(`/playlist/${playlistId}`)} //
      />
      <VideoMetaSection
        videoId={videoData?.video_id ?? ""}
        title={videoData?.title ?? ""}
        userImg={videoData?.user_img ?? ""}
        nickname={videoData?.nickname ?? ""}
        isLiked={isLiked}
        likeCount={likeCount}
        commentCount={commentCount}
        onProfileClick={() => {
          if (videoData?.user_random_id) {
            navigate(`/storage/${videoData.user_random_id}`);
          }
        }}
        onLikeToggle={handleLikeToggle}
      />
      <CommentSection
        userImg={user?.user_img ?? ""}
        commentText={commentText}
        onChangeCommentText={setCommentText}
        onSubmit={handleSubmit}
        commentList={commentList}
        onUserClick={(userRandomId) => navigate(`/storage/${userRandomId}`)}
      />
      <PlayListInfoWrapper>
        <PlayListInfo>
          {videoData?.playlist_title} [{currentIndex + 1}/{totalCount}]
        </PlayListInfo>

        <PlayListIconGroup>
          <Icon
            src={GoBack}
            size="small"
            colorType="white"
            alt="이전"
            onClick={() => {
              if (prevVideo) {
                navigate(`/play/${p_id}/${prevVideo.video_id}`);
              }
            }}
          />
          <img
            src={List}
            alt="목록"
            style={{ width: 24, height: 24, cursor: "pointer" }}
            onClick={() => navigate(`/playlist/${p_id}`)}
          />
          <Icon
            src={GoBack}
            size="small"
            colorType="white"
            alt="다음"
            rotate={180}
            onClick={() => {
              if (nextVideo) {
                navigate(`/play/${p_id}/${nextVideo.video_id}`);
              }
            }}
          />
        </PlayListIconGroup>
      </PlayListInfoWrapper>
    </Wrapper>
  );
};

export default Play;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const PlayListInfoWrapper = styled.div`
  position: fixed;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;

  width: 500px;
  height: 50px;
  border-radius: 20px;
  margin: 20px auto;
  background-color: var(--primary);
  color: var(--background-color);
  font-size: var(--font-size-large);
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlayListInfo = styled.div`
  margin-left: 20px;
`;

const PlayListIconGroup = styled.div`
  margin-right: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
`;
