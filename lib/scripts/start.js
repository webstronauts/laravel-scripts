// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

const fs = require('fs')
const chalk = require('chalk')
const printErrors = require('razzle-dev-utils/printErrors')
const webpack = require('webpack')
const paths = require('../config/paths')
const createClientConfig = require('../config/webpack.client')
const createServerConfig = require('../config/webpack.server')

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

function compile(config) {
  try {
    return webpack(config)
  } catch (err) {
    console.log(chalk.red('Failed to compile.\n'))
    printErrors(err)
    process.exit(1)
  }
}

let liftoff = {}
let options = {paths, babel: {presets: []}}

try {
  // Check if liftoff.config.js exists
  liftoff = require(options.paths.appLiftoffConfig)
} catch (e) {}

if (liftoff.paths) {
  if (typeof liftoff.paths === 'function') {
    options.paths = liftoff.paths(options.paths)
  } else {
    options.paths = {...options.paths, ...liftoff.paths}
  }
}

// First we check to see if the user has a custom .babelrc file, otherwise
// we just use our default babel config.
const hasBabelRc = fs.existsSync(paths.appBabelRc)

if (hasBabelRc) {
  console.log('Using .babelrc defined in your app root')
} else {
  options.babel.presets.push(require.resolve('./config/babel'))
}

let clientConfig = createClientConfig(options, paths, 'development')
let serverConfig = createServerConfig(options, paths, 'development')

if (liftoff.webpack) {
  clientConfig = liftoff.webpack(
    clientConfig,
    {target: 'web', dev: false},
    webpack,
  )
  serverConfig = liftoff.webpack(
    serverConfig,
    {target: 'node', dev: false},
    webpack,
  )
}

compile([clientConfig, serverConfig]).watch(
  {
    // ...
  },
  stats => {},
)
