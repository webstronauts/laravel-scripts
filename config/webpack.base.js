const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  context: path.resolve(process.cwd(), 'resources/assets'),

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
