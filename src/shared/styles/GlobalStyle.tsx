import { Global, css } from "@emotion/react";
import { fontStyles } from "./fonts";
import reset from "styled-reset";

const globalStyles = css`
  ${reset.toString()}
  ${fontStyles}

  :root {
    --primary: #f6a8a8;
    --primary-dark: #d98a8a;
    --primary-light: rgba(246, 168, 168, 0.6); // 비활성화 버튼 섹

    --background-color: #ffffff; // 흰색 대신 사용합니다
    --text-primary: #1e2a2e; // 검정 대신 사용합니다
    --text-secondary: #61646b; // 아이콘 및 보조 텍스트

    --disabled: #c4c4c4; // input
    --disabled-2: #d8d8d8; // 줄 선
    --button-gray: #e9e9e9;
    --profile-background: #fbfafb;

    // font size
    --font-size-title: 28px;
    --font-size-subtitle: 24px;
    --font-size-large: 18px;
    --font-size-primary: 16px;
    --font-size-small: 14px;
  }

  button {
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  a {
    text-decoration: none;
  }

  input,
  textarea {
    all: unset;
  }

  body {
    font-family: "Noto Sans KR", sans-serif;
    height: 100vh;
    overflow: hidden;
  }

  * {
    box-sizing: border-box;
  }

  /* 스크롤바 스타일 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-thumb, var(--disabled));
    border-radius: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: var(--scrollbar-track, var(--button-gray));
    border-radius: 8px;
  }
`;

const GlobalStyle = () => <Global styles={globalStyles} />;

export default GlobalStyle;
