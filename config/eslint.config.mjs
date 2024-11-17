import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginChaiFriendly from "eslint-plugin-chai-friendly";

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "src/view/jquery.min.js",
      "src/view/templates/**",
      ".vscode-test/**/*",
      "src/view/purify.min.js",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.jquery,
        ...globals.mocha,
        ...globals.node,
      },
    },
    plugins: { "chai-friendly": pluginChaiFriendly },
    rules: {
      "no-const-assign": "warn",
      "no-this-before-super": "warn",
      "no-undef": "warn",
      "no-unreachable": "warn",
      "no-unused-vars": "warn",
      "constructor-super": "warn",
      "valid-typeof": "warn",
      "prefer-const": "error",
      "no-var": "error",
      "arrow-body-style": ["error", "always"],
      "no-unused-expressions": "off",
      "chai-friendly/no-unused-expressions": "error",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
];
