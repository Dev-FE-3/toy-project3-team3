import { css } from "@emotion/react";

export const fontStyles = css`
  @font-face {
    font-family: "Noto Sans KR";
    font-weight: 400;
    font-style: normal;
    src:
      url("/fonts/NotoSansKR-Regular.ttf") format("ttf"),
      url("/fonts/NotoSansKR-Regular.woff") format("woff"),
      url("/fonts/NotoSansKR-Regular.woff2") format("woff2");
  }

  @font-face {
    font-family: "Noto Sans KR";
    font-weight: 500;
    font-style: normal;
    src:
      url("/fonts/NotoSansKR-Medium.ttf") format("ttf"),
      url("/fonts/NotoSansKR-Medium.woff") format("woff"),
      url("/fonts/NotoSansKR-Medium.woff2") format("woff2");
  }

  @font-face {
    font-family: "Noto Sans KR";
    font-weight: 700;
    font-style: normal;
    src:
      url("/fonts/NotoSansKR-Bold.ttf") format("ttf"),
      url("/fonts/NotoSansKR-Bold.woff") format("woff"),
      url("/fonts/NotoSansKR-Bold.woff2") format("woff2");
  }
`;
