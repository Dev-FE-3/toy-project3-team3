import styled from "@emotion/styled";

interface RenderHashTagsProps {
  text: string;
}

const RenderHashTags = ({ text }: RenderHashTagsProps) => {
  return (
    <StyledReadOnlyTag>
      {text.split(" ").map((word, idx) =>
        word.startsWith("#") ? (
          <span className="hashtag" key={idx}>
            {word + " "}
          </span>
        ) : (
          <span key={idx}>{word + " "}</span>
        ),
      )}
    </StyledReadOnlyTag>
  );
};

export default RenderHashTags;

// ✅ 이게 RenderHashTags.tsx 내부로 들어가야 해
const StyledReadOnlyTag = styled.div`
  width: 250px;
  min-height: 60px;
  padding: 5px 5px;
  border-radius: 20px;
  background-color: transparent;
  color: var(--text-primary);
  font-size: var(--font-size-primary);
  border: 1px solid transparent;
  white-space: pre-wrap;
  word-break: break-word;

  span.hashtag {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    background-color: var(--primary);
    color: white;

    height: 26px;
    padding: 0 10px;
    margin-right: 6px;

    border-radius: 999px;
    font-weight: 500;
    font-size: 14px;
    line-height: 1;
  }
`;
