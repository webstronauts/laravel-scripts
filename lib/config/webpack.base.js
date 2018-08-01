const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const resolveEnvVars = require('resolve-env-vars')
const webpack = require('webpack')

module.exports = function(options, target, env, helpers) {
  dotenvExpand(dotenv.config({path: helpers.resolveRootFile('.env')}))
  const envVars = resolveEnvVars('LIFTOFF_')

  const config = {
    // Use the configured assets directory as webpack's context.
    context: helpers.resolveSrcFile('.'),
    // Specify mode (either 'development' or 'production')
    mode: env,
    // Specify target (either 'node' or 'web')
    target,

    output: {
      path: helpers.resolveOutputFile('.'),
      publicPath: '/',
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js',
    },

    devtool:
      env === 'production' ? 'nosources-source-map' : 'cheap-module-source-map',

    resolve: {
      // We need to tell webpack how to resolve both our node_modules and
      // the users', so we use resolve and resolveLoader.
      modules: ['node_modules', helpers.resolveRootFile('node_modules')],
      extensions: [
        '.js',
        '.jsx',
        '.json',
        '.graphql',
        '.gql',
        '.scss',
        '.sass',
        '.css',
      ],

      alias: {
        '~': helpers.resolveSrcFile('.'),
      },

      plugins: [
        // Prevents users from importing files from outside of src/ (or node_modules/).
        // This often causes confusion because we only process files within src/ with babel.
        // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
        // please link the files into your node_modules/ and let module-resolution kick in.
        // Make sure your source files are compiled, as they will not be processed in any way.
        new ModuleScopePlugin(helpers.resolveSrcFile('.'), [
          helpers.resolveRootFile('package.json'),
        ]),
      ],
    },

    resolveLoader: {
      modules: [
        helpers.resolveRootFile('node_modules'),
        helpers.resolveOwnFile('node_modules'),
      ],
    },

    module: {
      // Makes missing exports an error instead of warning
      strictExportPresence: true,

      rules: [
        // Disable require.ensure as it's not a standard language feature.
        {parser: {requireEnsure: false}},

        {
          oneOf: [
            {
              // Process application JS with Babel.
              test: /\.js$/,
              exclude: /node_modules/,
              use: [
                require.resolve('thread-loader'),
                {
                  loader: require.resolve('babel-loader'),
                  options: Object.assign(
                    {
                      babelrc: true,
                      cacheDirectory: true,
                      highlightCode: true,
                    },
                    options.babel,
                  ),
                },
              ],
            },

            {
              // Process any JS outside of the app with Babel.
              // Unlike the application JS, we only compile the standard ES features.
              test: /\.js$/,
              use: [
                require.resolve('thread-loader'),
                {
                  loader: require.resolve('babel-loader'),
                  options: {
                    babelrc: false,
                    cacheDirectory: true,
                    highlightCode: true,
                    compact: false,
                    presets: [
                      [
                        require.resolve('@babel/preset-env'),
                        {
                          modules: false,
                        },
                      ],
                    ],
                  },
                },
              ],
            },

            {
              test: /\.(graphql|gql)$/,
              use: {
                loader: require.resolve('graphql-tag/loader'),
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new webpack.DefinePlugin(envVars.stringified),
      new CaseSensitivePathsPlugin(),

      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how Webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],

    performance: {
      hints: false,
    },

    stats: 'none',
  }

  if (env === 'development') {
    config.watch = true
    config.watchOptions = {
      ignored: /node_modules/,
    }
  }

  return config
}
