const { pathsToModuleNameMapper } = require('ts-jest/utils')
// const { compilerOptions } = require('./tsconfig')

const compilerOptions = {
  "paths": {
    "@shuaninfo/*": ["*/src"],
    "lexer": ["lexer/src/index"],
    "parser": ["parser/src/index"]
  }
}

module.exports = {
  coverageReporters: ['json', 'html'],
  moduleDirectories: ['.', 'node_modules', 'src'],

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  rootDir: '',
  moduleNameMapper: {
    ...pathsToModuleNameMapper(
      compilerOptions.paths, { prefix: '<rootDir>/packages' },
    ),
  },
  transform: { '^.+\\.(t|j)sx?$': ['@swc/jest'] },
}
