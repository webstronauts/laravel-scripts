const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const createBaseConfig = require('./webpack.base')

module.exports = function (env = 'development') {
  return merge(createBaseConfig('node', env), {
    entry: [
      require.resolve('@babel/polyfill'),
      require.resolve('../entry')
    ],

    output: {
      filename: 'server.js',
      libraryTarget: 'commonjs2',
      path: process.cwd()
    },

    externals: nodeExternals({
      // Do not externalize CSS files in case we need to import it from a dep
      whitelist: /\.css$/
    }),

    // We want to uphold node's __filename, and __dirname.
    node: { console: true, __filename: true, __dirname: true }
  })
}
