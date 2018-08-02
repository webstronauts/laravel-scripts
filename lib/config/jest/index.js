const fs = require('fs')
const path = require('path')

module.exports = env => {
  const resolveTransformFile = p => path.resolve(__dirname, p)
  const resolveRootFile = (...p) => path.resolve(env.rootDir, ...p)
  const resolveSrcFile = (...p) => resolveRootFile(env.srcDir, ...p)

  const setupTestsFile = fs.existsSync(resolveRootFile('./setupTests.js'))
    ? '<rootDir>/setupTests.js'
    : undefined

  const config = {
    rootDir: resolveRootFile('.'),
    collectCoverageFrom: ['**/*.{js,jsx,mjs}'],
    coverageDirectory: resolveRootFile('./coverage'),
    moduleNameMapper: {
      '~(.*)$': `${resolveSrcFile('.')}/$1`,
    },
    setupTestFrameworkScriptFile: setupTestsFile,
    testMatch: [
      '<rootDir>/**/__tests__/**/*.{js,jsx,mjs}',
      '<rootDir>/**/?(*.)(spec|test).{js,jsx,mjs}',
    ],
    testEnvironment: 'node',
    testURL: 'http://localhost',
    transform: {
      '^.+\\.(js|jsx|mjs)$': resolveTransformFile('babelTransform.js'),
      '^.+\\.css$': resolveTransformFile('cssTransform.js'),
      '^.+\\.(graphql|gql)$': resolveTransformFile('graphqlTransform.js'),
      '^(?!.*\\.(js|jsx|mjs|css|json|graphql|gql)$)': resolveTransformFile(
        'fileTransform.js',
      ),
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$'],
  }

  return config
}
