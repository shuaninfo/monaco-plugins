/** @format */

// https://segmentfault.com/a/1190000019661168
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    // 指定代码的运行环境
    browser: true,
    node: true
  },
  rules: {
    // "cypress/no-assigning-return-values": "error",
    // "cypress/no-unnecessary-waiting": "error",
    // "cypress/assertion-before-screenshot": "warn",
    // "cypress/no-force": "warn",
    // "cypress/no-async-tests": "error",
    // "cypress/no-pause": "error",
    'ts-ignore': 0,
    // insert ·· eslint prettier/prettier: https://stackoverflow.com/questions/58424718/how-can-i-disable-the-error-prettier-prettier-on-eslint
    'prettier/prettier': 0,
    // indent: 'off', // ['error', 2],
    // 三个等号
    eqeqeq: 'off',
    // 关闭驼峰
    camelcase: 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  // parserOptions: {
  //   // ecmaVersion: 2020
  //   parser: 'babel-eslint'
  // },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
