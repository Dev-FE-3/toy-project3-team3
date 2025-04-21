/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
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

    cy.window().then((win) => {
      win.localStorage.setItem(
        Cypress.env("SUPABASE_AUTH_TOKEN_KEY"),
        JSON.stringify(authData),
      );
    });
  });
});
