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
import { createComment } from "@/api/comment";
import { useParams } from "react-router-dom";
import { useUserStore } from "@/stores/userStore";

const Play = () => {
  const [commentText, setCommentText] = useState("");
  const userId = useUserStore((state) => state.user?.random_id);
  const { p_id } = useParams<{ p_id: string }>();
  const playlistId = Number(p_id);

  const handleSubmit = async () => {
    if (!commentText.trim()) return alert("댓글을 입력해주세요."); // 토스트 알림으로 수정

    if (!userId || !playlistId) {
      return alert("로그인 정보 또는 플레이리스트 정보가 없습니다.");
    }

    try {
      await createComment({
        playlist_id: playlistId,
        random_id: userId,
        comment: commentText,
      });

      setCommentText(""); // 입력 초기화
      alert("댓글이 등록되었습니다."); // 또는 toast 메시지
      // refetch()
    } catch (error) {
      console.error("댓글 등록 실패", error);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };
  return (
    <>
      <Title showBackButton title="여기에 플레이리스트 제목" />
      <VideoWrapper />
      <VideoTitle>제목을 불러올 부분</VideoTitle>
      <Meta>
        <ProfileWrapper>
          <ProfileImage src={DefaultProfile} />
          <ProfileName>만든 사람</ProfileName>
        </ProfileWrapper>
        <IconGroup>
          <span className="like">
            <img src={Like} alt="좋아요" /> 50
          </span>
          <span className="comment">
            <img src={commentIcon} alt="댓글" /> 235
          </span>
        </IconGroup>
      </Meta>
      <CommentWriteWrapper>
        <ProfileImage src={DefaultProfile} />
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
        <CommentIndividualWrapper>
          <ProfileImage src={DefaultProfile} />
          <CommentIndividual>
            <CommentWriter>작성자</CommentWriter>
            <CommentContent>
              댓글 내용 진짜 진짜 진짜 진짜 길어지면 어떻게 나올지 한 번
              보여보겠습니다. 쓴 길이만큼 엄~~~~~청 길어지는 거 확인했습니다~~
            </CommentContent>
          </CommentIndividual>
        </CommentIndividualWrapper>

        <CommentIndividualWrapper>
          <ProfileImage src={DefaultProfile} />
          <CommentIndividual>
            <CommentWriter>작성자2</CommentWriter>
            <CommentContent>댓글 내용</CommentContent>
          </CommentIndividual>
        </CommentIndividualWrapper>

        <CommentIndividualWrapper>
          <ProfileImage src={DefaultProfile} />
          <CommentIndividual>
            <CommentWriter>작성자3</CommentWriter>
            <CommentContent>댓글 내용</CommentContent>
          </CommentIndividual>
        </CommentIndividualWrapper>

        <CommentIndividualWrapper>
          <ProfileImage src={DefaultProfile} />
          <CommentIndividual>
            <CommentWriter>작성자4</CommentWriter>
            <CommentContent>댓글 내용</CommentContent>
          </CommentIndividual>
        </CommentIndividualWrapper>

        <CommentIndividualWrapper>
          <ProfileImage src={DefaultProfile} />
          <CommentIndividual>
            <CommentWriter>작성자5</CommentWriter>
            <CommentContent>댓글 내용</CommentContent>
          </CommentIndividual>
        </CommentIndividualWrapper>
      </CommentListWrapper>

      <PlayListInfoWrapper>
        <PlayListInfo>에스파 입덕 영상 모음 [1/10]</PlayListInfo>
        <PlayListIconGroup>
          <Icon src={GoBack} size="small" colorType="white" alt="이전" />
          <img src={List} alt="목록" style={{ width: 24, height: 24 }} />
          <Icon
            src={GoBack}
            size="small"
            colorType="white"
            alt="다음"
            rotate={180}
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
  margin-left: 50px;
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
  gap: 10px;
  color: var(--text-secondary);

  span {
    display: flex;
    align-items: center;
    gap: 4px;

    img {
      width: 28px;
      height: 28px;
    }
  }
`;

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
