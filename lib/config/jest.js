const fs = require('fs')
const paths = require('./paths')

module.exports = (resolve, rootDir) => {
  const setupTestsFile = fs.existsSync(paths.testsSetup)
    ? '<rootDir>/setupTests.js'
    : undefined

  const config = {
    collectCoverageFrom: ['**/*.{js,jsx,mjs}'],
    coverageDirectory: paths.testsCoverage,
    setupTestFrameworkScriptFile: setupTestsFile,
    testMatch: [
      '<rootDir>/**/__tests__/**/*.{js,jsx,mjs}',
      '<rootDir>/**/?(*.)(spec|test).{js,jsx,mjs}',
    ],
    testEnvironment: 'node',
    testURL: 'http://localhost',
    transform: {
      '^.+\\.(js|jsx|mjs)$': resolve('config/jest/babelTransform.js'),
      '^.+\\.css$': resolve('config/jest/cssTransform.js'),
      '^.+\\.(graphql|gql)$': resolve('config/jest/graphqlTransform.js'),
      '^(?!.*\\.(js|jsx|mjs|css|json|graphql|gql)$)': resolve(
        'config/jest/fileTransform.js',
      ),
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$'],
  }

  if (rootDir) {
    config.rootDir = rootDir
  }

  return config
}
