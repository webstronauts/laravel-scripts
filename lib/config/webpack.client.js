const AssetsPlugin = require('webpack-assets-manifest')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const merge = require('webpack-merge')
const paths = require('./paths')
const webpack = require('webpack')
const createBaseConfig = require('./webpack.base')

module.exports = function(options, env = 'development') {
  return merge(createBaseConfig(options, 'web', env), {
    entry: {
      bundle: paths.clientEntry,
    },

    plugins: [
      new AssetsPlugin({
        output: paths.appPublicManifest,
        publicPath: true,
        customize: entry => ({
          // The "absolute" key is required for Laravel Mix to work.
          key: `/${entry.key}`,
          value: entry.value,
        }),
      }),
    ].concat(
      env === 'production'
        ? [
            new webpack.HashedModuleIdsPlugin(),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.optimize.AggressiveMergingPlugin(),
          ]
        : [],
    ),

    optimization:
      env === 'production'
        ? {
            minimize: true,
            minimizer: [
              new UglifyJsPlugin({
                uglifyOptions: {
                  parse: {
                    // we want uglify-js to parse ecma 8 code. However, we don't want it
                    // to apply any minfication steps that turns valid ecma 5 code
                    // into invalid ecma 5 code. This is why the 'compress' and 'output'
                    // sections only apply transformations that are ecma 5 safe
                    // https://github.com/facebook/create-react-app/pull/4234
                    ecma: 8,
                  },
                  compress: {
                    ecma: 5,
                    warnings: false,
                    // Disabled because of an issue with Uglify breaking seemingly valid code:
                    // https://github.com/facebook/create-react-app/issues/2376
                    // Pending further investigation:
                    // https://github.com/mishoo/UglifyJS2/issues/2011
                    comparisons: false,
                  },
                  mangle: {
                    safari10: true,
                  },
                  output: {
                    ecma: 5,
                    comments: false,
                    // Turned on because emoji and regex is not minified properly using default
                    // https://github.com/facebook/create-react-app/issues/2488
                    ascii_only: true,
                  },
                },
                // Use multi-process parallel running to improve the build speed
                // Default number of concurrent runs: os.cpus().length - 1
                parallel: true,
                // Enable file caching
                cache: true,
                // @todo add flag for sourcemaps
                sourceMap: true,
              }),
            ],
          }
        : {},
  })
}
