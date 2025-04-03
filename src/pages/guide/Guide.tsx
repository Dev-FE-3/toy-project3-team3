import Button from "../../shared/component/Button";

const Guide = () => {
  return (
    <h1>
      <br />
      <Button
        size="big"
        color="pink"
        onClick={() => console.log("큰 버튼 클릭됨")}
      >
        큰 버튼
      </Button>
      <br />
      <Button
        size="mid"
        bColor="pink"
        onClick={() => console.log("중간 버튼 클릭됨")}
      >
        중간 버튼
      </Button>
      <br />
      <Button
        size="small"
        bColor="pink"
        onClick={() => console.log("작은 버튼 클릭됨")}
      >
        핑크 작은 버튼
      </Button>
      <Button
        size="small"
        bColor="white"
        onClick={() => console.log("작은 버튼 클릭됨")}
      >
        화이트 작은 버튼
      </Button>
    </h1>
  );
};

export default Guide;
