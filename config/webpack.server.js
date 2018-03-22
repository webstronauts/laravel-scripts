const nodeExternals = require('webpack-node-externals')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = function () {
  return merge(baseConfig, {
    entry: [
      require.resolve('@babel/polyfill'),
      './js/entry-server.js'
    ],

    target: 'node',

    output: {
      filename: 'server.js',
      libraryTarget: 'commonjs2',
      path: process.cwd()
    },

    externals: nodeExternals({
      // Do not externalize CSS files in case we need to import it from a dep
      whitelist: /\.css$/
    })
  })
}
