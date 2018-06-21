// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

const fs = require('fs')
const chalk = require('chalk')
const del = require('del')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild,
} = require('react-dev-utils/FileSizeReporter')
const webpack = require('webpack')
const createClientConfig = require('../config/webpack.client')
const createServerConfig = require('../config/webpack.server')
const paths = require('../config/paths')

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

function compile(entry, config) {
  const compiler = webpack(config)

  console.log(`Compiling ${entry}...`)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }

      const messages = formatWebpackMessages(stats.toJson({}, true))

      if (stats.hasErrors()) {
        return reject(new Error(messages.errors.join('\n\n')))
      }

      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        stats.hasWarnings()
      ) {
        console.log(
          chalk.yellow(
            `
            Treating warnings as errors because process.env.CI = true.
            Most CI servers set it automatically.
          `.trim(),
          ),
        )

        return reject(new Error(messages.warnings.join('\n\n')))
      }

      console.log(chalk.green(`Compiled ${entry} assets successfully.`))

      return resolve({
        stats,
        warnings: messages.warnings,
      })
    })
  })
}

async function build(previousFileSizes) {
  let liftoff = {}

  try {
    // Check if liftoff.config.js exists
    liftoff = require(paths.appLiftoffConfig)
  } catch (e) {}

  // First we check to see if the user has a custom .babelrc file, otherwise
  // we just use our default babel config.
  const hasBabelRc = fs.existsSync(paths.appBabelRc)
  const options = {babel: {presets: []}}

  if (hasBabelRc) {
    console.log('Using .babelrc defined in your app root')
  } else {
    options.babel.presets.push(require.resolve('./config/babel'))
  }

  let clientConfig = createClientConfig(options, 'production')
  let serverConfig = createServerConfig(options, 'production')

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

  console.log('Creating an optimized production build...')

  const clientResult = await compile('client', clientConfig)
  const serverResult = await compile('server', serverConfig)

  return {
    stats: clientResult.stats,
    previousFileSizes,
    warnings: {...clientResult.warnings, ...serverResult.warnings},
  }
}

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
measureFileSizesBeforeBuild(paths.appPublic)
  .then(previousFileSizes => {
    // Remove all previously compiled assets
    del.sync([paths.appPublicCss, paths.appPublicJs, paths.appPublicManifest])

    // Start the webpack build
    return build(previousFileSizes)
  })
  .then(
    ({stats, previousFileSizes, warnings}) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'))
        console.log(warnings.join('\n\n'))
        console.log(
          `Search for the ${chalk.underline(
            chalk.yellow('keywords'),
          )} to learn more about each warning.`,
        )
        console.log(
          `To ignore, add ${chalk.cyan(
            '// eslint-disable-next-line',
          )} to the line before.\n`,
        )
      } else {
        console.log(chalk.green('Compiled successfully.\n'))
      }

      console.log('File sizes after gzip:\n')
      printFileSizesAfterBuild(stats, previousFileSizes, paths.appPublic)
      console.log()
    },
    err => {
      console.log(chalk.red('Failed to compile.\n'))
      console.log((err.message || err) + '\n')
      process.exit(1)
    },
  )
