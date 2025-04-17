<p align="center" style="display: flex; align-items: center;">
  <h1 align="center">🎵 IdolLing </h1>
</p>
<p align="center " style="font-size: 16px; line-height: 1.6;">
좋아하는 아이돌 콘텐츠를 한곳에,
<br>팬들을 위한 <strong>아이돌 영상 플렛폼</strong>
</p>
<br>

## 🚀 프로젝트 소개</span>
여기에 영상이 들어갈 예정

## 📅 프로젝트 진행 과정

### 기획 (2025.03.26 ~ 2025.04.01)
프로젝트의 방향성을 설정하고 핵심 기능을 정의하는 시간을 가졌습니다. 팀원들과 함께 기능 정의서, 컨벤션을 정의하고 디자인을 구성하는 시간을 가졌습니다.

### [와이어프레임](https://www.figma.com/design/RKmgqRJ9p9viF68tUqUF9m/%ED%86%A0%EC%9D%B43_%ED%83%80%EC%9E%85-%EB%84%A5%EC%8A%A4%ED%8A%B8-%EB%8F%84%EC%96%B4?node-id=0-1&t=wYzGJ7TslEp1ChqA-0) 

정의된 기능 정의서를 바탕으로 Figma를 활용하여 와이어프레임을 제작했습니다. 프로젝트의 일관성을 위해 디자인 시스템을 구축하고 공통 컴포넌트를 정의했습니다.

### 백엔드 및 컴포넌트 제작 (2025.04.02 ~ 2025.04.06)

설계된 와이어프레임을 기반으로 공통 컴포넌트를 설계하고 개발한 후, 세부 기능을 단계적으로 구현했습니다. 
<br/>
Supabase를 BaaS(Backend as a Service)로 도입하여 내장 메서드를 활용한 API를 설계했습니다.<br/>
매일 아침 데일리 스크럼을 통해 진행 상황을 공유하고, 팀원 간 적극적인 코드 리뷰를 진행했습니다.

### 페이지 개발 (2025.04.07 ~ 2025.04.16)

API를 통해 가져온 데이터를 TanStack Query와 연동해 효율적인 데이터 페칭과 상태 관리를 구현했습니다.<br/> 
페이지 전역 상태 관리를 위해 Zustand를 활용했습니다.

### 최종 merge, 테스트 (2025.04.16 ~ 2025.04.18)

최종 merge를 진행하고, Cypress를 활용해 주요 기능에 대한 E2E 테스트를 수행하여 발생할 수 있는 오류를 사전에 점검 및 수정했습니다.

### 리펙토링 (2025.04.21 ~ 2025.04.23)
코드 품질 향상을 위한 리팩토링을 진행했고, 컴포넌트 분리 및 발견된 버그를 수정했습니다.

## 🗂️ 브랜치 및 디렉토리 구조</span>
```
📦 src
├── 📂 api
├── 📂 assets
│   ├── 📂 animation
│   └── 📂 images
├── 📂 lib
│   └── 🧩 supabase.ts
├── 📂 pages
│   ├── 📂 auth
│   ├── 📂 followInfo
│   ├── 📂 guide
│   ├── 📂 homeAndSearch
│   ├── 📂 play
│   ├── 📂 playlist
│   ├── 📂 profile
│   └── 📂 storage
├── 📂 shared
│   ├── 📂 component
│   ├── 📂 hooks
│   ├── 📂 styles
│   ├── 🧩 ExtractVideoId.ts
│   ├── 🧩 Header.tsx
│   ├── 🧩 Layout.tsx
│   └── 🧩 Nav.tsx
├── 📂 stores
│   ├── 🧩 lockStore.ts
│   └── 🧩 userStore.ts
├── 🧩 App.tsx
├── 🧩 main.tsx
└── 🧩 vite-env.d.ts
```

## 설계
![Image](https://github.com/user-attachments/assets/b822a076-b26b-4186-a16b-9d1e48f02872)

## <span id="4">🛠️ 기술 스택 및 개발환경
| **기술 스택** | **도입 이유** |
| :--- | :--- |
| <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"> | 선언적 UI 작성이 가능하며, 커뮤니티와 생태계가 활발해 빠른 문제 해결이 가능 |
| <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"> | 빠른 번들링과 개발 서버 실행, 간편한 설정으로 개발 생산성 향상 |
| <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> | 정적 타이핑을 통해 버그를 사전에 방지하고, 협업 시 코드 가독성 향상에 유리 |
| <img src="https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"> | 비동기 데이터 요청 및 캐싱 기능으로 효율적인 서버 데이터 관리 |
| <img src="https://img.shields.io/badge/Zustand-FF5C00?style=for-the-badge&logo=Zustand&logoColor=white"> | 애플리케이션의 전역 상태 관리를 단순하고 직관적으로 관리 및 처리 |
| <img src="https://img.shields.io/badge/Emotion-DB7093?style=for-the-badge&logo=emotion&logoColor=white"> | CSS-in-JS로 컴포넌트 단위 스타일링이 가능하며, 스타일 충돌을 방지 |
| <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white"> | 실시간 DB, 인증 등 백엔드 기능을 빠르게 구축하고 확장성을 확보 |
| <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white"> <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black"> | 코드 스타일을 통일하고 품질을 유지하며 잠재적인 오류를 사전에 방지 |
| <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white"> <img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"> | 실시간 커뮤니케이션, 작업 관리 및 문서화를 통해 팀 간 효율적인 협업 가능 |

<br>

## 커밋 컨벤션

| **타입** | **설명**                                          | **예시**                                              |
| -------- | ------------------------------------------------- | ----------------------------------------------------- |
| feat     | 기능 구현                                         | [feat] - 페인페이지 레이아웃 구현                     |
| rename   | 파일/폴더 이름 변경 및 이동                       | [rename] - `src/old-folder`를 `src/new-folder`로 이동 |
| script   | 라이브러리 추가                                   | [script] - `supabase` 라이브러리 추가                 |
| fix      | 버그 수정                                         | [fix] - `supabase` env 미연결 문제 해결               |
| chore    | 빌드 업무 수정, 패키지 매니저 설정 수정           | [chore] - .env 설정 변경                              |
| refactor | 코드 리팩토링                                     | [refactor] - 함수 분리 및 코드 정리                   |
| style    | 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우 | [style] - 버튼 스타일 수정                            |
| test     | 테스트 코드, 리팩토링 테스트 코드 추가            | [test] - 유저 로그인 기능 테스트 추가                 |
| docs     | 문서 수정                                         | [docs] - API 문서 업데이트                            |

<br>


## 👩‍🔧 팀원 소개
| <img width="100px" src="https://avatars.githubusercontent.com/u/103546376?v=4" style="max-width: 100%;"> | <img width="100px" src="https://avatars.githubusercontent.com/u/94222592?v=4" style="max-width: 100%;"> | <img width="100px" src="https://avatars.githubusercontent.com/u/150775699?v=4" style="max-width: 100%;"> |
| :------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: |
| **이지원** <br> [@eas1w0n](https://github.com/eas1w0n) | **정지윤** <br> [@jiyoon04](https://github.com/jiyoon04) | **표현경** <br> [@girl0330](https://github.com/girl0330) |
| **프로젝트 기초 세팅**<br>유튜브 API 세팅<br>Input, Loading, Modal 제작<br>로그인 & 회원가입 페이지<br>플레이리스트 제작/수정<br>테스트 코드 작성 | **Supabase 초기 세팅**<br>Nav bar, Header, Title, Scroll bar 제작<br>프로필 페이지<br>보관함 팔로우/팔로잉<br>홈 & 탐색 페이지<br>테스트 코드 작성 | **DB 설계**<br>Axios 활용 API 세팅<br>Select Box, Button 제작<br>플레이리스트 상세 페이지<br>영상 재생 페이지<br>Playlist Card 컴포넌트 제작 |
<br>


## 🛠️ 시작 가이드</span>

### Installation

1. 프로젝트 클론하기
   ```
   git clone https://github.com/Dev-FE-3/toy-project3-team3.git
   ```
   
2. 의존성 설치
   ```
   npm install
   ```
   
   이 명령어는 `package.json` 파일에 정의된 모든 의존성(dependencies)을 자동으로 설치해 줍니다.

3. 개발 서버 실행
   ```
   npm run dev
   ```
   브라우저에서 http://localhost:5173 주소로 접속하여 애플리케이션을 확인할 수 있습니다.


<br>