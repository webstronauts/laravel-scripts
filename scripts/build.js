// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

const chalk = require('chalk')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const printBuildError = require('react-dev-utils/printBuildError')
const webpack = require('webpack')
const createClientConfig = require('../config/webpack.client')
const createServerConfig = require('../config/webpack.server')

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

function compile (config) {
  const compiler = webpack(config)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }

      const messages = formatWebpackMessages(stats.toJson({}, true))

      if (messages.errors.length) {
        return reject(new Error(messages.errors.join('\n\n')))
      }

      if (process.env.CI && (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') && messages.warnings.length) {
        console.log(
          chalk.yellow(`
            Treating warnings as errors because process.env.CI = true.
            Most CI servers set it automatically.
          `.trim())
        )

        return reject(new Error(messages.warnings.join('\n\n')))
      }

      return resolve({
        stats,
        warnings: messages.warnings
      })
    })
  })
}

const clientConfig = createClientConfig()
const serverConfig = createServerConfig()

Promise.all([
  compile(clientConfig),
  compile(serverConfig)
]).then(({ stats, warnings }) => {
  // ...
}, err => {
  console.log(chalk.red('Failed to compile.\n'))
  printBuildError(err)
  process.exit(1)
})
  .catch(err => {
    if (err && err.message) {
      console.error(err.message)
    }

    process.exit(1)
  })
