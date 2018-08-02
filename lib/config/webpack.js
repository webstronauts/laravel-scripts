const fs = require('fs')
const path = require('path')
const createClientConfig = require('./webpack.client')
const createServerConfig = require('./webpack.server')

module.exports = function(env) {
  const nodeEnv = env['production'] ? 'production' : 'development'

  const resolveOwnFile = (...p) => path.resolve(__dirname, '../..', ...p)
  const resolveRootFile = (...p) => path.resolve(env.rootDir, ...p)
  const resolveSrcFile = (...p) => resolveRootFile(env.srcDir, ...p)
  const resolveOutputFile = (...p) => resolveRootFile(env.outDir, ...p)

  const helpers = {
    resolveOwnFile,
    resolveRootFile,
    resolveSrcFile,
    resolveOutputFile,
  }

  // Do this as the first thing so that any code reading it knows the right env.
  process.env.BABEL_ENV = nodeEnv
  process.env.NODE_ENV = nodeEnv

  let options = {babel: {presets: []}}

  try {
    // Check if liftoff.config.js exists
    liftoff = require(resolveRootFile('liftoff.config.js'))
  } catch (e) {}

  // First we check to see if the user has a custom .babelrc file, otherwise
  // we just use our default babel config.
  const hasBabelRc = fs.existsSync(resolveRootFile('.babelrc'))

  if (hasBabelRc) {
    console.log('Using .babelrc defined in your app root')
  } else {
    options.babel.presets.push(require.resolve('./babel'))
  }

  let clientConfig = createClientConfig(options, nodeEnv, helpers)
  let serverConfig = createServerConfig(options, nodeEnv, helpers)

  if (liftoff.webpack) {
    clientConfig = liftoff.webpack(
      clientConfig,
      {
        target: 'web',
        dev: nodeEnv !== 'production',
      },
      helpers,
    )
    serverConfig = liftoff.webpack(
      serverConfig,
      {
        target: 'node',
        dev: nodeEnv !== 'production',
      },
      helpers,
    )
  }

  return [clientConfig, serverConfig]
}
