const fs = require('fs')
const AssetsPlugin = require('webpack-assets-manifest')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const autoprefixer = require('autoprefixer')
const merge = require('webpack-merge')
const paths = require('./paths')
const webpack = require('webpack')
const createBaseConfig = require('./webpack.base')

module.exports = function(options, env = 'development') {
  const hasPostcssConfig = fs.existsSync(paths.appPostcss)

  return merge(createBaseConfig(options, 'web', env), {
    entry: {
      app: [paths.ownPolyfillsPath, paths.clientEntry],
    },

    output: {
      filename:
        env === 'production' ? 'js/[name].[chunkhash:8].js' : 'js/app.js',
      chunkFilename:
        env === 'production' ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
    },

    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.s[ac]ss$/,
          use: {
            loader: require.resolve('sass-loader'),
            options: {
              sourceMap: true,
            },
          },
        },

        {
          oneOf: [
            {
              test: /\.(css|s[ac]ss)$/,
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    minimize: false,
                  },
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: Object.assign(
                    {
                      // Necessary for external CSS imports to work
                      // https://github.com/facebookincubator/create-react-app/issues/2677
                      ident: 'postcss',
                      sourceMap: true,
                    },
                    !hasPostcssConfig
                      ? {
                          plugins: () => [
                            require.resolve('postcss-flexbugs-fixes'),
                            autoprefixer({
                              browsers: [
                                '>1%',
                                'last 4 versions',
                                'Firefox ESR',
                                // React doesn't support IE8 anyway
                                'not ie < 9',
                              ],
                              flexbox: 'no-2009',
                            }),
                          ],
                        }
                      : {},
                  ),
                },
              ],
            },
          ],
        },
      ],
    },

    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      // eslint-disable-next-line camelcase
      child_process: 'empty',
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

      new MiniCssExtractPlugin({
        filename:
          env === 'production'
            ? 'css/bundle.[chunkhash:8].css'
            : 'css/bundle.css',
        // allChunks: true because we want all css to be included in the main
        // css bundle when doing code splitting to avoid FOUC:
        // https://github.com/facebook/create-react-app/issues/2415
        allChunks: true,
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
              new OptimizeCssAssetsPlugin(),
            ],
            splitChunks: {
              chunks: 'all',
              cacheGroups: {
                default: false,
                vendors: false,
              },
            },
            // Keep the runtime chunk seperated to enable long term caching
            // https://twitter.com/wSokra/status/969679223278505985
            runtimeChunk: {name: 'runtime'},
          }
        : {},
  })
}
