import globals from 'globals'
import pluginReact from 'eslint-plugin-react'

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        process: 'readonly', // `process`を読み取り専用で追加
      },
    },
    plugins: {
      react: pluginReact,
    },
    settings: {
      react: {
        version: 'detect', // Reactのバージョンを自動的に検出
      },
    },
    rules: {
      'no-unused-vars': ['warn'],
      'no-undef': ['error'],
      'no-console': ['off'],
      'no-debugger': ['warn'],
      'react/prop-types': ['off'], // 無効化
      'react/react-in-jsx-scope': ['error'],
    },
  },
]
