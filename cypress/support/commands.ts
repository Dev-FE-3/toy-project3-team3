Cypress.Commands.add("loginWithoutUI", (email: string, password: string) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("SUPABASE_URL")}/auth/v1/token?grant_type=password`,
    body: { email, password },
    headers: {
      apikey: Cypress.env("SUPABASE_ANON_KEY"),
      "Content-Type": "application/json",
    },
  }).then((response) => {
    const { access_token, refresh_token } = response.body;

    const authData = {
      access_token,
      refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      expires_in: 3600,
      token_type: "bearer",
      user: response.body.user,
    };

    return cy.window().then((win) => {
      win.localStorage.setItem(
        Cypress.env("SUPABASE_AUTH_TOKEN_KEY"),
        JSON.stringify(authData),
      );
      win.location.reload();
      return cy.wrap(authData);
    });
  });
});

Cypress.Commands.add("deleteTestUser", (email: string) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("SUPABASE_URL")}/rest/v1/rpc/delete_user_by_email`,
    headers: {
      apikey: Cypress.env("SUPABASE_SERVICE_ROLE_KEY"), // ⚠️ 중요: service_role 키
      Authorization: `Bearer ${Cypress.env("SUPABASE_SERVICE_ROLE_KEY")}`,
      "Content-Type": "application/json",
    },
    body: { user_email: email },
  });
});
