/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * UI 없이 Supabase 로그인
     * @param email 사용자 이메일
     * @param password 사용자 비밀번호
     */
    loginWithoutUI(email: string, password: string): Chainable<void>;
  }
}
