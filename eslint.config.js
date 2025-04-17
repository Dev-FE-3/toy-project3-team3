import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        // Cypress 전역 변수 추가
        cy: "readonly",
        Cypress: "readonly",
        expect: "readonly",
        assert: "readonly",
        chai: "readonly",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      cypress: cypress,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
  {
    files: ["**/cypress/**/*.{js,ts,jsx,tsx}", "**/*.cy.{js,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        cy: "readonly",
        Cypress: "readonly",
        expect: "readonly",
        assert: "readonly",
        chai: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
);
