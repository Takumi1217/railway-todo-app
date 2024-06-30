import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        process: 'readonly',  // `process`を読み取り専用で追加
      },
    },
    plugins: {
      react: pluginReact,
    },
    settings: {
      react: {
        version: 'detect',  // Reactのバージョンを自動的に検出
      },
    },
    rules: {
      // pluginJs.configs.recommendedの内容
      "no-unused-vars": ["warn"],
      "no-undef": ["error"],
      "no-console": ["warn"],
      "no-debugger": ["warn"],
      // pluginReactConfigの内容
      "react/prop-types": ["off"],
      "react/react-in-jsx-scope": ["error"],
      // 追加のカスタムルールをここに追加できます
    },
  },
];
