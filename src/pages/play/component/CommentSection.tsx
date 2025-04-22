import CommonInput from '@/shared/component/input';
import styled from "@emotion/styled";
import DefaultProfile from "@/assets/images/defaultProfile.svg";
import Submit from "@/assets/images/Submit.svg";
import { CommentWithUserInfo } from '@/db/comment';

interface CommentSectionProps {
  userImg: string;
  commentText: string;
  onChangeCommentText: (text: string) => void;
  onSubmit: () => void;
  commentList: CommentWithUserInfo[];
  onUserClick: (userRandomId: number) => void;
}

const CommentSection = ({
  userImg,
  commentText,
  onChangeCommentText,
  onSubmit,
  commentList,
  onUserClick,
}: CommentSectionProps) => {
  return (
    <div>
      <CommentWriteWrapper>
        <ProfileImage src={userImg || DefaultProfile} />
        <CommonInput
          id="comment"
          placeholder="댓글을 입력해주세요."
          width="400px"
          value={commentText}
          onChange={(e) => onChangeCommentText(e.target.value)}
        />
        <SubmitIcon src={Submit} alt="제출" onClick={onSubmit} />
      </CommentWriteWrapper>
      <ScrollableContent>
        <CommentListWrapper>
          {commentList.map((item) => {
            return (
              <CommentIndividualWrapper key={item.c_id}>
                <ProfileImage
                  src={item.user_img || DefaultProfile}
                  onClick={() => onUserClick(item.user_random_id)}
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
    </div>
  )
}

export default CommentSection

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50px;
  object-fit: cover;
  cursor: pointer;
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
