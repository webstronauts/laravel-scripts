const fs = require('fs')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('razzle-dev-utils/FriendlyErrorsPlugin')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const resolveEnvVars = require('resolve-env-vars')
const webpack = require('webpack')
const paths = require('./paths')

dotenvExpand(dotenv.config({ path: paths.appEnvPath }))

module.exports = function (target = 'web', env = 'development') {
  const envVars = resolveEnvVars('LIFTOFF_')

  // First we check to see if the user has a custom .babelrc file, otherwise
  // we just use babel-preset-liftoff.
  const hasBabelRc = fs.existsSync(paths.appBabelRc)
  const babelOptions = { babelrc: true, cacheDirectory: true, presets: [] }

  if (hasBabelRc) {
    console.log('Using .babelrc defined in your app root')
  } else {
    babelOptions.presets.push(require.resolve('../babel'))
  }

  console.log(babelOptions)

  const config = {
    // Use Laravel's default assets directory as webpack's context.
    context: paths.assetsPath,
    // Specify mode (either 'development' or 'production')
    mode: env,
    // Specify target (either 'node' or 'web')
    target,

    output: {
      path: paths.appPublic,
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].bundle.js'
    },

    resolve: {
      // We need to tell webpack how to resolve both our node_modules and
      // the users', so we use resolve and resolveLoader.
      modules: ['node_modules', paths.appNodeModules],
      extensions: ['.js', '.jsx', '.json', '.graphql', '.gql', '.scss', '.sass', '.css'],

      plugins: [
        // Prevents users from importing files from outside of src/ (or node_modules/).
        // This often causes confusion because we only process files within src/ with babel.
        // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
        // please link the files into your node_modules/ and let module-resolution kick in.
        // Make sure your source files are compiled, as they will not be processed in any way.
        new ModuleScopePlugin(paths.assetsPath, [paths.appPackageJson])
      ]
    },

    resolveLoader: {
      modules: [paths.appNodeModules, paths.ownNodeModules]
    },

    module: {
      // Makes missing exports an error instead of warning
      strictExportPresence: true,

      rules: [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },

        {
          enforce: 'pre',
          test: /\.s[ac]ss$/,
          use: {
            loader: require.resolve('sass-loader'),
            options: {
              sourceMap: true
            }
          }
        },

        {
          oneOf: [
            {
              // Process application JS with Babel.
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: require.resolve('babel-loader'),
                options: babelOptions
              }
            },

            {
              // Process any JS outside of the app with Babel.
              // Unlike the application JS, we only compile the standard ES features.
              test: /\.js$/,
              use: {
                loader: require.resolve('babel-loader'),
                options: {
                  babelrc: false,
                  cacheDirectory: true,
                  highlightCode: true,
                  compact: false,
                  presets: [
                    [require.resolve('@babel/preset-env'), {
                      modules: false
                    }]
                  ]
                }
              }
            },

            {
              test: /\.(graphql|gql)$/,
              use: {
                loader: require.resolve('graphql-tag/loader')
              }
            },

            {
              test: /\.(css|s[ac]ss)$/,
              use: ExtractTextPlugin.extract({
                fallback: require.resolve('style-loader'),
                use: [
                  {
                    loader: require.resolve('css-loader'),
                    options: {
                      importLoaders: 1,
                      minimize: true
                    }
                  },
                  {
                    loader: require.resolve('postcss-loader'),
                    options: {
                      ident: 'postcss',
                      sourceMap: true
                    }
                  }
                ]
              })
            }
          ]
        }
      ]
    },

    plugins: [
      new webpack.DefinePlugin(envVars.stringified),
      new CaseSensitivePathsPlugin(),

      new ExtractTextPlugin({
        filename: env === 'production' ? 'css/bundle.[chunkhash:8].css' : 'css/bundle.css'
      }),

      new FriendlyErrorsPlugin({
        verbose: false,
        target
      }),

      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how Webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],

    performance: {
      hints: false
    }
  }

  if (env === 'production') {
    config.output.filename = 'js/bundle.[chunkhash:8].js'
    config.output.chunkFilename = 'js/[name].[chunkhash:8].bundle.js'
  }

  if (env === 'development') {
    config.watch = true
    config.watchOptions = {
      ignored: /node_modules/
    }

    /* config.plugins.push(
      // If you require a missing module and then `npm install` it, you still have
      // to restart the development server for Webpack to discover it. This plugin
      // makes the discovery automatic so you don't have to restart.
      // See https://github.com/facebook/create-react-app/issues/186
      new WatchMissingNodeModulesPlugin(paths.appNodeModules)
    ) */
  }

  return config
}
