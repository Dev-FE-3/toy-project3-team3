import styled from "@emotion/styled";
import cancel from "@/assets/images/cancel.svg";
import { ReactSVG } from "react-svg";

interface VideoItemProps {
  title: string;
  source: string;
  onDelete: () => void;
}

const VideoItem = ({ title, source, onDelete }: VideoItemProps) => {
  return (
    <ItemWrapper>
      <Thumbnail />
      <TextBox>
        <VideoTitle>{title}</VideoTitle>
        <VideoSource>{source}</VideoSource>
      </TextBox>
      <DeleteButton onClick={onDelete}>
        <ReactSVG src={cancel} />
      </DeleteButton>
    </ItemWrapper>
  );
};

export default VideoItem;

const ItemWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background-color: var(--background-color);
`;

const Thumbnail = styled.div`
  width: 150px;
  height: 90px;
  background-color: #d9d9d9;
  border-radius: 5px;
`;

const TextBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const VideoTitle = styled.div`
  font-size: var(--font-size-primary);
  display: -webkit-box; //줄 수 제한을 위해 사용용
  -webkit-line-clamp: 2; // 최대 2줄
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; //넘치면 ... 을 보여줌줌
  line-height: 1.1;
`;

const VideoSource = styled.div`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
`;

const DeleteButton = styled.button`
  font-size: 20px;
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  color:;
`;
