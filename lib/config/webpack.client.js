const AssetsManifestPlugin = require('webpack-assets-manifest')
const merge = require('webpack-merge')
const paths = require('./paths')
const createBaseConfig = require('./webpack.base')

module.exports = function (env = 'development') {
  return merge(createBaseConfig('web', env), {
    entry: {
      bundle: paths.clientEntry
    },

    plugins: [
      new AssetsManifestPlugin({
        output: paths.appPublicManifest,
        publicPath: true,
        customize: entry => ({
          // The "absolute" key is required for Laravel Mix to work.
          key: `/${entry.key}`, value: entry.value
        })
      })
    ]
  })
}
