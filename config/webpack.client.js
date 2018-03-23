const AssetsManifestPlugin = require('webpack-assets-manifest')
const merge = require('webpack-merge')
const paths = require('./paths')
const createBaseConfig = require('./webpack.base')

module.exports = function (env = 'development') {
  return merge(createBaseConfig('web', env), {
    entry: {
      bundle: [
        require.resolve('@babel/polyfill'),
        paths.clientEntry
      ]
    },

    plugins: [
      new AssetsManifestPlugin({
        output: paths.appPublicManifest,
        publicPath: '/',
        // The "absolute" key and values are required for Laravel Mix to work.
        customize: (key, value) => ({ key: `/${key}`, value })
      })
    ]
  })
}
