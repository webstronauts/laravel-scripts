const fs = require('fs')
const createClientConfig = require('./webpack.client')
const createServerConfig = require('./webpack.server')
const paths = require('./paths')

module.exports = function(env) {
  let options = {paths, babel: {presets: []}}

  // Do this as the first thing so that any code reading it knows the right env.
  process.env.BABEL_ENV = env
  process.env.NODE_ENV = env

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

  let clientConfig = createClientConfig(options, env)
  let serverConfig = createServerConfig(options, env)

  if (liftoff.webpack) {
    clientConfig = liftoff.webpack(clientConfig, {
      target: 'web',
      dev: env !== 'production',
    })
    serverConfig = liftoff.webpack(serverConfig, {
      target: 'node',
      dev: env !== 'production',
    })
  }

  return [clientConfig, serverConfig]
}
