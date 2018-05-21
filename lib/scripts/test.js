// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'

const jest = require('jest')
const path = require('path')

const argv = process.argv.slice(2)

// Watch unless on CI or in coverage mode
if (!process.env.CI && argv.indexOf('--coverage') < 0) {
  argv.push('--watch')
}

const createJestConfig = require('../config/jest')
const paths = require('../config/paths')

argv.push(
  '--config',
  JSON.stringify(
    createJestConfig(
      relativePath => path.resolve(__dirname, '..', relativePath),
      paths.assetsPath,
    ),
  ),
)

jest.run(argv)
