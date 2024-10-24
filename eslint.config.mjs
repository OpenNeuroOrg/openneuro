// @ts-check
import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import reactCompiler from "eslint-plugin-react-compiler"

export default tseslint.config({
  ignores: [
    "**/build/**",
    "**/dist/**",
    "**/node_modules/**",
    ".yarn/*",
    ".pnp.cjs",
    ".pnp.loader.mjs",
    "**/coverage/**",
    "packages/openneuro-app/pluralize-esm.js",
    "packages/openneuro-app/src/scripts/utils/schema-validator.js",
  ],
}, {
  files: [
    "packages/**/*.ts",
    "packages/**/*.tsx",
    "packages/**/*.jsx",
    "packages/**/*.js",
  ],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
  ],
  rules: {
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "no-console": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_",
      },
    ],
  },
}, {
  files: ["packages/**/*.tsx", "packages/**/*.jsx"],
  plugins: {
    "react-compiler": reactCompiler,
  },
  rules: {
    "react-compiler/react-compiler": "error",
  },
}, {
  files: ["packages/**/*.js"],
  ...tseslint.configs.disableTypeChecked,
})
