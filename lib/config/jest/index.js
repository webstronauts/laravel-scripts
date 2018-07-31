const fs = require('fs')
const path = require('path')
const paths = require('../paths')

const resolve = p => path.resolve(__dirname, p)

const setupTestsFile = fs.existsSync(paths.testsSetup)
  ? '<rootDir>/setupTests.js'
  : undefined

const config = {
  rootDir: paths.assetsPath,
  collectCoverageFrom: ['**/*.{js,jsx,mjs}'],
  coverageDirectory: paths.testsCoverage,
  moduleNameMapper: {
    '~(.*)$': '<rootDir>/$1',
  },
  setupTestFrameworkScriptFile: setupTestsFile,
  testMatch: [
    '<rootDir>/**/__tests__/**/*.{js,jsx,mjs}',
    '<rootDir>/**/?(*.)(spec|test).{js,jsx,mjs}',
  ],
  testEnvironment: 'node',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx|mjs)$': resolve('babelTransform.js'),
    '^.+\\.css$': resolve('cssTransform.js'),
    '^.+\\.(graphql|gql)$': resolve('graphqlTransform.js'),
    '^(?!.*\\.(js|jsx|mjs|css|json|graphql|gql)$)': resolve('fileTransform.js'),
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$'],
}

module.exports = config
