const loginWithoutUI = () => {
  const email = `test33@naver.com`;
  const password = "1234567!";

  return cy
    .request({
      method: "POST",
      url: `${Cypress.env("SUPABASE_URL")}/auth/v1/token?grant_type=password`,
      body: { email, password },
      headers: {
        apikey: Cypress.env("SUPABASE_ANON_KEY"),
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      const { access_token, refresh_token } = res.body;
      cy.window().then((win) => {
        const authData = {
          access_token,
          refresh_token,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          expires_in: 3600,
          token_type: "bearer",
          user: res.body.user,
        };

        win.localStorage.setItem(
          Cypress.env("SUPABASE_AUTH_TOKEN_KEY"),
          JSON.stringify(authData),
        );
      });
    });
};
const title = `aespa 플레이 리스트`;
const videoUrl = "https://youtu.be/jWQx2f-CErU?si=gxr0poNeypvXAByC";

describe("플레이리스트 생성 페이지", () => {
  beforeEach(() => {
    cy.viewport(600, 1000);
    cy.session("logged-in", loginWithoutUI);
    cy.visit("/");
    cy.get('[data-testid="nav-생성"]').click();
    cy.url().should("include", "/create");
  });

  it("제목 없이 업로드할 경우 에러 메시지를 보여준다", () => {
    cy.get("button").contains("업로드 하기").click();

    cy.contains("플레이리스트 제목을 입력해주세요.").should("exist");
  });

  it("동영상 없이 업로드할 경우 에러 메시지를 보여준다", () => {
    cy.get("#playlistTitle").type(title);
    cy.get("#uploadButton").contains("업로드 하기").click();

    cy.contains("1개 이상의 영상을 추가해주세요.").should("exist");
  });

  it("썸네일 없이 업로드할 경우 에러 메시지를 보여준다", () => {
    cy.get("#playlistTitle").type(title);
    cy.get("#videoUrl").type(videoUrl);
    cy.get("#addVideoButton").click();

    cy.get('[data-testid="videoItem"]').should("have.length.at.least", 1);
    cy.get("#uploadButton").contains("업로드 하기").click();

    cy.contains("썸네일 파일이 없습니다.").should("exist");
  });

  it("생성 중에는 nav와 헤더를 클릭해도 이동되지 않으며, 나가려면 모달을 통해야 한다", () => {
    cy.get("#playlistTitle").should("exist");
    cy.url().should("include", "/create");
    const navItems = ["nav-홈", "nav-탐색", "nav-보관함"];
    navItems.forEach((testId) => {
      cy.get(`[data-testid="${testId}"]`).click();
      cy.url().should("include", "/create");
    });

    cy.get('[data-testid="header-logo"]').click({ force: true });
    cy.url().should("include", "/create");

    cy.get('[data-testid="header-profileLogo"]').click({ force: true });
    cy.url().should("include", "/create");

    cy.get('img[alt="닫기"]').click();
    cy.contains("정말 나가시겠습니까?").should("exist");

    cy.contains("나가기").click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });

  it("동영상 삭제 버튼을 누르면 모달이 열리고 삭제를 누르면 목록에서 제거된다", () => {
    cy.get("#playlistTitle").type(title);
    cy.get("#videoUrl").type(videoUrl);
    cy.get("#addVideoButton").click();

    cy.get('[data-testid="videoItem"]').should("have.length.at.least", 1);

    cy.get('[data-testid="deleteButton"]').first().click();

    cy.contains("정말 삭제하시겠습니까?").should("exist");

    cy.get('[data-testid="modal-confirm-button"]').click();

    cy.get('[data-testid="videoItem"]').should("have.length", 0);
  });

  it("썸네일, 제목, 영상 URL을 입력해 플레이리스트를 정상적으로 생성할 수 있다", () => {
    cy.get("input#thumbnail-upload").selectFile(
      "cypress/fixtures/testimage.jpg",
      {
        force: true,
      },
    );
    cy.get("img[alt='썸네일 미리보기']").should("exist");

    cy.get("#playlistTitle").type(title);
    cy.get("#videoUrl").type(videoUrl);
    cy.get("#addVideoButton").click();
    cy.get('[data-testid="videoItem"]').should("have.length.at.least", 1);

    cy.contains("추가된 동영상 목록").should("exist");
    cy.get("#uploadButton").contains("업로드 하기").click();

    cy.contains("좋아요! 새로운 플레이리스트가 생성되었어요 🎶").should(
      "exist",
    );
    cy.url().should("include", "/storage");
  });
});
