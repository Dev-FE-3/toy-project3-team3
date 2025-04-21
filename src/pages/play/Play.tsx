import styled from "@emotion/styled";
import Title from "@/shared/component/Title";
import CommonInput from "@/shared/component/input";
import DefaultProfile from "@/assets/images/defaultProfile.svg";
import Like from "@/assets/images/Like.svg";
import Submit from "@/assets/images/Submit.svg";
import GoBack from "@/assets/images/GoBack.svg";
import commentIcon from "@/assets/images/comment.svg";
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
import { ReactSVG } from "react-svg";
import {
  getPlaylistWithVideos,
  PlaylistWithVideos,
} from "@/db/playlistWithvideos";
import { useLikeStatus } from "../playlist/detail/hooks/useLikeStatus";

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
      <VideoWrapper className="playContainer">
        {videoData?.video_id && (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoData.video_id}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        )}
      </VideoWrapper>
      <VideoTitle>{videoData?.title}</VideoTitle>
      <Meta>
        <ProfileWrapper
          onClick={() => {
            if (videoData?.user_random_id) {
              navigate(`/storage/${videoData.user_random_id}`);
            }
          }}
        >
          <ProfileImage
            src={videoData?.user_img || DefaultProfile}
            onError={(e) => (e.currentTarget.src = DefaultProfile)}
          />
          <ProfileName>{videoData?.nickname}</ProfileName>
        </ProfileWrapper>
        <IconGroup>
          <span
            className="like"
            onClick={handleLikeToggle}
            style={{ cursor: "pointer" }}
          >
            <ReactSVG
              src={Like}
              wrapper="span"
              className={`likeSvg ${isLiked ? "active" : "inactive"}`}
            />
            <span>{likeCount}</span>
          </span>
          <span className="comment">
            <img src={commentIcon} alt="댓글" /> {commentCount}
          </span>
        </IconGroup>
      </Meta>
      <CommentWriteWrapper>
        <ProfileImage src={user?.user_img || DefaultProfile} />
        <CommonInput
          id="comment"
          placeholder="댓글을 입력해주세요."
          width="400px"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <SubmitIcon src={Submit} alt="제출" onClick={handleSubmit} />
      </CommentWriteWrapper>
      <ScrollableContent>
        <CommentListWrapper>
          {commentList.map((item) => {
            return (
              <CommentIndividualWrapper key={item.c_id}>
                <ProfileImage
                  src={item.user_img || DefaultProfile}
                  onClick={() => navigate(`/storage/${item.user_random_id}`)}
                />
                <CommentIndividual>
                  <CommentWriter className="nickName">
                    {item.user_nickname}
                  </CommentWriter>
                  <CommentContent className="comment">
                    {item.comment}
                  </CommentContent>
                </CommentIndividual>
              </CommentIndividualWrapper>
            );
          })}
        </CommentListWrapper>
      </ScrollableContent>
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

const VideoWrapper = styled.div`
  width: 480px;
  height: 270px;
  margin: 20px 60px;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
`;

const VideoTitle = styled.div`
  font-size: var(--font-size-large);
  font-weight: 500;
  line-height: 1.2;
  margin: 0 50px;
  height: 45px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  word-break: break-word;
  white-space: normal;
`;

const Meta = styled.div`
  margin: 0 50px;
  padding: 15px 0;
  border-bottom: 1px solid var(--disabled);
  display: flex;
  justify-content: space-between;
`;

const ProfileWrapper = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50px;
  cursor: pointer;
`;

const ProfileName = styled.span`
  font-size: var(--font-size-large);
  font-weight: 400;
`;

const IconGroup = styled.div`
  display: flex;
  gap: 15px; // 아이콘 그룹 간 여백
  align-items: center;

  .like,
  .comment {
    width: 28px;
    height: 28px;
    cursor: pointer;
    color: var(--text-secondary);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-width: 40px;
    white-space: nowrap;
  }

  .likeSvg.active svg {
    color: var(--primary);
    stroke: none;
    fill: var(--primary);
  }

  .likeSvg.inactive svg {
    color: var(--text-secondary);
    stroke: var(--text-secondary);
    fill: none;
  }

  .comment img {
    width: 28px;
    height: 28px;
    display: block;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const CommentWriteWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin: 0 50px;
  padding: 10px 0;
  //border-bottom: 1px solid var(--disabled);
`;

const SubmitIcon = styled.img`
  width: 28px;
  height: 28px;
  cursor: pointer;
  margin-left: auto;
`;

const CommentListWrapper = styled.div`
  height: 300px;
  overflow-y: auto;
`;

const CommentIndividualWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin: 0 50px;
  padding: 10px 0;
`;

const CommentIndividual = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: var(--font-size-large);
  font-weight: 500;
  color: var(--text-primary);
`;

const CommentWriter = styled.span`
  font-size: var(--font-size-large);
  font-weight: 500;
`;

const CommentContent = styled.div`
  font-size: var(--font-size-primary);
  font-weight: 400;
  line-height: normal;
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin-bottom: 200px;
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
