module.exports = {
  root: true,
  env: {
    node: true,
    // "cypress/globals": true
  },
  "plugins": [
    // "cypress",
  ],
  'extends': [
    "plugin:cypress/recommended",
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // "cypress/no-assigning-return-values": "error",
    // "cypress/no-unnecessary-waiting": "error",
    // "cypress/assertion-before-screenshot": "warn",
    // "cypress/no-force": "warn",
    // "cypress/no-async-tests": "error",
    // "cypress/no-pause": "error",


    // 三个等号
    eqeqeq: 'off',
    // 关闭驼峰
    camelcase: 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
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
