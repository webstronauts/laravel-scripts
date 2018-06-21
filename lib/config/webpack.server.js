const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const createBaseConfig = require('./webpack.base')

module.exports = function(options, env = 'development') {
  return merge(createBaseConfig(options, 'node', env), {
    entry: require.resolve('../entry'),

    output: {
      filename: 'server.js',
      libraryTarget: 'commonjs2',
      path: process.cwd(),
    },

    externals: nodeExternals({
      // Do not externalize CSS files in case we need to import it from a dep
      whitelist: [/\.(svg|png|jpg|jpeg|gif|ico)$/, /\.(css|s[ac]ss)$/],
    }),

    // We want to uphold node's __filename, and __dirname.
    node: {console: true, __filename: true, __dirname: true},

    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.(css|s[ac]ss)$/,
              use: {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                },
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
  })
}
