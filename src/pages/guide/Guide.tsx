import Button from "../../shared/component/Button";

const Guide = () => {
  return (
    <div>
      <br />
      <h1>가이드 페이지</h1>
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
        btnColor="pink"
        onClick={() => console.log("중간 버튼 클릭됨")}
      >
        중간 버튼
      </Button>
      <br />
      <Button
        size="small"
        btnColor="pink"
        onClick={() => console.log("작은 버튼 클릭됨")}
      >
        핑크 작은 버튼
      </Button>
      <Button
        size="small"
        btnColor="white"
        onClick={() => console.log("작은 버튼 클릭됨")}
      >
        화이트 작은 버튼
      </Button>
    </div>
  );
};

export default Guide;
