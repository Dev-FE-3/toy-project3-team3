describe("사용자 인증 플로우", () => {
  const email = `test${Date.now()}@naver.com`;
  const password = "1234567!";

  // ✅ 로그인 세션 캐싱
  const loginSession = () => {
    cy.visit("/login");
    cy.get("input#email").type(email);
    cy.get("input#password").type(password);
    cy.get("button").contains("로그인").click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    cy.contains("반갑습니다").should("exist");
  };

  context("회원가입 페이지", () => {
    beforeEach(() => {
      cy.visit("/signup");
    });

    it("회원가입 폼 요소들이 보여야 한다", () => {
      cy.get("input#email").should("exist");
      cy.get("input#password").should("exist");
      cy.get("input#confirmPassword").should("exist");
      cy.contains("회원가입").should("exist");
      cy.contains("계정이 이미 있으신가요?").should("exist");
      cy.contains("로그인").should("exist");
    });

    it("입력값이 유효하지 않으면 회원가입 버튼은 비활성화 상태여야 한다", () => {
      cy.get("button").contains("회원가입").should("be.disabled");
    });

    it("유효성 검사: 이메일/비밀번호 조건 위반 시 에러 메시지가 보여야 한다", () => {
      cy.get("input#email").type("invalid-email");
      cy.get("input#password").click();
      cy.contains("유효한 이메일 주소를 입력해 주세요.").should("exist");

      cy.get("input#email").clear();
      cy.get("input#password").type("123456"); // 7자
      cy.get("input#confirmPassword").click();
      cy.contains("비밀번호는 8자리 이상이어야 합니다.").should("exist");

      cy.get("input#password").clear().type("12345678901234567"); // 17자
      cy.get("input#confirmPassword").click();
      cy.contains("비밀번호는 16자리 이하여야 합니다.").should("exist");

      cy.get("input#password").clear().type("abcdefgh"); // 특수문자 없음
      cy.get("input#confirmPassword").click();
      cy.contains("비밀번호에 특수문자 하나 이상 포함해주세요.").should(
        "exist",
      );
    });

    it("모든 입력이 유효하면 버튼이 활성화되고, 회원가입 버튼 클릭 시 토스트 알림이 뜨고 로그인 페이지로 이동한다", () => {
      cy.get("input#email").type(email);
      cy.get("input#password").type(password);
      cy.get("input#confirmPassword").type(password);
      cy.get("button").contains("회원가입").should("not.be.disabled").click();
      cy.contains("환영합니다").should("exist");
      cy.url().should("include", "/login");
    });
  });

  context("로그인 페이지", () => {
    beforeEach(() => {
      cy.visit("/login");
    });

    it("로그인 폼 요소들이 보여야 한다", () => {
      cy.get("input#email").should("exist");
      cy.get("input#password").should("exist");
      cy.contains("로그인").should("exist");
      cy.contains("계정이 아직 없으신가요?").should("exist");
      cy.contains("회원가입").should("exist");
    });

    it("입력하지 않거나 일부만 입력하면 로그인 버튼이 비활성화되어야 한다", () => {
      //아무것도 입력하지 않은 상태
      cy.get("button").contains("로그인").should("be.disabled");

      //이메일만 입력한 상태
      cy.get("input#email").type(email);
      cy.get("button").contains("로그인").should("be.disabled");

      // 비밀번호만 입력한 상태
      cy.get("input#email").clear();
      cy.get("input#password").type(password);
      cy.get("button").contains("로그인").should("be.disabled");
    });

    it("잘못된 정보로 로그인 시 에러 메시지가 보여야 한다", () => {
      cy.get("input#email").type("wrong@example.com");
      cy.get("input#password").type("wrongpassword");
      cy.get("button").contains("로그인").click();

      cy.contains("이메일 또는 비밀번호를 다시 확인해주세요.").should("exist");
    });

    it("회원가입한 계정으로 로그인하면 홈으로 이동해야 한다", () => {
      cy.get("input#email").type(email);
      cy.get("input#password").type(password);
      cy.get("button").contains("로그인").click();

      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
      cy.contains("반갑습니다").should("exist");
    });
  });

  context("로그아웃 플로우", () => {
    beforeEach(() => {
      // 세션 캐싱: 로그인 이후 세션 재사용
      cy.session("logged-in", loginSession);
    });

    it("프로필 페이지에서 로그아웃하면 로그인 페이지로 이동해야 한다", () => {
      cy.visit("/");
      cy.get("[data-testid='header']").should("exist");
      cy.get("img[alt='Profile Image']").click();
      cy.url().should("include", "/profile");

      cy.get("button").contains("로그아웃").click();

      cy.url().should("include", "/login");
      cy.contains("로그인").should("exist");
    });
  });
});
