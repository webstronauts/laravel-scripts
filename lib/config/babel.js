module.exports = function(api, opts) {
  return {
    presets: [
      [
        require.resolve('babel-preset-react-app'),
        {
          flow: opts.flow,
        },
      ],
    ],
  }
}
