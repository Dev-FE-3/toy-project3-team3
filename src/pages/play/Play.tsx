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
} from "@/api/comment";
import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "@/stores/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSingleVideoFromPlaylist } from "@/api/playlistFullView";
import { usePlaylistMeta } from "@/shared/hooks/usePlaylistMeta";
import { ReactSVG } from "react-svg";
import {
  getPlaylistWithVideos,
  PlaylistWithVideos,
} from "@/api/playlistWithvideos";

const Play = () => {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");
  const userId = useUserStore((state) => state.user?.random_id);
  const { p_id, video_id } = useParams<{ p_id: string; video_id: string }>();
  const playlistId = Number(p_id);
  const videoId = video_id ?? ""; // ❗ undefined인 경우 빈 문자열로 대체
  const user = useUserStore((state) => state.user);
  const { isLiked, likeCount, commentCount } = usePlaylistMeta(playlistId);
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
  if (isPlaylistLoading) {
    return <p>플레이리스트 정보를 불러오는 중...</p>;
  }

  return (
    <>
      <Title showBackButton title={videoData?.playlist_title} />
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
        <ProfileWrapper>
          <ProfileImage
            src={user?.user_img || DefaultProfile}
            onError={(e) => (e.currentTarget.src = DefaultProfile)}
          />
          <ProfileName>{videoData?.nickname}</ProfileName>
        </ProfileWrapper>
        <IconGroup>
          <span className="like">
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
          width="320px"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />

        <SubmitIcon src={Submit} alt="제출" onClick={handleSubmit} />
      </CommentWriteWrapper>
      <CommentListWrapper>
        {commentList.map((item) => {
          return (
            <CommentIndividualWrapper key={item.c_id}>
              <ProfileImage src={item.user_img || DefaultProfile} />
              <CommentIndividual>
                <CommentWriter>{item.nickname}</CommentWriter>
                <CommentContent>{item.comment}</CommentContent>
              </CommentIndividual>
            </CommentIndividualWrapper>
          );
        })}
      </CommentListWrapper>

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
    </>
  );
};

export default Play;

// 비디오 담는 박스
const VideoWrapper = styled.div`
  width: 480px;
  height: 270px;
  margin: 20px 60px;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2); // 디자인 상 들어가긴 했는데, 이미지 넣어보시고 없는게 낫다면 빼도 괜찮을 듯!
`;

// 비디오 제목
const VideoTitle = styled.span`
  font-size: var(--font-size-subtitle);
  font-weight: 500;
  margin: 0 50px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  word-break: break-word;
  white-space: normal;
`;

// 하단 프로필, 좋아요, 댓글 수 담는 박스 - 내용은 space between!
const Meta = styled.div`
  margin: 0 50px;
  padding: 15px 0;
  border-bottom: 1px solid var(--disabled);
  display: flex;
  justify-content: space-between;
`;

// 이 wrapper는 프로필 이미지 + 제작자 띄우는 상단에만 쓰임 (좌 우 space between 위해 만듦)
const ProfileWrapper = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

// 이 부분은 내 프로필과 댓글 프로필 사이즈가 동일해서 같이 사용하기
const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50px;
`; // 원래 70px였는데, 너무 커서 50px로 줄였어요

// 플리 제작자 이름
const ProfileName = styled.span`
  font-size: var(--font-size-large);
  font-weight: 400;
`;

// 우측 정렬할 아이콘 그룹
const IconGroup = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  .like,
  .comment {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* 활성화된 좋아요 스타일 */
  .likeSvg.active svg {
    color: var(--primary); /* 활성화 시 컬러 */
    stroke: none;
    fill: var(--primary); /* 내부도 채우기 */
  }

  /* 비활성화된 좋아요 스타일 (명시적 처리) */
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

// const IconGroup = styled.div`
//   display: flex;
//   gap: 10px;
//   color: var(--text-secondary);

//   span {
//     display: flex;
//     align-items: center;
//     gap: 4px;

//     img {
//       width: 28px;
//       height: 28px;
//       filter: grayscale(100%); // 기본 상태: 흐리게
//       transition:
//         filter 0.2s ease,
//         transform 0.2s ease;
//     }

//     img.liked {
//       filter: none; // 좋아요 눌렀을 때는 원래 색상
//       transform: scale(1.1); // 약간 커지게 (선택)
//     }
//   }
// `;


// 내가 쓸 댓글 부분 wrapper
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

// 작성한 댓글을 보여줄 부분 담는 wrapper. 스크롤 설정 해놨지만 높이 사이즈는.. 조절해야 할 지도
const CommentListWrapper = styled.div`
  height: 300px;
  overflow-y: auto;
`;

// 댓글 하나 하나 담는 wrapper
// 여기에서 크게 좌(프로필 이미지) 우(작성자&내용)은 좌 우 flex지만 (하단 이어서)
const CommentIndividualWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin: 0 50px;
  padding: 10px 0;
`;

// 우(작성자&내용)은 column flex 적용해야 해서 한 번 더 감쌌어요
const CommentIndividual = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: var(--font-size-large);
  font-weight: 500;
  color: var(--text-primary);
`;

// 작성자 닉네임
const CommentWriter = styled.span`
  font-size: var(--font-size-large);
  font-weight: 500;
`;

// 작성 내용
const CommentContent = styled.div`
  font-size: var(--font-size-primary);
  font-weight: 400;
  line-height: normal;
`;

// 플레이리스트 정보 담는 분홍 박스
const PlayListInfoWrapper = styled.div`
  // position sticky를 할지 아예 fixed할지 고민하다 우선은 fixed로...
  // 이 부분은 지원님이 고민하셨던 부분이랑 동일한 느낌입니다
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

// 플레이리스트 정보 텍스트
const PlayListInfo = styled.div`
  margin-left: 20px;
`;

// 아이콘 그룹 배치
const PlayListIconGroup = styled.div`
  margin-right: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
`;
