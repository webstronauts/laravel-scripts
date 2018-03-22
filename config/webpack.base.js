const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')

module.exports = function (target = 'web', env = 'development') {
  const config = {
    // Use Laravel's default assets directory as webpack's context.
    context: path.resolve(process.cwd(), 'resources/assets'),
    // Specify mode (either 'development' or 'production')
    mode: env,
    // Specify target (either 'node' or 'web')
    target,

    output: {
      path: path.resolve(process.cwd(), 'public'),
      filename: 'js/[name].js'
    },

    resolve: {
      extensions: ['.js', '.jsx', '.json', '.graphql', '.gql', '.scss', '.sass', '.css']
    },

    module: {
      rules: [
        {
          oneOf: [
            {
              // Process application JS with Babel.
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: require.resolve('babel-loader'),
                options: {
                  babelrc: true,
                  cacheDirectory: true,
                  // Move this to a separate package
                  presets: [
                    [require.resolve('@babel/preset-env'), {
                      'modules': false
                    }],
                    require.resolve('@babel/preset-react'),
                    require.resolve('@babel/preset-stage-2')
                  ]
                }
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
              test: /\.css$/,
              loader: ExtractTextPlugin.extract({
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
      new ExtractTextPlugin({
        filename: 'css/bundle.css'
      })
    ]
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
      new WatchMissingNodeModulesPlugin(path.resolve('node_modules'))
    ) */
  }

  return config
}
