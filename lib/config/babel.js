module.exports = function(api, opts) {
  console.log(opts)

  return {
    presets: [require.resolve('babel-preset-react-app')],
  }
}
