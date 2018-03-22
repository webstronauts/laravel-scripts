const AssetsManifestPlugin = require('webpack-assets-manifest')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = function () {
  return merge(baseConfig, {
    entry: {
      bundle: [
        require.resolve('@babel/polyfill'),
        './js/entry-client.js'
      ]
    },

    target: 'web',

    plugins: [
      new AssetsManifestPlugin({
        output: 'mix-manifest.json',
        publicPath: '/',
        // The "absolute" key and values are required for Laravel Mix to work.
        customize: (key, value) => ({ key: `/${key}`, value })
      })
    ]
  })
}
